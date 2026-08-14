<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('titulo', 'Sistema') · {{ config('app.name') }}</title>
    <link rel="stylesheet" href="{{ asset('css/um.css') }}">
</head>
<body>

@auth
    <header class="barra">
        <div class="barra-interior">
            <a href="{{ Auth::user()->rutaInicio() }}" class="marca">
                <span class="marca-nombre">MUJERES UNIDAS</span>
                <span class="marca-sub">Control de crédito</span>
            </a>

            <nav class="nav">
                @can('reportes.ver')
                    <a href="{{ route('panel') }}" @class(['activo' => request()->is('panel')])>Panel</a>
                @endcan
                @can('cobranza.ver')
                    <a href="{{ route('cobranza') }}" @class(['activo' => request()->is('cobranza')])>Cobranza</a>
                @endcan
                @can('corte.dia')
                    <a href="{{ route('corte') }}" @class(['activo' => request()->is('corte')])>Corte</a>
                @endcan
                @can('clientas.ver')
                    <a href="{{ route('clientas') }}" @class(['activo' => request()->is('clientas*')])>Clientas</a>
                @endcan
                @can('creditos.ver')
                    <a href="{{ route('creditos') }}" @class(['activo' => request()->is('creditos*')])>Créditos</a>
                @endcan
                @can('grupos.ver')
                    <a href="{{ route('grupos') }}" @class(['activo' => request()->is('grupos')])>Grupos</a>
                @endcan
                @can('usuarios.ver')
                    <a href="{{ route('usuarios') }}" @class(['activo' => request()->is('usuarios')])>Usuarios</a>
                @endcan
                @can('auditoria.ver')
                    <a href="{{ route('bitacora') }}" @class(['activo' => request()->is('bitacora')])>Bitácora</a>
                @endcan
            </nav>

            <form method="POST" action="{{ route('salir') }}" class="salir">
                @csrf
                <span class="quien">
                    {{ Auth::user()->nombre }}
                    <small>{{ Auth::user()->etiquetaRol() }}</small>
                </span>
                <button type="submit" class="btn-plano">Salir</button>
            </form>
        </div>
    </header>
@endauth

<main class="contenido">
    @if (session('exito'))
        <div class="aviso aviso-bien">{{ session('exito') }}</div>
    @endif

    @if ($errors->any())
        <div class="aviso aviso-mal">
            @foreach ($errors->all() as $error)
                <div>{{ $error }}</div>
            @endforeach
        </div>
    @endif

    @yield('contenido')
</main>

@stack('scripts')
</body>
</html>
