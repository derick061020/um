<?php

namespace App\Http\Controllers;

use App\Models\Grupo;
use App\Models\Usuario;
use App\Services\Bitacora;
use App\Support\Rbac;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class GrupoController extends Controller
{
    public function index(): View
    {
        return view('grupos.index', [
            'grupos' => Grupo::with(['supervisor:id,nombre', 'encargada:id,nombre'])
                ->withCount('clientas')
                ->orderBy('nombre')
                ->get(),
            'supervisores' => Usuario::where('activo', true)
                ->whereIn('rol', [Rbac::PRINCIPAL, Rbac::SUPERVISOR])
                ->orderBy('nombre')->get(['id', 'nombre']),
            'encargadas' => Usuario::where('activo', true)
                ->where('rol', Rbac::ENCARGADA)
                ->orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    public function guardar(Request $request): RedirectResponse
    {
        $datos = $this->validar($request);

        $grupo = Grupo::create($datos + ['creado_por_id' => Auth::id()]);

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'grupo.crear',
            'entidad' => 'grupo',
            'entidad_id' => (string) $grupo->id,
            'detalle' => ['nombre' => $grupo->nombre],
        ]);

        return back()->with('exito', 'Grupo '.$grupo->nombre.' creado.');
    }

    public function actualizar(Request $request, Grupo $grupo): RedirectResponse
    {
        $grupo->update($this->validar($request, $grupo->id));

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'grupo.editar',
            'entidad' => 'grupo',
            'entidad_id' => (string) $grupo->id,
            'detalle' => ['nombre' => $grupo->nombre],
        ]);

        return back()->with('exito', 'Grupo actualizado.');
    }

    /** @return array<string, mixed> */
    private function validar(Request $request, ?int $ignorar = null): array
    {
        $unico = 'unique:grupos,nombre'.($ignorar ? ",$ignorar" : '');

        return $request->validate([
            'nombre' => ['required', 'string', 'max:80', $unico],
            'plaza' => ['nullable', 'string', 'max:80'],
            'supervisor_id' => ['nullable', 'exists:usuarios,id'],
            'encargada_id' => ['nullable', 'exists:usuarios,id'],
            'activo' => ['nullable', 'boolean'],
            'notas' => ['nullable', 'string', 'max:500'],
        ], [], ['nombre' => 'nombre del grupo']);
    }
}
