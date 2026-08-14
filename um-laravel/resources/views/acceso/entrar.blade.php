<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Entrar · {{ config('app.name') }}</title>
    <link rel="stylesheet" href="{{ asset('css/um.css') }}">
</head>
<body>
<div class="acceso">
    <div class="acceso-caja">
        <div class="acceso-marca">
            <strong>MUJERES UNIDAS</strong>
            <span>Sistema de control de crédito</span>
        </div>

        @if ($errors->any())
            <div class="aviso aviso-mal">
                @foreach ($errors->all() as $error)
                    <div>{{ $error }}</div>
                @endforeach
            </div>
        @endif

        <form method="POST" action="{{ route('entrar') }}">
            @csrf

            <div class="campo">
                <label for="usuario">Usuario</label>
                <input type="text" id="usuario" name="usuario" value="{{ old('usuario') }}"
                       autocomplete="username" autocapitalize="none" autofocus required>
            </div>

            <div class="campo">
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password"
                       autocomplete="current-password" required>
            </div>

            <div class="campo">
                <label style="display:flex; align-items:center; gap:8px; font-size:14px;">
                    <input type="checkbox" name="recordarme" value="1" style="width:auto;">
                    Mantener la sesión abierta en esta tablet
                </label>
            </div>

            <button type="submit" class="btn" style="width:100%;">Entrar</button>
        </form>
    </div>
</div>
</body>
</html>
