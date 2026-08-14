<?php

namespace App\Services;

use App\Models\Auditoria;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;

/**
 * Bitácora de movimientos. Nunca debe tumbar la operación:
 * si falla el registro, se anota en el log y la acción continúa.
 */
class Bitacora
{
    /**
     * @param  array{usuario_id?:int|null, accion:string, entidad:string,
     *              entidad_id?:string|null, detalle?:array<string,mixed>|null}  $r
     */
    public static function registrar(array $r): void
    {
        try {
            Auditoria::create([
                'usuario_id' => $r['usuario_id'] ?? null,
                'accion' => $r['accion'],
                'entidad' => $r['entidad'],
                'entidad_id' => $r['entidad_id'] ?? null,
                // SQLite no tiene tipo JSON: se guarda serializado en texto.
                'detalle' => isset($r['detalle']) && $r['detalle'] !== null
                    ? json_encode($r['detalle'], JSON_UNESCAPED_UNICODE)
                    : null,
                'ip' => Request::ip(),
            ]);
        } catch (\Throwable $e) {
            Log::error('[bitácora] no se pudo registrar: '.$r['accion'], ['error' => $e->getMessage()]);
        }
    }
}
