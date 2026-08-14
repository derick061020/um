<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ninguna pantalla del sistema se guarda en caché.
 *
 * Todo lo que sirve la aplicación depende de quién inició sesión: la lista de
 * cobranza, los expedientes, el corte del día. Si un intermediario —la caché
 * del servidor, un proxy, o el propio navegador al pulsar "atrás" tras cerrar
 * sesión— reutilizara una página, le mostraría a alguien datos que no le
 * corresponden.
 */
class SinCache
{
    public function handle(Request $request, Closure $next): Response
    {
        $respuesta = $next($request);

        $respuesta->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        $respuesta->headers->set('Pragma', 'no-cache');
        $respuesta->headers->remove('Expires');

        return $respuesta;
    }
}
