<?php

namespace App\Http\Controllers;

use App\Models\Abono;
use App\Models\Grupo;
use App\Support\Fechas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Pantalla de la encargada: sus clientas del sábado, con el abono, la semana y
 * la fecha. Sencilla y de solo lectura; no modifica nada financiero.
 */
class EncargadaController extends Controller
{
    public function index(Request $request): View
    {
        $usuario = Auth::user();

        $sabado = $request->query('fecha')
            ? Fechas::parse($request->query('fecha'))
            : Fechas::sabadoDeCobro();

        // Solo sus grupos.
        $grupos = Grupo::visiblesPara($usuario)
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();

        $porGrupo = $grupos->map(function (Grupo $g) use ($sabado) {
            $abonos = Abono::whereDate('fecha_programada', $sabado->format('Y-m-d'))
                ->whereHas('credito', fn ($q) => $q->where('grupo_id', $g->id)
                    ->whereIn('estado', ['ACTIVO', 'VENCIDO']))
                ->with([
                    // Sin ->select(): un select explícito borra el agregado de withSum.
                    'credito' => fn ($q) => $q->withSum('abonos as pagado', 'monto_pagado'),
                    'credito.cliente:id,nombre,folio',
                ])
                ->get()
                ->sortBy(fn ($a) => $a->credito->cliente->nombre ?? '')
                ->values();

            return [
                'grupo' => $g,
                'abonos' => $abonos,
                'total' => (int) $abonos->sum('monto_esperado'),
            ];
        })->filter(fn ($f) => $f['abonos']->isNotEmpty())->values();

        return view('encargada.index', [
            'fecha' => $sabado,
            'porGrupo' => $porGrupo,
            'totalGeneral' => (int) $porGrupo->sum('total'),
        ]);
    }
}
