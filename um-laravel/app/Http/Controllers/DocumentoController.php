<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Documento;
use App\Services\Bitacora;
use App\Support\Documentos;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Expediente de la clienta. Los archivos se guardan FUERA de la carpeta
 * pública y se sirven por esta ruta, que exige sesión y permiso: nunca
 * quedan expuestos a internet por su URL.
 */
class DocumentoController extends Controller
{
    /** Carpeta lógica dentro del disco privado. */
    private const CARPETA = 'documentos';

    public function subir(Request $request, Cliente $cliente): RedirectResponse
    {
        $request->validate([
            'tipo' => ['required', 'in:'.implode(',', Documentos::TIPOS)],
            'descripcion' => ['nullable', 'string', 'max:180'],
            // La tablet manda la foto ya recortada como data URL; desde
            // computadora se puede subir un archivo normal.
            'imagen' => ['nullable', 'string'],
            'archivo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:12288'],
        ], [], ['tipo' => 'tipo de documento']);

        if ($request->filled('imagen')) {
            [$contenido, $mime, $extension] = $this->desdeDataUrl($request->input('imagen'));
        } elseif ($request->hasFile('archivo')) {
            $subido = $request->file('archivo');
            $contenido = file_get_contents($subido->getRealPath());
            $mime = $subido->getMimeType();
            $extension = $subido->getClientOriginalExtension() ?: 'jpg';
        } else {
            return back()->withErrors(['archivo' => 'No se recibió ninguna imagen.']);
        }

        if ($contenido === null) {
            return back()->withErrors(['archivo' => 'El formato de la imagen no es válido.']);
        }

        [$ancho, $alto] = $this->medidas($contenido);

        $ruta = self::CARPETA.'/'.$cliente->id.'/'.Str::ulid().'.'.$extension;
        Storage::disk('local')->put($ruta, $contenido);

        $doc = Documento::create([
            'cliente_id' => $cliente->id,
            'tipo' => $request->input('tipo'),
            'descripcion' => $request->input('descripcion'),
            'archivo' => $ruta,
            'mime' => $mime,
            'bytes' => strlen($contenido),
            'ancho' => $ancho,
            'alto' => $alto,
            'subido_por_id' => Auth::id(),
        ]);

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'documento.subir',
            'entidad' => 'documento',
            'entidad_id' => (string) $doc->id,
            'detalle' => ['cliente_id' => $cliente->id, 'tipo' => $doc->tipo],
        ]);

        return back()->with('exito', Documentos::etiqueta($doc->tipo).' guardado en el expediente.');
    }

    public function ver(Documento $documento): StreamedResponse
    {
        abort_unless(Storage::disk('local')->exists($documento->archivo), 404, 'El archivo ya no está.');

        return Storage::disk('local')->response(
            $documento->archivo,
            null,
            ['Content-Type' => $documento->mime, 'Cache-Control' => 'private, no-store'],
        );
    }

    public function borrar(Documento $documento): RedirectResponse
    {
        $clienteId = $documento->cliente_id;

        Storage::disk('local')->delete($documento->archivo);
        $documento->delete();

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'documento.borrar',
            'entidad' => 'documento',
            'entidad_id' => (string) $documento->id,
            'detalle' => ['cliente_id' => $clienteId, 'tipo' => $documento->tipo],
        ]);

        return back()->with('exito', 'Documento eliminado del expediente.');
    }

    /**
     * Decodifica "data:image/jpeg;base64,...." que manda la cámara.
     *
     * @return array{0:string|null, 1:string, 2:string}
     */
    private function desdeDataUrl(string $dataUrl): array
    {
        if (! preg_match('#^data:(image/(jpeg|jpg|png|webp));base64,#', $dataUrl, $m)) {
            return [null, '', ''];
        }

        $mime = $m[1];
        $base64 = substr($dataUrl, strlen($m[0]));
        $contenido = base64_decode($base64, true);

        if ($contenido === false || $contenido === '') {
            return [null, '', ''];
        }

        $extension = match ($mime) {
            'image/png' => 'png',
            'image/webp' => 'webp',
            default => 'jpg',
        };

        return [$contenido, $mime, $extension];
    }

    /**
     * Medidas de la imagen. Si la extensión GD no está disponible en el
     * servidor, el documento se guarda igual y solo se pierde el dato.
     *
     * @return array{0:int|null, 1:int|null}
     */
    private function medidas(string $contenido): array
    {
        if (! function_exists('getimagesizefromstring')) {
            return [null, null];
        }

        $info = @getimagesizefromstring($contenido);

        return $info ? [(int) $info[0], (int) $info[1]] : [null, null];
    }
}
