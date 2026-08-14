<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Grupo;
use App\Services\Bitacora;
use App\Services\CreditoService;
use App\Support\Documentos;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class ClientaController extends Controller
{
    public function index(Request $request): View
    {
        $busqueda = trim((string) $request->query('q', ''));
        $grupoId = $request->query('grupo');

        $consulta = Cliente::query()->with('grupo:id,nombre')->withCount('creditos');

        if ($busqueda !== '') {
            $consulta->where(function ($q) use ($busqueda) {
                $q->where('nombre', 'like', "%$busqueda%")
                    ->orWhere('telefono', 'like', "%$busqueda%")
                    ->orWhere('aval_nombre', 'like', "%$busqueda%");

                if (ctype_digit($busqueda)) {
                    $q->orWhere('folio', (int) $busqueda);
                }
            });
        }

        if ($grupoId) {
            $consulta->where('grupo_id', $grupoId);
        }

        return view('clientas.index', [
            'clientas' => $consulta->orderBy('nombre')->paginate(30)->withQueryString(),
            'grupos' => Grupo::where('activo', true)->orderBy('nombre')->get(),
            'busqueda' => $busqueda,
            'grupoId' => $grupoId,
        ]);
    }

    public function crear(): View
    {
        return view('clientas.nueva', [
            'grupos' => Grupo::where('activo', true)->orderBy('nombre')->get(),
        ]);
    }

    public function guardar(Request $request, CreditoService $servicio): RedirectResponse
    {
        $datos = $this->validar($request);

        $clienta = Cliente::create($datos + [
            'folio' => $servicio->siguienteFolioCliente(),
            'capturado_por_id' => Auth::id(),
        ]);

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'clienta.crear',
            'entidad' => 'cliente',
            'entidad_id' => (string) $clienta->id,
            'detalle' => ['folio' => $clienta->folio, 'nombre' => $clienta->nombre],
        ]);

        return redirect()->route('clientas.ficha', $clienta)
            ->with('exito', 'Clienta registrada con folio '.$clienta->folioFormateado().'.');
    }

    public function ficha(Cliente $cliente): View
    {
        $cliente->load([
            'grupo:id,nombre,plaza',
            'documentos.subidoPor:id,nombre',
            'creditos' => fn ($q) => $q->orderByDesc('fecha_entrega'),
            'creditos.abonos',
        ]);

        return view('clientas.ficha', [
            'clienta' => $cliente,
            'grupos' => Grupo::where('activo', true)->orderBy('nombre')->get(),
            'faltantes' => $cliente->documentosFaltantes(),
            'tiposDocumento' => Documentos::opciones(),
        ]);
    }

    public function actualizar(Request $request, Cliente $cliente): RedirectResponse
    {
        $anterior = $cliente->nombre;
        $cliente->update($this->validar($request));

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'clienta.editar',
            'entidad' => 'cliente',
            'entidad_id' => (string) $cliente->id,
            'detalle' => ['folio' => $cliente->folio, 'antes' => $anterior],
        ]);

        return back()->with('exito', 'Datos actualizados.');
    }

    /** @return array<string, mixed> */
    private function validar(Request $request): array
    {
        return $request->validate([
            'nombre' => ['required', 'string', 'max:120'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'domicilio' => ['nullable', 'string', 'max:180'],
            'colonia' => ['nullable', 'string', 'max:120'],
            'ciudad' => ['nullable', 'string', 'max:120'],
            'curp' => ['nullable', 'string', 'max:18'],

            // El aval es parte obligatoria de la operación de Mujeres Unidas.
            'aval_nombre' => ['required', 'string', 'max:120'],
            'aval_telefono' => ['nullable', 'string', 'max:20'],
            'aval_parentesco' => ['nullable', 'string', 'max:60'],
            'aval_domicilio' => ['required', 'string', 'max:180'],
            'aval_colonia' => ['nullable', 'string', 'max:120'],
            'aval_ciudad' => ['nullable', 'string', 'max:120'],

            'grupo_id' => ['nullable', 'exists:grupos,id'],
            'activo' => ['nullable', 'boolean'],
            'notas' => ['nullable', 'string', 'max:1000'],
        ], [], [
            'nombre' => 'nombre',
            'aval_nombre' => 'nombre del aval',
            'aval_domicilio' => 'domicilio del aval',
        ]);
    }
}
