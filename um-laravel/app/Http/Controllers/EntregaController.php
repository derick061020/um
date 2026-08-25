<?php

namespace App\Http\Controllers;

use App\Models\EntregaSemanal;
use App\Models\Grupo;
use App\Services\Bitacora;
use App\Services\EntregaService;
use App\Support\Dinero;
use App\Support\Fechas;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Hoja semanal del supervisor. "Debe entregar" lo calcula el sistema; el
 * supervisor captura lo que realmente entregó, faltantes y adelantos. El admin
 * cierra la semana.
 */
class EntregaController extends Controller
{
    public function index(Request $request, EntregaService $servicio): View
    {
        $usuario = Auth::user();

        $sabado = $request->query('fecha')
            ? Fechas::parse($request->query('fecha'))
            : Fechas::sabadoDeCobro();

        // Cada quien ve solo sus grupos (el admin ve todos).
        $grupos = Grupo::visiblesPara($usuario)
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();

        $filas = $grupos->map(function (Grupo $g) use ($servicio, $sabado, $usuario) {
            // Al abrir, se asegura la fila de la semana y su "debe entregar".
            $entrega = $usuario->puede('entregas.capturar') || $usuario->puede('cierre.cerrar')
                ? $servicio->obtenerOAbrir($g, $sabado, $usuario->id)
                : EntregaSemanal::where('grupo_id', $g->id)
                    ->whereDate('fecha', $sabado->format('Y-m-d'))->first()
                    ?? new EntregaSemanal(['grupo_id' => $g->id, 'fecha' => $sabado->format('Y-m-d')]);

            if (! $entrega->exists) {
                $entrega->debe_entregar = $servicio->debeEntregar($g->id, $sabado);
            }

            // Las clientas que cobran ese sábado (nombre, semana, pago) — lo que
            // forma el "debe entregar".
            $clientas = \App\Models\Abono::whereDate('fecha_programada', $sabado->format('Y-m-d'))
                ->whereHas('credito', fn ($q) => $q->where('grupo_id', $g->id)
                    ->whereIn('estado', ['ACTIVO', 'VENCIDO']))
                ->with(['credito:id,cliente_id,num_semanas', 'credito.cliente:id,nombre'])
                ->get()
                ->sortBy(fn ($a) => $a->credito->cliente->nombre ?? '')
                ->values();

            return ['grupo' => $g, 'entrega' => $entrega, 'clientas' => $clientas];
        });

        return view('entregas.index', [
            'fecha' => $sabado,
            'filas' => $filas,
            'puedeCapturar' => $usuario->puede('entregas.capturar'),
            'puedeCerrar' => $usuario->puede('cierre.cerrar'),
        ]);
    }

    public function capturar(Request $request, Grupo $grupo, EntregaService $servicio): RedirectResponse
    {
        $this->autorizarGrupo($grupo);

        $datos = $request->validate([
            'fecha' => ['required', 'date_format:Y-m-d'],
            'prestamo' => ['nullable', 'string'],
            'entrego' => ['nullable', 'string'],
            'faltante' => ['nullable', 'string'],
            'adelantado' => ['nullable', 'string'],
            'notas' => ['nullable', 'string', 'max:500'],
        ]);

        $sabado = Fechas::parse($datos['fecha']);
        $entrega = $servicio->obtenerOAbrir($grupo, $sabado, Auth::id());

        try {
            $servicio->capturar($entrega, [
                'prestamo' => Dinero::aCentavos($datos['prestamo'] ?: '0'),
                'entrego' => Dinero::aCentavos($datos['entrego'] ?: '0'),
                'faltante' => Dinero::aCentavos($datos['faltante'] ?: '0'),
                'adelantado' => Dinero::aCentavos($datos['adelantado'] ?: '0'),
                'notas' => $datos['notas'] ?? null,
            ], Auth::id());
        } catch (\Throwable $e) {
            return back()->withErrors(['entrego' => $e->getMessage()]);
        }

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'entrega.capturar',
            'entidad' => 'entrega',
            'entidad_id' => (string) $entrega->id,
            'detalle' => ['grupo' => $grupo->nombre, 'fecha' => $datos['fecha'], 'entrego' => Dinero::pesos($entrega->entrego)],
        ]);

        return back()->with('exito', 'Entrega de '.$grupo->nombre.' registrada.');
    }

    public function cerrar(Request $request, EntregaSemanal $entrega, EntregaService $servicio): RedirectResponse
    {
        try {
            $servicio->cerrar($entrega, Auth::id());
        } catch (\Throwable $e) {
            return back()->withErrors(['cierre' => $e->getMessage()]);
        }

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'semana.cerrar',
            'entidad' => 'entrega',
            'entidad_id' => (string) $entrega->id,
            'detalle' => [
                'grupo' => $entrega->grupo->nombre,
                'fecha' => $entrega->fecha->format('Y-m-d'),
                'debe_entregar' => Dinero::pesos($entrega->debe_entregar),
                'entrego' => Dinero::pesos($entrega->entrego),
            ],
        ]);

        return back()->with('exito', 'Semana cerrada. Ya no se puede modificar salvo por el admin.');
    }

    public function reabrir(EntregaSemanal $entrega, EntregaService $servicio): RedirectResponse
    {
        $servicio->reabrir($entrega);

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'semana.reabrir',
            'entidad' => 'entrega',
            'entidad_id' => (string) $entrega->id,
            'detalle' => ['grupo' => $entrega->grupo->nombre, 'fecha' => $entrega->fecha->format('Y-m-d')],
        ]);

        return back()->with('exito', 'Semana reabierta.');
    }

    /** El supervisor solo puede tocar sus propios grupos. */
    private function autorizarGrupo(Grupo $grupo): void
    {
        $usuario = Auth::user();
        if ($usuario->rol === \App\Support\Rbac::SUPERVISOR && $grupo->supervisor_id !== $usuario->id) {
            abort(403, 'Ese grupo no está asignado a tu cuenta.');
        }
    }
}
