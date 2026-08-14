<?php

namespace App\Http\Controllers;

use App\Models\Abono;
use App\Models\Cliente;
use App\Models\Credito;
use App\Models\Grupo;
use App\Services\CreditoService;
use App\Support\Fechas;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class PanelController extends Controller
{
    public function index(CreditoService $servicio): View
    {
        // Se recalculan los vencidos al abrir el panel: así no hace falta una
        // tarea programada, que en hosting compartido no siempre existe.
        $servicio->actualizarVencidos();

        $sabado = Fechas::sabadoDeCobro();
        $sabadoISO = $sabado->format('Y-m-d');

        $delSabado = Abono::whereDate('fecha_programada', $sabadoISO)->get();

        $porCobrar = (int) $delSabado->sum('monto_esperado');
        $cobrado = (int) $delSabado->sum('monto_pagado');

        $activos = Credito::where('estado', 'ACTIVO')->count();
        $vencidos = Credito::where('estado', 'VENCIDO')->count();
        $liquidados = Credito::where('estado', 'LIQUIDADO')->count();

        $carteraActiva = (int) Credito::whereIn('estado', ['ACTIVO', 'VENCIDO'])->sum('monto_total');
        $cobradoTotal = (int) Abono::whereHas('credito', function ($q) {
            $q->whereIn('estado', ['ACTIVO', 'VENCIDO']);
        })->sum('monto_pagado');

        // Atrasos: abonos ya vencidos que no están pagados.
        $hoyISO = Fechas::hoy()->format('Y-m-d');
        $atrasados = Abono::whereDate('fecha_programada', '<', $hoyISO)
            ->where('estado', '!=', 'PAGADO')
            ->with(['credito.cliente:id,nombre,folio', 'credito.grupo:id,nombre'])
            ->orderBy('fecha_programada')
            ->limit(15)
            ->get();

        $montoAtrasado = (int) Abono::whereDate('fecha_programada', '<', $hoyISO)
            ->where('estado', '!=', 'PAGADO')
            ->sum(DB::raw('monto_esperado - monto_pagado'));

        return view('panel.index', [
            'sabado' => $sabado,
            'porCobrar' => $porCobrar,
            'cobrado' => $cobrado,
            'activos' => $activos,
            'vencidos' => $vencidos,
            'liquidados' => $liquidados,
            'carteraActiva' => $carteraActiva,
            'cobradoTotal' => $cobradoTotal,
            'saldoCartera' => max(0, $carteraActiva - $cobradoTotal),
            'clientas' => Cliente::where('activo', true)->count(),
            'grupos' => Grupo::where('activo', true)->count(),
            'atrasados' => $atrasados,
            'montoAtrasado' => $montoAtrasado,
        ]);
    }
}
