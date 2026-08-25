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

        // El tarjetero se organiza por grupo, fecha del préstamo y tarjeta, no
        // por orden alfabético: así se ve de un vistazo quiénes entraron juntas
        // y en qué semana va cada tarjeta.
        $consulta = Cliente::query()
            ->with(['grupo:id,nombre', 'creditoActivo.abonos'])
            ->withCount('creditos');

        if ($busqueda !== '') {
            $consulta->where(function ($q) use ($busqueda) {
                $q->where('nombre', 'like', "%$busqueda%")
                    ->orWhere('telefono', 'like', "%$busqueda%")
                    ->orWhere('aval_nombre', 'like', "%$busqueda%");

                $digitos = preg_replace('/\D/', '', $busqueda);
                if ($digitos !== '') {
                    $q->orWhere('folio', (int) $digitos);
                }
            });
        }

        if ($grupoId) {
            $consulta->where('grupo_id', $grupoId);
        }

        $sub = 'select %s from creditos c where c.cliente_id = clientes.id'
            .' and c.estado in ("ACTIVO","VENCIDO") order by c.fecha_entrega desc limit 1';

        $consulta
            ->orderBy('grupo_id')
            ->orderByRaw('('.sprintf($sub, 'c.fecha_entrega').') is null')  // con crédito primero
            ->orderByRaw('('.sprintf($sub, 'c.fecha_entrega').')')          // por fecha de préstamo
            ->orderByRaw('('.sprintf($sub, 'c.folio').')')                  // por tarjeta
            ->orderBy('nombre');

        return view('clientas.index', [
            'clientas' => $consulta->paginate(40)->withQueryString(),
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

    /**
     * Borrar una clienta. Para proteger el historial financiero, solo se
     * permite si NO tiene créditos. Si los tiene, se desactiva en su lugar.
     */
    public function borrar(Cliente $cliente): RedirectResponse
    {
        if ($cliente->creditos()->count() > 0) {
            return back()->withErrors(['clienta' =>
                'No se puede borrar a «'.$cliente->nombre.'» porque tiene créditos en su historial. '
                .'Desactívala en su lugar (en sus datos) para no perder la información.',
            ]);
        }

        $nombre = $cliente->nombre;
        // Al borrar, se llevan también sus documentos escaneados del expediente.
        foreach ($cliente->documentos as $doc) {
            \Illuminate\Support\Facades\Storage::disk('local')->delete($doc->archivo);
        }
        $cliente->delete();

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'clienta.borrar',
            'entidad' => 'cliente',
            'entidad_id' => (string) $cliente->id,
            'detalle' => ['nombre' => $nombre],
        ]);

        return redirect()->route('clientas')->with('exito', 'Clienta '.$nombre.' borrada.');
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
