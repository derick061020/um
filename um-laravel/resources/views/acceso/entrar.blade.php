<!DOCTYPE html>
<html lang="es-MX">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#16402E">
    <title>Entrar · Mujeres Unidas</title>
    <link rel="icon" href="{{ asset('brand/um-principal.png') }}">
    <link rel="stylesheet" href="{{ asset('css/um.css') }}?v={{ @filemtime(public_path('css/um.css')) ?: '1' }}">
</head>
<body>
<main class="entrar">

    {{-- Lado editorial — verde patrimonio con la curva del lenguaje gráfico. --}}
    <aside class="entrar-editorial">
        <img src="{{ asset('brand/um-invertido.png') }}" alt="Mujeres Unidas">

        <div class="lema">
            <h2>Crédito que impulsa</h2>
            <p class="sub">Confianza, unión y crecimiento.</p>
            <p class="texto">
                Control de grupos, clientas, avales y cobranza semanal. Cada movimiento queda
                registrado con la persona que lo capturó.
            </p>
        </div>

        <p class="firma">Mujeres Unidas · Sistema interno</p>
    </aside>

    <section class="entrar-forma">
        <div class="caja">
            <div class="logo-chico">
                <img src="{{ asset('brand/um-principal.png') }}" alt="Mujeres Unidas">
            </div>

            <h1>Entrar al sistema</h1>
            <p class="intro">Usa el usuario y la contraseña que te dio la dirección.</p>

            @if ($errors->any())
                <div class="aviso aviso-error" role="alert">
                    @foreach ($errors->all() as $error)
                        <div>{{ $error }}</div>
                    @endforeach
                </div>
            @endif

            <form method="POST" action="{{ route('entrar') }}">
                @csrf

                <div class="grupo-campo">
                    <label class="etiqueta-campo" for="usuario">Usuario</label>
                    <input type="text" id="usuario" name="usuario" value="{{ old('usuario') }}"
                           autocomplete="username" autocapitalize="none" autofocus required>
                </div>

                <div class="grupo-campo">
                    <label class="etiqueta-campo" for="password">Contraseña</label>
                    <input type="password" id="password" name="password"
                           autocomplete="current-password" required>
                </div>

                <div class="grupo-campo">
                    <label class="casilla">
                        <input type="checkbox" name="recordarme" value="1">
                        Mantener la sesión abierta en esta tablet
                    </label>
                </div>

                <button type="submit" class="btn btn-ancho">Entrar</button>
            </form>

            <a class="credito credito-acceso" href="mailto:kymesolutions@gmail.com"
               aria-label="Desarrollado por Kyme Solutions">
                <span class="credito-kicker">Desarrollado por</span>
                <img src="{{ asset('brand/kyme-software.png') }}" alt="Kyme Solutions">
            </a>
        </div>
    </section>

</main>
</body>
</html>
