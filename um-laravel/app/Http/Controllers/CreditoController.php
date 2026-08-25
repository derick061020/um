<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Credito;
use App\Models\Grupo;
use App\Services\Bitacora;
use App\Services\CreditoService;
use App\Support\Dinero;
use App\Support\Fechas;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class CreditoController extends Controller
{
    public function index(Request $request): View
    {
        $estado = $request->query('estado', 'TODOS');
        $grupoId = $request->query('grupo');

        $consulta = Credito::query()
            ->with(['cliente:id,nombre,folio', 'grupo:id,nombre'])
            ->withSum('abonos as pagado', 'monto_pagado');

        if ($estado && $estado !== 'TODOS') {
            $consulta->where('estado', $estado);
        }

        if ($grupoId) {
            $consulta->where('grupo_id', $grupoId);
        }

        return view('creditos.index', [
            'creditos' => $consulta->orderByDesc('fecha_entrega')->paginate(30)->withQueryString(),
            'grupos' => Grupo::where('activo', true)->orderBy('nombre')->get(),
            'estado' => $estado,
            'grupoId' => $grupoId,
        ]);
    }

    public function crear(Request $request): View
    {
        return view('creditos.nuevo', [
            'clientas' => Cliente::where('activo', true)->orderBy('nombre')->get(['id', 'nombre', 'folio', 'grupo_id']),
            'grupos' => Grupo::where('activo', true)->orderBy('nombre')->get(),
            'clientaId' => $request->query('clienta'),
            'calendario' => null,
        ]);
    }

    /**
     * Vista previa del calendario ANTES de guardar. Es un requisito de la
     * operación: se confirma la fecha de entrega y los 12 sábados a la vista.
     */
    public function calendario(Request $request): View
    {
        $datos = $this->validar($request);

        [$entrega, $calendario, $montos, $error] = $this->calcular($datos);

        return view('creditos.nuevo', [
            'clientas' => Cliente::where('activo', true)->orderBy('nombre')->get(['id', 'nombre', 'folio', 'grupo_id']),
            'grupos' => Grupo::where('activo', true)->orderBy('nombre')->get(),
            'clientaId' => $datos['cliente_id'],
            'calendario' => $error ? null : $calendario,
            'montos' => $montos,
            'entrega' => $entrega,
            'datos' => $datos,
            'avisoFecha' => $error,
        ]);
    }

    public function guardar(Request $request, CreditoService $servicio): RedirectResponse
    {
        $datos = $this->validar($request);

        $clienta = Cliente::findOrFail($datos['cliente_id']);

        // Una clienta no puede llevar dos créditos abiertos a la vez.
        $abierto = Credito::where('cliente_id', $clienta->id)
            ->whereIn('estado', ['ACTIVO', 'VENCIDO'])
            ->first();

        if ($abierto) {
            return back()->withInput()->withErrors([
                'cliente_id' => $clienta->nombre.' todavía tiene el crédito '
                    .$abierto->folioFormateado().' sin liquidar.',
            ]);
        }

        try {
            $prestado = Dinero::aCentavos($datos['monto_prestado']);
            $total = Dinero::aCentavos($datos['monto_total']);
        } catch (\InvalidArgumentException $e) {
            return back()->withInput()->withErrors(['monto_prestado' => $e->getMessage()]);
        }

        if ($total < $prestado) {
            return back()->withInput()->withErrors([
                'monto_total' => 'El total a pagar no puede ser menor a lo prestado.',
            ]);
        }

        $credito = $servicio->crear([
            'cliente_id' => $clienta->id,
            'grupo_id' => $datos['grupo_id'] ?? $clienta->grupo_id,
            'monto_prestado' => $prestado,
            'monto_total' => $total,
            'num_semanas' => (int) $datos['num_semanas'],
            'fecha_entrega' => $datos['fecha_entrega'],
            'notas' => $datos['notas'] ?? null,
            'capturado_por_id' => Auth::id(),
        ]);

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'credito.crear',
            'entidad' => 'credito',
            'entidad_id' => (string) $credito->id,
            'detalle' => [
                'folio' => $credito->folio,
                'clienta' => $clienta->nombre,
                'total' => Dinero::pesos($total),
            ],
        ]);

        return redirect()->route('creditos.ficha', $credito)
            ->with('exito', 'Crédito '.$credito->folioFormateado().' registrado.');
    }

    public function ficha(Credito $credito): View
    {
        $credito->load([
            'cliente', 'grupo:id,nombre', 'abonos', 'capturadoPor:id,nombre',
            'renovadoDe:id,folio', 'renovacion:id,folio,renovado_de_id',
        ]);

        return view('creditos.ficha', [
            'credito' => $credito,
            'resumen' => CreditoService::resumir($credito, $credito->abonos),
        ]);
    }

    // --- Renovación ---------------------------------------------------------

    public function renovarForm(Credito $credito, CreditoService $servicio): View|RedirectResponse
    {
        if (! $credito->estaAbierto()) {
            return redirect()->route('creditos.ficha', $credito)
                ->withErrors(['credito' => 'Solo se puede renovar un crédito abierto.']);
        }

        $credito->load(['cliente', 'abonos']);

        return view('creditos.renovar', [
            'credito' => $credito,
            'saldo' => $servicio->saldoPendiente($credito),
            'calendario' => null,
        ]);
    }

    public function renovar(Request $request, Credito $credito, CreditoService $servicio): View|RedirectResponse
    {
        if (! $credito->estaAbierto()) {
            return redirect()->route('creditos.ficha', $credito)
                ->withErrors(['credito' => 'Solo se puede renovar un crédito abierto.']);
        }

        $datos = $request->validate([
            'monto_prestado' => ['required', 'string'],
            'monto_total' => ['required', 'string'],
            'num_semanas' => ['required', 'integer', 'min:1', 'max:104'],
            'fecha_entrega' => ['required', 'date_format:Y-m-d'],
            'notas' => ['nullable', 'string', 'max:1000'],
        ], [], [
            'monto_prestado' => 'monto prestado',
            'monto_total' => 'total a pagar',
            'fecha_entrega' => 'fecha de entrega',
        ]);

        try {
            $prestado = Dinero::aCentavos($datos['monto_prestado']);
            $total = Dinero::aCentavos($datos['monto_total']);
            $entrega = Fechas::parse($datos['fecha_entrega']);
        } catch (\InvalidArgumentException $e) {
            return back()->withInput()->withErrors(['monto_prestado' => $e->getMessage()]);
        }

        if ($total < $prestado) {
            return back()->withInput()->withErrors(['monto_total' => 'El total a pagar no puede ser menor a lo prestado.']);
        }

        $semanas = (int) $datos['num_semanas'];
        $calendario = Fechas::generarCalendario($entrega, $semanas);
        $montos = Dinero::repartirAbonos($total, $semanas);

        // Sin confirmar: se muestra el calendario del nuevo crédito para revisarlo.
        if (! $request->boolean('confirmar')) {
            $credito->load(['cliente', 'abonos']);

            return view('creditos.renovar', [
                'credito' => $credito,
                'saldo' => $servicio->saldoPendiente($credito),
                'calendario' => $calendario,
                'montos' => $montos,
                'entrega' => $entrega,
                'datos' => $datos,
            ]);
        }

        $res = $servicio->renovar($credito->id, [
            'grupo_id' => $credito->grupo_id,
            'monto_prestado' => $prestado,
            'monto_total' => $total,
            'num_semanas' => $semanas,
            'fecha_entrega' => $datos['fecha_entrega'],
            'notas' => $datos['notas'] ?? null,
        ], Auth::id());

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'credito.renovar',
            'entidad' => 'credito',
            'entidad_id' => (string) $res['nuevo']->id,
            'detalle' => [
                'anterior' => $res['anterior']->folio,
                'nuevo' => $res['nuevo']->folio,
                'saldo_liquidado' => Dinero::pesos($res['saldo_liquidado']),
            ],
        ]);

        return redirect()->route('creditos.ficha', $res['nuevo'])->with('exito',
            'Renovación hecha: el crédito '.$res['anterior']->folioFormateado()
            .' quedó liquidado y arranca el '.$res['nuevo']->folioFormateado().' en la semana 1.');
    }

    // --- Corrección del admin ----------------------------------------------

    public function corregir(Request $request, Credito $credito, CreditoService $servicio): RedirectResponse
    {
        $datos = $request->validate([
            'monto_prestado' => ['required', 'string'],
            'monto_total' => ['required', 'string'],
            'num_semanas' => ['required', 'integer', 'min:1', 'max:104'],
            'fecha_entrega' => ['required', 'date_format:Y-m-d'],
            'estado' => ['required', 'in:ACTIVO,VENCIDO,LIQUIDADO,CANCELADO,RENOVADO'],
            'motivo' => ['required', 'string', 'min:4', 'max:300'],
            'notas' => ['nullable', 'string', 'max:1000'],
        ], [], ['motivo' => 'motivo de la corrección']);

        try {
            $cambios = [
                'monto_prestado' => Dinero::aCentavos($datos['monto_prestado']),
                'monto_total' => Dinero::aCentavos($datos['monto_total']),
                'num_semanas' => (int) $datos['num_semanas'],
                'fecha_entrega' => $datos['fecha_entrega'],
                'estado' => $datos['estado'],
                'notas' => $datos['notas'] ?? $credito->notas,
            ];
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['monto_prestado' => $e->getMessage()]);
        }

        $res = $servicio->corregir($credito->id, $cambios, Auth::id());

        // Bitácora sensible: usuario, fecha, valor anterior, valor nuevo y motivo.
        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'credito.corregir',
            'entidad' => 'credito',
            'entidad_id' => (string) $credito->id,
            'detalle' => [
                'motivo' => $datos['motivo'],
                'antes' => $res['antes'],
                'despues' => $res['despues'],
            ],
        ]);

        return redirect()->route('creditos.ficha', $credito)
            ->with('exito', 'Crédito corregido. El cambio quedó registrado en la bitácora.');
    }

    /** @return array<string, mixed> */
    private function validar(Request $request): array
    {
        return $request->validate([
            'cliente_id' => ['required', 'exists:clientes,id'],
            'grupo_id' => ['nullable', 'exists:grupos,id'],
            'monto_prestado' => ['required', 'string'],
            'monto_total' => ['required', 'string'],
            'num_semanas' => ['required', 'integer', 'min:1', 'max:104'],
            'fecha_entrega' => ['required', 'date_format:Y-m-d'],
            'notas' => ['nullable', 'string', 'max:1000'],
        ], [], [
            'cliente_id' => 'clienta',
            'monto_prestado' => 'monto prestado',
            'monto_total' => 'total a pagar',
            'fecha_entrega' => 'fecha de entrega',
        ]);
    }

    /**
     * @param  array<string, mixed>  $datos
     * @return array{0:\DateTimeImmutable|null, 1:array<int,mixed>, 2:array<int,int>, 3:string|null}
     */
    private function calcular(array $datos): array
    {
        try {
            $entrega = Fechas::parse($datos['fecha_entrega']);
            $total = Dinero::aCentavos($datos['monto_total']);
            $semanas = (int) $datos['num_semanas'];

            $calendario = Fechas::generarCalendario($entrega, $semanas);
            $montos = Dinero::repartirAbonos($total, $semanas);

            // No se bloquea entregar en otro día, pero sí se avisa.
            $aviso = Fechas::esLunes($entrega)
                ? null
                : 'Ojo: la entrega no cae en lunes. El primer abono se recorre al sábado siguiente.';

            return [$entrega, $calendario, $montos, $aviso];
        } catch (\InvalidArgumentException $e) {
            return [null, [], [], $e->getMessage()];
        }
    }
}
