@extends('base')
@section('titulo', 'Consulta de clientas')

@section('contenido')
    <div class="titulo">
        <h1>Consulta de clientas</h1>
        <p>Busca a una clienta para ver si ya existe y revisar su historial. Solo lectura.</p>
    </div>

    <form method="GET" class="tarjeta relleno no-imprimir"
          style="display:flex; gap:.75rem; align-items:end; flex-wrap:wrap; margin-bottom:1.5rem;">
        <div style="flex:1; min-width:14rem;">
            <label class="etiqueta-campo" for="q">Nombre, ID (CL-000123), teléfono o aval</label>
            <input type="search" id="q" name="q" value="{{ $busqueda }}" autofocus placeholder="Hermenegilda…">
        </div>
        <button type="submit" class="btn">Buscar</button>
    </form>

    @if ($busqueda !== '')
        <section class="tarjeta">
            <header><h2>Resultados</h2></header>
            @if ($resultados->isEmpty())
                <div class="vacio"><p>No se encontró ninguna clienta con «{{ $busqueda }}».</p></div>
            @else
                <div class="tabla-envoltura">
                    <table class="tabla">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Grupo</th>
                            <th>Aval</th>
                            <th class="num">Créditos</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach ($resultados as $c)
                            <tr>
                                <td class="apagado">{{ $c->idPublico() }}</td>
                                <td style="font-weight:500;">{{ $c->nombre }}</td>
                                <td>{{ $c->grupo->nombre ?? '—' }}</td>
                                <td class="apagado">{{ $c->aval_nombre ?? '—' }}</td>
                                <td class="num">{{ $c->creditos_count }}</td>
                                <td><a href="{{ route('consulta.ver', $c) }}" class="btn-secundario btn-chico">Ver historial</a></td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </section>
    @endif
@endsection
