<?php

namespace App\Http\Controllers;

use App\Services\Bitacora;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class AccesoController extends Controller
{
    public function formulario(): View|RedirectResponse
    {
        if (Auth::check()) {
            return redirect(Auth::user()->rutaInicio());
        }

        return view('acceso.entrar');
    }

    public function entrar(Request $request): RedirectResponse
    {
        $datos = $request->validate([
            'usuario' => ['required', 'string', 'max:60'],
            'password' => ['required', 'string'],
        ], [], [
            'usuario' => 'usuario',
            'password' => 'contraseña',
        ]);

        // `activo` va en las credenciales: una cuenta desactivada no entra
        // aunque la contraseña sea correcta.
        $credenciales = [
            'usuario' => $datos['usuario'],
            'password' => $datos['password'],
            'activo' => true,
        ];

        if (! Auth::attempt($credenciales, $request->boolean('recordarme'))) {
            Bitacora::registrar([
                'accion' => 'acceso.fallido',
                'entidad' => 'usuario',
                'entidad_id' => $datos['usuario'],
            ]);

            throw ValidationException::withMessages([
                'usuario' => 'Usuario o contraseña incorrectos.',
            ]);
        }

        $request->session()->regenerate();

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'acceso.entrar',
            'entidad' => 'usuario',
            'entidad_id' => (string) Auth::id(),
        ]);

        return redirect()->intended(Auth::user()->rutaInicio());
    }

    public function salir(Request $request): RedirectResponse
    {
        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'acceso.salir',
            'entidad' => 'usuario',
            'entidad_id' => (string) Auth::id(),
        ]);

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/entrar');
    }
}
