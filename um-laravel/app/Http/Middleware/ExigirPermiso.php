<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Exige uno o varios permisos para entrar a una ruta.
 * Con varios, basta con tener alguno:  ->middleware('puede:clientas.ver,creditos.ver')
 */
class ExigirPermiso
{
    public function handle(Request $request, Closure $next, string ...$permisos): Response
    {
        $usuario = Auth::user();

        if (! $usuario || ! $usuario->activo) {
            Auth::logout();

            return redirect('/entrar');
        }

        if (! $usuario->puedeAlguno($permisos)) {
            abort(403, 'Tu cuenta no tiene permiso para esta pantalla.');
        }

        return $next($request);
    }
}
