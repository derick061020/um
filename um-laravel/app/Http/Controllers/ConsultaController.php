<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Consulta de clientas de SOLO LECTURA. La usan la encargada y el supervisor
 * para verificar si una clienta ya existe, si tiene historial y si tiene o tuvo
 * préstamo, antes de iniciar un proceso. No permite modificar nada.
 */
class ConsultaController extends Controller
{
    public function index(Request $request): View
    {
        $busqueda = trim((string) $request->query('q', ''));
        $resultados = collect();

        if ($busqueda !== '') {
            $resultados = Cliente::query()
                ->with(['grupo:id,nombre'])
                ->withCount('creditos')
                ->where(function ($q) use ($busqueda) {
                    $q->where('nombre', 'like', "%$busqueda%")
                        ->orWhere('telefono', 'like', "%$busqueda%")
                        ->orWhere('aval_nombre', 'like', "%$busqueda%");

                    // Permite buscar por folio o por el ID público CL-000123.
                    $digitos = preg_replace('/\D/', '', $busqueda);
                    if ($digitos !== '') {
                        $q->orWhere('folio', (int) $digitos);
                    }
                })
                ->orderBy('nombre')
                ->limit(40)
                ->get();
        }

        return view('consulta.index', [
            'busqueda' => $busqueda,
            'resultados' => $resultados,
        ]);
    }

    /** Ficha de solo lectura: datos básicos e historial de créditos. */
    public function ver(Cliente $cliente): View
    {
        $cliente->load([
            'grupo:id,nombre',
            'creditos' => fn ($q) => $q->orderByDesc('fecha_entrega'),
            'creditos.abonos:id,credito_id,monto_pagado,monto_esperado,estado',
        ]);

        return view('consulta.ficha', ['clienta' => $cliente]);
    }
}
