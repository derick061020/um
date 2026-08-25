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

        // Un grupo debe llevar un código; si no se capturó, se genera solo.
        if (! $grupo->codigo) {
            $grupo->codigo = 'GR-'.str_pad((string) $grupo->id, 6, '0', STR_PAD_LEFT);
            $grupo->save();
        }

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'grupo.crear',
            'entidad' => 'grupo',
            'entidad_id' => (string) $grupo->id,
            'detalle' => ['codigo' => $grupo->codigo, 'nombre' => $grupo->nombre],
        ]);

        return back()->with('exito', 'Grupo '.$grupo->nombre.' ('.$grupo->codigo.') creado.');
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

    /** Archivar (desactivar) un grupo sin perder su historial. */
    public function archivar(Grupo $grupo): RedirectResponse
    {
        $grupo->update(['activo' => false]);

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'grupo.archivar',
            'entidad' => 'grupo',
            'entidad_id' => (string) $grupo->id,
            'detalle' => ['nombre' => $grupo->nombre],
        ]);

        return back()->with('exito', 'Grupo '.$grupo->nombre.' archivado. Su historial se conserva.');
    }

    public function reactivar(Grupo $grupo): RedirectResponse
    {
        $grupo->update(['activo' => true]);

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'grupo.reactivar',
            'entidad' => 'grupo',
            'entidad_id' => (string) $grupo->id,
            'detalle' => ['nombre' => $grupo->nombre],
        ]);

        return back()->with('exito', 'Grupo '.$grupo->nombre.' reactivado.');
    }

    /**
     * Borrar un grupo definitivamente. Para proteger el historial financiero,
     * solo se permite si el grupo NO tiene clientas, créditos ni entregas. Si
     * tiene movimientos, se pide archivarlo en su lugar.
     */
    public function borrar(Grupo $grupo): RedirectResponse
    {
        $clientas = $grupo->clientas()->count();
        $creditos = $grupo->creditos()->count();
        $entregas = $grupo->entregas()->count();

        if ($clientas > 0 || $creditos > 0 || $entregas > 0) {
            return back()->withErrors(['grupo' =>
                'No se puede borrar «'.$grupo->nombre.'» porque tiene historial ('
                .$clientas.' clientas, '.$creditos.' créditos, '.$entregas.' entregas). '
                .'Archívalo en su lugar para no perder la información.',
            ]);
        }

        $nombre = $grupo->nombre;
        $grupo->delete();

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'grupo.borrar',
            'entidad' => 'grupo',
            'entidad_id' => (string) $grupo->id,
            'detalle' => ['nombre' => $nombre],
        ]);

        return back()->with('exito', 'Grupo '.$nombre.' borrado.');
    }

    /** @return array<string, mixed> */
    private function validar(Request $request, ?int $ignorar = null): array
    {
        $unicoNombre = 'unique:grupos,nombre'.($ignorar ? ",$ignorar" : '');
        $unicoCodigo = 'unique:grupos,codigo'.($ignorar ? ",$ignorar" : '');

        // Regla del resumen: un grupo no se crea sin ubicación, zona y encargada.
        return $request->validate([
            'nombre' => ['required', 'string', 'max:80', $unicoNombre],
            'codigo' => ['nullable', 'string', 'max:30', $unicoCodigo],
            'estado' => ['nullable', 'string', 'max:60'],
            'municipio' => ['nullable', 'string', 'max:80'],
            'colonia' => ['nullable', 'string', 'max:80'],
            'zona' => ['required', 'string', 'max:80'],
            'ubicacion' => ['required', 'string', 'max:160'],
            'plaza' => ['nullable', 'string', 'max:80'],
            'supervisor_id' => ['nullable', 'exists:usuarios,id'],
            'encargada_id' => ['required', 'exists:usuarios,id'],
            'activo' => ['nullable', 'boolean'],
            'notas' => ['nullable', 'string', 'max:500'],
        ], [], [
            'nombre' => 'nombre del grupo',
            'zona' => 'zona',
            'ubicacion' => 'ubicación',
            'encargada_id' => 'encargada',
        ]);
    }
}
