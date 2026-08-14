@extends('base')
@section('titulo', 'Usuarios')

@section('contenido')
    <div class="titulo">
        <h1>Usuarios</h1>
        <p>Cada persona entra con su propio usuario; todo movimiento queda firmado con su nombre.</p>
    </div>

    <section class="tarjeta" style="margin-bottom:1.5rem;">
        <header><h2>Cuentas del sistema</h2></header>
        <div class="tabla-envoltura">
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
                        <td style="font-weight:500; color:var(--patrimonio);">{{ $u->nombre }}</td>
                        <td class="apagado">{{ $u->usuario }}</td>
                        <td>
                            {{ $roles[$u->rol] ?? $u->rol }}
                            <div class="apagado" style="font-size:.6875rem;">{{ $descripciones[$u->rol] ?? '' }}</div>
                        </td>
                        <td>{{ $u->telefono ?? '—' }}</td>
                        <td>
                            <span class="insignia {{ $u->activo ? 'insignia-verde' : 'insignia-neutro' }}">
                                {{ $u->activo ? 'activo' : 'desactivado' }}
                            </span>
                        </td>
                        @can('usuarios.editar')
                            <td>
                                <details>
                                    <summary style="cursor:pointer; font-size:.8125rem; color:var(--patrimonio);">
                                        Editar
                                    </summary>

                                    <form method="POST" action="{{ route('usuarios.actualizar', $u) }}"
                                          style="margin-top:.75rem; min-width:15rem;">
                                        @csrf
                                        <div class="grupo-campo">
                                            <label class="etiqueta-campo">Nombre</label>
                                            <input type="text" name="nombre" value="{{ $u->nombre }}" required>
                                        </div>
                                        <div class="grupo-campo">
                                            <label class="etiqueta-campo">Rol</label>
                                            <select name="rol">
                                                @foreach ($roles as $valor => $texto)
                                                    <option value="{{ $valor }}" @selected($u->rol === $valor)>{{ $texto }}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div class="grupo-campo">
                                            <label class="etiqueta-campo">Teléfono</label>
                                            <input type="tel" name="telefono" value="{{ $u->telefono }}">
                                        </div>
                                        <label class="casilla" style="margin-bottom:.75rem;">
                                            <input type="checkbox" name="activo" value="1" @checked($u->activo)>
                                            Cuenta activa
                                        </label>
                                        <button type="submit" class="btn btn-chico">Guardar</button>
                                    </form>

                                    <form method="POST" action="{{ route('usuarios.contrasena', $u) }}"
                                          style="margin-top:1rem; min-width:15rem;">
                                        @csrf
                                        <div class="grupo-campo">
                                            <label class="etiqueta-campo">Nueva contraseña</label>
                                            <input type="password" name="password" required minlength="8">
                                        </div>
                                        <div class="grupo-campo">
                                            <label class="etiqueta-campo">Repetir contraseña</label>
                                            <input type="password" name="password_confirmation" required minlength="8">
                                        </div>
                                        <button type="submit" class="btn-secundario btn-chico">Cambiar contraseña</button>
                                    </form>
                                </details>
                            </td>
                        @endcan
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </section>

    @can('usuarios.crear')
        <section class="tarjeta">
            <header><h2>Nuevo usuario</h2></header>
            <form method="POST" action="{{ route('usuarios.guardar') }}" class="relleno">
                @csrf
                <div class="rejilla rejilla-2">
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="nombre">Nombre completo *</label>
                        <input type="text" id="nombre" name="nombre" required value="{{ old('nombre') }}">
                    </div>
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="usuario">Usuario *</label>
                        <input type="text" id="usuario" name="usuario" required autocapitalize="none"
                               value="{{ old('usuario') }}">
                        <p class="ayuda">Sin espacios ni acentos. Por ejemplo: viridiana</p>
                    </div>
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="rol">Rol *</label>
                        <select id="rol" name="rol" required>
                            @foreach ($roles as $valor => $texto)
                                <option value="{{ $valor }}">{{ $texto }} — {{ $descripciones[$valor] }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="telefono">Teléfono</label>
                        <input type="tel" id="telefono" name="telefono" value="{{ old('telefono') }}">
                    </div>
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="password">Contraseña *</label>
                        <input type="password" id="password" name="password" required minlength="8">
                        <p class="ayuda">Mínimo 8 caracteres.</p>
                    </div>
                    <div class="grupo-campo">
                        <label class="etiqueta-campo" for="password_confirmation">Repetir contraseña *</label>
                        <input type="password" id="password_confirmation" name="password_confirmation" required minlength="8">
                    </div>
                </div>
                <button type="submit" class="btn">Crear usuario</button>
            </form>
        </section>
    @endcan
@endsection
