<?php

namespace App\Http\Controllers;

use App\Models\Abono;
use App\Models\Grupo;
use App\Services\Bitacora;
use App\Services\CreditoService;
use App\Support\Dinero;
use App\Support\Fechas;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class CobranzaController extends Controller
{
    /** Lista de cobro de un sábado, por grupo. */
    public function index(Request $request): View
    {
        $fecha = $request->query('fecha')
            ? Fechas::parse($request->query('fecha'))
            : Fechas::sabadoDeCobro();

        $fechaISO = $fecha->format('Y-m-d');
        $grupoId = $request->query('grupo');

        $consulta = Abono::query()
            ->whereDate('fecha_programada', $fechaISO)
            ->with([
                'credito:id,folio,cliente_id,grupo_id,monto_total,estado',
                'credito.cliente:id,nombre,folio,telefono',
                'credito.grupo:id,nombre',
            ]);

        if ($grupoId) {
            $consulta->whereHas('credito', fn ($q) => $q->where('grupo_id', $grupoId));
        }

        $abonos = $consulta->get()->sortBy([
            fn ($a, $b) => strcmp($a->credito->grupo->nombre ?? '', $b->credito->grupo->nombre ?? ''),
            fn ($a, $b) => strcmp($a->credito->cliente->nombre ?? '', $b->credito->cliente->nombre ?? ''),
        ])->values();

        return view('cobranza.index', [
            'fecha' => $fecha,
            'abonos' => $abonos,
            'grupos' => Grupo::where('activo', true)->orderBy('nombre')->get(),
            'grupoId' => $grupoId,
            'esperado' => (int) $abonos->sum('monto_esperado'),
            'cobrado' => (int) $abonos->sum('monto_pagado'),
        ]);
    }

    /** Botón de un toque: deja el abono pagado completo. */
    public function marcar(Abono $abono, CreditoService $servicio): RedirectResponse
    {
        $servicio->marcarCompleto($abono->id, Auth::id());

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'abono.marcar',
            'entidad' => 'abono',
            'entidad_id' => (string) $abono->id,
            'detalle' => ['credito' => $abono->credito->folio, 'semana' => $abono->semana],
        ]);

        return back()->with('exito', 'Abono marcado como pagado.');
    }

    /** Abono parcial: la clienta entregó menos de lo que tocaba. */
    public function abonar(Request $request, Abono $abono, CreditoService $servicio): RedirectResponse
    {
        $datos = $request->validate([
            'monto' => ['required', 'string'],
        ], [], ['monto' => 'monto']);

        try {
            $centavos = Dinero::aCentavos($datos['monto']);
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['monto' => $e->getMessage()]);
        }

        if ($centavos <= 0) {
            return back()->withErrors(['monto' => 'El monto debe ser mayor a cero.']);
        }

        $servicio->registrarPago($abono->id, $centavos, Auth::id());

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'abono.parcial',
            'entidad' => 'abono',
            'entidad_id' => (string) $abono->id,
            'detalle' => [
                'credito' => $abono->credito->folio,
                'semana' => $abono->semana,
                'monto' => Dinero::pesos($centavos),
            ],
        ]);

        return back()->with('exito', 'Abono de '.Dinero::pesos($centavos).' registrado.');
    }

    /** Corrección de captura: cancela el último movimiento del abono. */
    public function anular(Abono $abono, CreditoService $servicio): RedirectResponse
    {
        try {
            $servicio->anularUltimoPago($abono->id, Auth::id());
        } catch (\RuntimeException $e) {
            return back()->withErrors(['abono' => $e->getMessage()]);
        }

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'abono.anular',
            'entidad' => 'abono',
            'entidad_id' => (string) $abono->id,
            'detalle' => ['credito' => $abono->credito->folio, 'semana' => $abono->semana],
        ]);

        return back()->with('exito', 'Se canceló el último movimiento.');
    }
}
