@extends('base')
@section('titulo', 'Créditos')

@section('contenido')
    <div style="display:flex; justify-content:space-between; align-items:start; gap:12px; flex-wrap:wrap;">
        <div>
            <h1>Créditos</h1>
            <p class="sub">{{ $creditos->total() }} en total</p>
        </div>
        @can('creditos.crear')
            <a href="{{ route('creditos.nuevo') }}" class="btn">Nuevo crédito</a>
        @endcan
    </div>

    <form method="GET" class="tarjeta no-imprimir" style="display:flex; gap:10px; align-items:end; flex-wrap:wrap;">
        <div>
            <label for="estado">Estado</label>
            <select id="estado" name="estado">
                @foreach (['TODOS', 'ACTIVO', 'VENCIDO', 'LIQUIDADO', 'CANCELADO'] as $e)
                    <option value="{{ $e }}" @selected($estado === $e)>{{ $e }}</option>
                @endforeach
            </select>
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
        <button type="submit" class="btn btn-secundario">Filtrar</button>
    </form>

    @if ($creditos->isEmpty())
        <div class="tarjeta apagado">No hay créditos con ese criterio.</div>
    @else
        <div class="tabla-envoltura tarjeta" style="padding:0;">
            <table class="tabla">
                <thead>
                <tr>
                    <th class="num">Folio</th>
                    <th>Clienta</th>
                    <th>Grupo</th>
                    <th>Entrega</th>
                    <th>Vence</th>
                    <th class="num">Total</th>
                    <th class="num">Saldo</th>
                    <th>Estado</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                @foreach ($creditos as $c)
                    <tr>
                        <td class="num"><a href="{{ route('creditos.ficha', $c) }}">{{ $c->folioFormateado() }}</a></td>
                        <td>{{ $c->cliente->nombre }}</td>
                        <td>{{ $c->grupo->nombre ?? '—' }}</td>
                        <td>{{ $c->fecha_entrega->format('d/m/Y') }}</td>
                        <td>{{ $c->fecha_vencimiento->format('d/m/Y') }}</td>
                        <td class="num">{{ \App\Support\Dinero::pesos($c->monto_total) }}</td>
                        <td class="num">{{ \App\Support\Dinero::pesos(max(0, $c->monto_total - (int) $c->pagado)) }}</td>
                        <td><span class="etiqueta e-{{ $c->estado }}">{{ $c->estado }}</span></td>
                        <td>
                            @can('creditos.tarjeton')
                                <a href="{{ route('creditos.tarjeton', $c) }}" target="_blank"
                                   class="btn btn-chico btn-secundario">Tarjetón</a>
                            @endcan
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>

        <div class="paginacion">{{ $creditos->links() }}</div>
    @endif
@endsection
