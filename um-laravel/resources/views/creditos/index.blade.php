@extends('base')
@section('titulo', 'Créditos')

@php use App\Support\Dinero; @endphp

@section('contenido')
    <div style="display:flex; justify-content:space-between; align-items:start; gap:1rem; flex-wrap:wrap;">
        <div class="titulo">
            <h1>Créditos</h1>
            <p>{{ $creditos->total() }} en total.</p>
        </div>
        @can('creditos.crear')
            <a href="{{ route('creditos.nuevo') }}" class="btn">Nuevo crédito</a>
        @endcan
    </div>

    <form method="GET" class="tarjeta relleno no-imprimir"
          style="display:flex; gap:.75rem; align-items:end; flex-wrap:wrap; margin-bottom:1.5rem;">
        <div>
            <label class="etiqueta-campo" for="estado">Estado</label>
            <select id="estado" name="estado">
                @foreach (['TODOS', 'ACTIVO', 'VENCIDO', 'LIQUIDADO', 'CANCELADO'] as $e)
                    <option value="{{ $e }}" @selected($estado === $e)>{{ $e }}</option>
                @endforeach
            </select>
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
        <button type="submit" class="btn-secundario">Filtrar</button>
    </form>

    <section class="tarjeta">
        <header><h2>Cartera</h2></header>

        @if ($creditos->isEmpty())
            <div class="vacio"><p>No hay créditos con ese criterio.</p></div>
        @else
            <div class="tabla-envoltura">
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
                            <td class="num">
                                <a href="{{ route('creditos.ficha', $c) }}"
                                   style="font-weight:500; color:var(--patrimonio); text-decoration:none;">
                                    {{ $c->folioFormateado() }}
                                </a>
                            </td>
                            <td>{{ $c->cliente->nombre }}</td>
                            <td>{{ $c->grupo->nombre ?? '—' }}</td>
                            <td style="white-space:nowrap;">{{ $c->fecha_entrega->format('d/m/Y') }}</td>
                            <td style="white-space:nowrap;">{{ $c->fecha_vencimiento->format('d/m/Y') }}</td>
                            <td class="num">{{ Dinero::pesos($c->monto_total) }}</td>
                            <td class="num">{{ Dinero::pesos(max(0, $c->monto_total - (int) $c->pagado)) }}</td>
                            <td><span class="insignia e-{{ $c->estado }}">{{ $c->estado }}</span></td>
                            <td>
                                @can('creditos.tarjeton')
                                    <a href="{{ route('creditos.tarjeton', $c) }}" target="_blank"
                                       class="btn-secundario btn-chico">Tarjetón</a>
                                @endcan
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </section>

    <div class="paginacion">{{ $creditos->links() }}</div>
@endsection
