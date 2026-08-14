@extends('base')
@section('titulo', 'Usuarios')

@section('contenido')
    <h1>Usuarios</h1>
    <p class="sub">Cada persona entra con su propio usuario; todo movimiento queda firmado.</p>

    <div class="tabla-envoltura tarjeta" style="padding:0;">
        <table class="tabla">
            <thead>
            <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Teléfono</th>
                <th>Estado</th>
                @can('usuarios.editar') <th></th> @endcan
            </tr>
            </thead>
            <tbody>
            @foreach ($usuarios as $u)
                <tr>
                    <td><strong>{{ $u->nombre }}</strong></td>
                    <td><code>{{ $u->usuario }}</code></td>
                    <td>
                        {{ $roles[$u->rol] ?? $u->rol }}
                        <div class="apagado" style="font-size:11px;">{{ $descripciones[$u->rol] ?? '' }}</div>
                    </td>
                    <td>{{ $u->telefono ?? '—' }}</td>
                    <td>
                        <span class="etiqueta {{ $u->activo ? 'e-ACTIVO' : 'e-CANCELADO' }}">
                            {{ $u->activo ? 'activo' : 'desactivado' }}
                        </span>
                    </td>
                    @can('usuarios.editar')
                        <td>
                            <details>
                                <summary style="cursor:pointer; font-size:13px;">Editar</summary>
                                <form method="POST" action="{{ route('usuarios.actualizar', $u) }}" style="margin-top:8px;">
                                    @csrf
                                    <div class="campo">
                                        <label>Nombre</label>
                                        <input type="text" name="nombre" value="{{ $u->nombre }}" required>
                                    </div>
                                    <div class="campo">
                                        <label>Rol</label>
                                        <select name="rol">
                                            @foreach ($roles as $valor => $texto)
                                                <option value="{{ $valor }}" @selected($u->rol === $valor)>{{ $texto }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="campo">
                                        <label>Teléfono</label>
                                        <input type="tel" name="telefono" value="{{ $u->telefono }}">
                                    </div>
                                    <label style="display:flex; align-items:center; gap:8px; font-size:14px;">
                                        <input type="checkbox" name="activo" value="1" style="width:auto;" @checked($u->activo)>
                                        Cuenta activa
                                    </label>
                                    <button type="submit" class="btn btn-chico" style="margin-top:8px;">Guardar</button>
                                </form>

                                <form method="POST" action="{{ route('usuarios.contrasena', $u) }}" style="margin-top:12px;">
                                    @csrf
                                    <div class="campo">
                                        <label>Nueva contraseña</label>
                                        <input type="password" name="password" required minlength="8">
                                    </div>
                                    <div class="campo">
                                        <label>Repetir contraseña</label>
                                        <input type="password" name="password_confirmation" required minlength="8">
                                    </div>
                                    <button type="submit" class="btn btn-chico btn-secundario">Cambiar contraseña</button>
                                </form>
                            </details>
                        </td>
                    @endcan
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>

    @can('usuarios.crear')
        <h2>Nuevo usuario</h2>
        <form method="POST" action="{{ route('usuarios.guardar') }}" class="tarjeta">
            @csrf
            <div class="rejilla rejilla-2">
                <div class="campo">
                    <label for="nombre">Nombre completo *</label>
                    <input type="text" id="nombre" name="nombre" required value="{{ old('nombre') }}">
                </div>
                <div class="campo">
                    <label for="usuario">Usuario *</label>
                    <input type="text" id="usuario" name="usuario" required autocapitalize="none" value="{{ old('usuario') }}">
                    <div class="pista">Sin espacios ni acentos. Por ejemplo: viridiana</div>
                </div>
                <div class="campo">
                    <label for="rol">Rol *</label>
                    <select id="rol" name="rol" required>
                        @foreach ($roles as $valor => $texto)
                            <option value="{{ $valor }}">{{ $texto }} — {{ $descripciones[$valor] }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="campo">
                    <label for="telefono">Teléfono</label>
                    <input type="tel" id="telefono" name="telefono" value="{{ old('telefono') }}">
                </div>
                <div class="campo">
                    <label for="password">Contraseña *</label>
                    <input type="password" id="password" name="password" required minlength="8">
                    <div class="pista">Mínimo 8 caracteres.</div>
                </div>
                <div class="campo">
                    <label for="password_confirmation">Repetir contraseña *</label>
                    <input type="password" id="password_confirmation" name="password_confirmation" required minlength="8">
                </div>
            </div>
            <button type="submit" class="btn">Crear usuario</button>
        </form>
    @endcan
@endsection
