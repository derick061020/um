@extends('base')
@section('titulo', 'Clientas')

@section('contenido')
    <div style="display:flex; justify-content:space-between; align-items:start; gap:12px; flex-wrap:wrap;">
        <div>
            <h1>Clientas</h1>
            <p class="sub">{{ $clientas->total() }} registradas</p>
        </div>
        @can('clientas.crear')
            <a href="{{ route('clientas.nueva') }}" class="btn">Nueva clienta</a>
        @endcan
    </div>

    <form method="GET" class="tarjeta no-imprimir" style="display:flex; gap:10px; align-items:end; flex-wrap:wrap;">
        <div style="flex:1; min-width:200px;">
            <label for="q">Buscar por nombre, folio, teléfono o aval</label>
            <input type="text" id="q" name="q" value="{{ $busqueda }}">
        </div>
        <div>
            <label for="grupo">Grupo</label>
            <select id="grupo" name="grupo">
                <option value="">Todos</option>
                @foreach ($grupos as $g)
                    <option value="{{ $g->id }}" @selected($grupoId == $g->id)>{{ $g->nombre }}</option>
                @endforeach
            </select>
        </div>
        <button type="submit" class="btn btn-secundario">Buscar</button>
    </form>

    @if ($clientas->isEmpty())
        <div class="tarjeta apagado">No se encontraron clientas con ese criterio.</div>
    @else
        <div class="tabla-envoltura tarjeta" style="padding:0;">
            <table class="tabla">
                <thead>
                <tr>
                    <th class="num">Folio</th>
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
                        <td class="num">{{ $c->folioFormateado() }}</td>
                        <td>
                            <a href="{{ route('clientas.ficha', $c) }}">{{ $c->nombre }}</a>
                            @unless ($c->activo)
                                <span class="etiqueta e-CANCELADO">inactiva</span>
                            @endunless
                        </td>
                        <td>{{ $c->grupo->nombre ?? '—' }}</td>
                        <td class="apagado">{{ $c->aval_nombre ?? '—' }}</td>
                        <td>{{ $c->telefono ?? '—' }}</td>
                        <td class="num">{{ $c->creditos_count }}</td>
                        <td>
                            @can('creditos.crear')
                                <a href="{{ route('creditos.nuevo', ['clienta' => $c->id]) }}"
                                   class="btn btn-chico btn-secundario">Dar crédito</a>
                            @endcan
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>

        <div class="paginacion">{{ $clientas->links() }}</div>
    @endif
@endsection
