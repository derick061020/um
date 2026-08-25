<!DOCTYPE html>
<html lang="es-MX">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#16402E">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('titulo', 'Control de crédito') · Mujeres Unidas</title>
    <link rel="icon" href="{{ asset('brand/um-principal.png') }}">
    <link rel="apple-touch-icon" href="{{ asset('brand/um-principal.png') }}">
    <link rel="manifest" href="{{ asset('manifest.webmanifest') }}">
    {{-- La versión (mtime del archivo) fuerza al navegador a traer el CSS
         nuevo tras cada despliegue, en vez de servir uno viejo cacheado. --}}
    <link rel="stylesheet" href="{{ asset('css/um.css') }}?v={{ @filemtime(public_path('css/um.css')) ?: '1' }}">
</head>
<body>

@php
    // El menú es el mismo del sistema anterior, en el mismo orden.
    $menu = collect([
        ['ruta' => 'panel',       'texto' => 'Panel',         'permiso' => 'reportes.ver'],
        ['ruta' => 'encargada',   'texto' => 'Mis clientas',  'permiso' => 'encargada.panel'],
        ['ruta' => 'entregas',    'texto' => 'Entregas',      'permiso' => 'entregas.ver'],
        ['ruta' => 'corte',       'texto' => 'Cobro del día', 'permiso' => 'corte.dia'],
        ['ruta' => 'cobranza',    'texto' => 'Cobranza',      'permiso' => 'cobranza.ver'],
        ['ruta' => 'clientas',    'texto' => 'Clientas',      'permiso' => 'clientas.ver'],
        ['ruta' => 'consulta',    'texto' => 'Consultar',     'permiso' => 'clientas.consultar'],
        ['ruta' => 'creditos',    'texto' => 'Créditos',      'permiso' => 'creditos.ver'],
        ['ruta' => 'grupos',      'texto' => 'Grupos',        'permiso' => 'grupos.ver'],
        ['ruta' => 'usuarios',    'texto' => 'Usuarios',      'permiso' => 'usuarios.ver'],
        ['ruta' => 'bitacora',    'texto' => 'Bitácora',      'permiso' => 'auditoria.ver'],
    ])->filter(fn ($m) => auth()->check() && auth()->user()->puede($m['permiso']));

    // "Consultar" es redundante para quien ya tiene la pantalla completa de Clientas.
    if (auth()->check() && auth()->user()->puede('clientas.ver')) {
        $menu = $menu->reject(fn ($m) => $m['ruta'] === 'consulta');
    }

    $iniciales = auth()->check()
        ? collect(preg_split('/\s+/', trim(auth()->user()->nombre)))
            ->take(2)
            ->map(fn ($p) => mb_strtoupper(mb_substr($p, 0, 1)))
            ->implode('')
        : '';
@endphp

<div style="min-height:100dvh;">
    @auth
        <header class="cabecera">
            <div class="cabecera-fila">
                <a href="{{ auth()->user()->rutaInicio() }}" class="logo" aria-label="Inicio">
                    <img src="{{ asset('brand/um-principal.png') }}" alt="Mujeres Unidas">
                </a>

                <div class="identidad">
                    <div class="quien">
                        <strong>{{ auth()->user()->nombre }}</strong>
                        <span>{{ auth()->user()->etiquetaRol() }}</span>
                    </div>

                    <div class="iniciales" aria-hidden="true">{{ $iniciales }}</div>

                    <form method="POST" action="{{ route('salir') }}">
                        @csrf
                        <button type="submit" class="btn-fantasma" style="padding:.5rem .75rem; font-size:.75rem;">
                            Salir
                        </button>
                    </form>
                </div>
            </div>

            @if ($menu->count() > 1)
                <nav class="nav">
                    <ul>
                        @foreach ($menu as $m)
                            @php $activo = request()->routeIs($m['ruta']) || request()->routeIs($m['ruta'].'.*'); @endphp
                            <li>
                                <a href="{{ route($m['ruta']) }}"
                                   @class(['activo' => $activo])
                                   @if ($activo) aria-current="page" @endif>
                                    {{ $m['texto'] }}
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </nav>
            @endif
        </header>
    @endauth

    <main class="contenido marca-agua">
        @if (session('exito'))
            <div class="aviso aviso-exito">{{ session('exito') }}</div>
        @endif

        @if ($errors->any())
            <div class="aviso aviso-error" role="alert">
                @foreach ($errors->all() as $error)
                    <div>{{ $error }}</div>
                @endforeach
            </div>
        @endif

        @yield('contenido')
    </main>

    <footer class="pie">
        <p class="pie-linea">Mujeres Unidas · Sistema interno de control de crédito</p>

        <a class="credito" href="mailto:kymesolutions@gmail.com"
           aria-label="Desarrollado por Kyme Solutions">
            <span class="credito-kicker">Desarrollado por</span>
            {{-- Alto fijado también en el HTML: inmune al CSS cacheado. --}}
            <img src="{{ asset('brand/kyme-software.png') }}" alt="Kyme Solutions"
                 height="52" style="height:52px;width:auto;display:block;">
        </a>
    </footer>
</div>

@stack('scripts')
</body>
</html>
