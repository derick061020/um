<?php

namespace App\Http\Controllers;

use App\Models\Credito;
use App\Models\Grupo;
use App\Services\Bitacora;
use App\Support\Fechas;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

/**
 * Tarjetón de control. Con `?grupo=1` el identificador se interpreta como
 * grupo y se imprime un tarjetón por cada crédito abierto, uno por hoja.
 */
class TarjetonController extends Controller
{
    public function pdf(Request $request, Credito $credito): Response
    {
        $porGrupo = $request->query('grupo') === '1';

        if ($porGrupo) {
            $grupo = Grupo::findOrFail($credito->grupo_id);

            $creditos = Credito::where('grupo_id', $grupo->id)
                ->whereIn('estado', ['ACTIVO', 'VENCIDO'])
                ->with(['cliente:id,nombre', 'abonos'])
                ->get()
                ->sortBy(fn ($c) => $c->cliente->nombre)
                ->values();

            $nombreArchivo = 'tarjetones-'.str($grupo->nombre)->slug().'.pdf';
        } else {
            $credito->load(['cliente:id,nombre', 'abonos']);
            $creditos = collect([$credito]);
            $nombreArchivo = 'tarjeton-'.$credito->folioFormateado().'.pdf';
        }

        abort_if($creditos->isEmpty(), 404, 'No se encontró el crédito.');

        $tarjetas = $creditos->map(fn (Credito $c) => [
            'nombre' => $c->cliente->nombre,
            'folio' => $c->folioFormateado(),
            'abonos' => $c->abonos->map(fn ($a) => [
                'semana' => $a->semana,
                'columna' => Fechas::columna(
                    new \DateTimeImmutable($a->fecha_programada->format('Y-m-d'), Fechas::utc())
                ),
                'monto' => $a->monto_esperado,
            ])->all(),
        ])->all();

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'credito.tarjeton',
            'entidad' => 'credito',
            'entidad_id' => (string) $credito->id,
            'detalle' => ['tarjetas' => count($tarjetas)],
        ]);

        $pdf = Pdf::loadView('pdf.tarjeton', [
            'tarjetas' => $tarjetas,
            'institucion' => env('UM_NOMBRE', 'MUJERES UNIDAS'),
        ])->setPaper('letter', 'landscape');

        return $pdf->stream($nombreArchivo);
    }
}
