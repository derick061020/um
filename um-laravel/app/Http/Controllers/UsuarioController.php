<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Services\Bitacora;
use App\Support\Rbac;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\View\View;

class UsuarioController extends Controller
{
    public function index(): View
    {
        return view('usuarios.index', [
            'usuarios' => Usuario::with('movimientos')->orderBy('nombre')->get(),
            'roles' => Rbac::etiquetas(),
            'descripciones' => Rbac::descripciones(),
        ]);
    }

    public function guardar(Request $request): RedirectResponse
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:120'],
            'usuario' => ['required', 'string', 'max:40', 'alpha_dash', 'unique:usuarios,usuario'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'rol' => ['required', 'in:'.implode(',', Rbac::ROLES)],
            'telefono' => ['nullable', 'string', 'max:20'],
        ], [], [
            'nombre' => 'nombre',
            'usuario' => 'usuario',
            'password' => 'contraseña',
            'rol' => 'rol',
        ]);

        $creado = Usuario::create([
            'nombre' => $datos['nombre'],
            'usuario' => $datos['usuario'],
            'password_hash' => Hash::make($datos['password']),
            'rol' => $datos['rol'],
            'telefono' => $datos['telefono'] ?? null,
            'creado_por_id' => Auth::id(),
        ]);

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'usuario.crear',
            'entidad' => 'usuario',
            'entidad_id' => (string) $creado->id,
            'detalle' => ['usuario' => $creado->usuario, 'rol' => $creado->rol],
        ]);

        return back()->with('exito', 'Usuario '.$creado->usuario.' creado.');
    }

    public function actualizar(Request $request, Usuario $usuario): RedirectResponse
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:120'],
            'rol' => ['required', 'in:'.implode(',', Rbac::ROLES)],
            'telefono' => ['nullable', 'string', 'max:20'],
            'activo' => ['nullable', 'boolean'],
        ]);

        $activo = $request->boolean('activo');

        // Salvaguarda: el sistema no puede quedarse sin dirección.
        if ((! $activo || $datos['rol'] !== Rbac::PRINCIPAL) && $usuario->rol === Rbac::PRINCIPAL) {
            $otras = Usuario::where('rol', Rbac::PRINCIPAL)
                ->where('activo', true)
                ->where('id', '!=', $usuario->id)
                ->count();

            if ($otras === 0) {
                return back()->withErrors([
                    'rol' => 'No puedes dejar el sistema sin una cuenta Principal activa.',
                ]);
            }
        }

        $usuario->update([
            'nombre' => $datos['nombre'],
            'rol' => $datos['rol'],
            'telefono' => $datos['telefono'] ?? null,
            'activo' => $activo,
        ]);

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'usuario.editar',
            'entidad' => 'usuario',
            'entidad_id' => (string) $usuario->id,
            'detalle' => ['usuario' => $usuario->usuario, 'rol' => $usuario->rol, 'activo' => $activo],
        ]);

        return back()->with('exito', 'Usuario actualizado.');
    }

    public function contrasena(Request $request, Usuario $usuario): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'confirmed', Password::min(8)],
        ], [], ['password' => 'contraseña']);

        $usuario->update(['password_hash' => Hash::make($request->input('password'))]);

        Bitacora::registrar([
            'usuario_id' => Auth::id(),
            'accion' => 'usuario.contrasena',
            'entidad' => 'usuario',
            'entidad_id' => (string) $usuario->id,
            'detalle' => ['usuario' => $usuario->usuario],
        ]);

        return back()->with('exito', 'Contraseña cambiada.');
    }
}
