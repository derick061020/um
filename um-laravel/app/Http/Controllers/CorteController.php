<?php

namespace App\Http\Controllers;

use App\Models\Abono;
use App\Support\Fechas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Corte del día. Es la pantalla única de la ENCARGADA: solo ve el total a
 * cobrar, nunca nombres, domicilios ni importes por clienta.
 */
class CorteController extends Controller
{
    public function index(Request $request): View
    {
        $fecha = $request->query('fecha')
            ? Fechas::parse($request->query('fecha'))
            : Fechas::sabadoDeCobro();

        $fechaISO = $fecha->format('Y-m-d');

        $abonos = Abono::whereDate('fecha_programada', $fechaISO)->get();

        $esperado = (int) $abonos->sum('monto_esperado');
        $cobrado = (int) $abonos->sum('monto_pagado');

        $usuario = Auth::user();

        // La encargada ve el total y nada más. Supervisión y dirección
        // además ven el desglose por grupo, que sí incluye nombres de grupo.
        $porGrupo = collect();

        if ($usuario->puede('reportes.ver')) {
            $porGrupo = Abono::whereDate('fecha_programada', $fechaISO)
                ->with('credito.grupo:id,nombre')
                ->get()
                ->groupBy(fn ($a) => $a->credito->grupo->nombre ?? 'Sin grupo')
                ->map(fn ($items, $nombre) => [
                    'grupo' => $nombre,
                    'clientas' => $items->count(),
                    'esperado' => (int) $items->sum('monto_esperado'),
                    'cobrado' => (int) $items->sum('monto_pagado'),
                ])
                ->sortBy('grupo')
                ->values();
        }

        return view('corte.index', [
            'fecha' => $fecha,
            'esperado' => $esperado,
            'cobrado' => $cobrado,
            'faltante' => max(0, $esperado - $cobrado),
            'clientas' => $abonos->count(),
            'pagados' => $abonos->where('estado', 'PAGADO')->count(),
            'porGrupo' => $porGrupo,
            'verDesglose' => $usuario->puede('reportes.ver'),
        ]);
    }
}
