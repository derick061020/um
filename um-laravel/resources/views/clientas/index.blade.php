@extends('base')
@section('titulo', 'Clientas')

@section('contenido')
    <div style="display:flex; justify-content:space-between; align-items:start; gap:1rem; flex-wrap:wrap;">
        <div class="titulo">
            <h1>Clientas</h1>
            <p>{{ $clientas->total() }} registradas con expediente.</p>
        </div>
        @can('clientas.crear')
            <a href="{{ route('clientas.nueva') }}" class="btn">Nueva clienta</a>
        @endcan
    </div>

    <form method="GET" class="tarjeta relleno no-imprimir"
          style="display:flex; gap:.75rem; align-items:end; flex-wrap:wrap; margin-bottom:1.5rem;">
        <div style="flex:1; min-width:14rem;">
            <label class="etiqueta-campo" for="q">Buscar por nombre, folio, teléfono o aval</label>
            <input type="search" id="q" name="q" value="{{ $busqueda }}">
        </div>
        <div>
            <label class="etiqueta-campo" for="grupo">Grupo</label>
            <select id="grupo" name="grupo">
                <option value="">Todos</option>
                @foreach ($grupos as $g)
                    <option value="{{ $g->id }}" @selected($grupoId == $g->id)>{{ $g->nombre }}</option>
                @endforeach
            </select>
        </div>
        <button type="submit" class="btn-secundario">Buscar</button>
    </form>

    <section class="tarjeta">
        <header><h2>Listado</h2></header>

        @if ($clientas->isEmpty())
            <div class="vacio"><p>No se encontraron clientas con ese criterio.</p></div>
        @else
            <div class="tabla-envoltura">
                <table class="tabla">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Grupo</th>
                        <th>Aval</th>
                        <th>Teléfono</th>
                        <th class="num">Créditos</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($clientas as $c)
                        <tr>
                            <td class="apagado">{{ $c->idPublico() }}</td>
                            <td>
                                <a href="{{ route('clientas.ficha', $c) }}"
                                   style="font-weight:500; color:var(--patrimonio); text-decoration:none;">
                                    {{ $c->nombre }}
                                </a>
                                @unless ($c->activo)
                                    <span class="insignia insignia-neutro">inactiva</span>
                                @endunless
                            </td>
                            <td>{{ $c->grupo->nombre ?? '—' }}</td>
                            <td class="apagado">{{ $c->aval_nombre ?? '—' }}</td>
                            <td>{{ $c->telefono ?? '—' }}</td>
                            <td class="num">{{ $c->creditos_count }}</td>
                            <td>
                                @can('creditos.crear')
                                    <a href="{{ route('creditos.nuevo', ['clienta' => $c->id]) }}"
                                       class="btn-secundario btn-chico">Dar crédito</a>
                                @endcan
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </section>

    <div class="paginacion">{{ $clientas->links() }}</div>
@endsection
