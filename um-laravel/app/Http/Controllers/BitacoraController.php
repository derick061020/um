<?php

namespace App\Http\Controllers;

use App\Models\Auditoria;
use Illuminate\Http\Request;
use Illuminate\View\View;

class BitacoraController extends Controller
{
    public function index(Request $request): View
    {
        $consulta = Auditoria::with('usuario:id,nombre,usuario')->orderByDesc('created_at');

        if ($accion = $request->query('accion')) {
            $consulta->where('accion', 'like', "$accion%");
        }

        if ($entidad = $request->query('entidad')) {
            $consulta->where('entidad', $entidad);
        }

        return view('bitacora.index', [
            'movimientos' => $consulta->paginate(50)->withQueryString(),
            'accion' => $accion,
            'entidad' => $entidad,
            'entidades' => Auditoria::query()->distinct()->orderBy('entidad')->pluck('entidad'),
        ]);
    }
}
