<?php

namespace App\Http\Controllers;

use App\Models\Abono;
use App\Models\Cliente;
use App\Models\Credito;
use App\Models\Pago;
use App\Services\CreditoService;
use App\Support\Fechas;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class PanelController extends Controller
{
    public function index(CreditoService $servicio): View
    {
        // Se recalculan los vencidos al abrir el panel: así no hace falta una
        // tarea programada, que en hosting compartido no siempre existe.
        $servicio->actualizarVencidos();

        $referencia = Fechas::hoy();
        $sabado = Fechas::sabadoDeCobro($referencia);

        $abiertos = ['ACTIVO', 'VENCIDO'];

        $abonosSabado = Abono::whereDate('fecha_programada', $sabado->format('Y-m-d'))
            ->whereHas('credito', fn ($q) => $q->whereIn('estado', $abiertos))
            ->get(['monto_esperado', 'monto_pagado']);

        // Cartera activa: lo que falta por cobrar de los créditos vigentes.
        $carteraActiva = 0;
        $activos = Credito::where('estado', 'ACTIVO')
            ->withSum('abonos as pagado', 'monto_pagado')
            ->get(['id', 'monto_total']);

        foreach ($activos as $c) {
            $carteraActiva += max(0, $c->monto_total - (int) $c->pagado);
        }

        $atrasoTotal = 0;
        $atrasados = Abono::whereDate('fecha_programada', '<', $referencia->format('Y-m-d'))
            ->where('estado', '!=', 'PAGADO')
            ->whereHas('credito', fn ($q) => $q->whereIn('estado', $abiertos))
            ->get(['monto_esperado', 'monto_pagado']);

        foreach ($atrasados as $a) {
            $atrasoTotal += $a->monto_esperado - $a->monto_pagado;
        }

        return view('panel.index', [
            'nombre' => explode(' ', Auth::user()->nombre)[0],
            'referencia' => $referencia,
            'sabado' => $sabado,
            'esperadoSabado' => (int) $abonosSabado->sum('monto_esperado'),
            'cobradoSabado' => (int) $abonosSabado->sum('monto_pagado'),
            'carteraActiva' => $carteraActiva,
            'creditosActivos' => $activos->count(),
            'atrasoTotal' => $atrasoTotal,
            'vencidos' => Credito::where('estado', 'VENCIDO')->count(),
            'clientas' => Cliente::where('activo', true)->count(),
            'ultimos' => Pago::where('anulado', false)
                ->with(['registradoPor:id,nombre', 'credito:id,cliente_id', 'credito.cliente:id,nombre'])
                ->orderByDesc('created_at')
                ->orderByDesc('id')
                ->limit(8)
                ->get(),
        ]);
    }
}
