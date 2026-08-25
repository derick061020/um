@extends('base')
@section('titulo', 'Clientas')

@php use App\Support\Dinero; @endphp

@section('contenido')
    <div style="display:flex; justify-content:space-between; align-items:start; gap:1rem; flex-wrap:wrap;">
        <div class="titulo">
            <h1>Tarjetero de clientas</h1>
            <p>Ordenadas por grupo, fecha del préstamo y tarjeta. {{ $clientas->total() }} clientas.</p>
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
                        <th>Clienta</th>
                        <th>Grupo</th>
                        <th>Préstamo</th>
                        <th class="num">Tarjeta</th>
                        <th class="num">Abono</th>
                        <th class="num">Pago</th>
                        <th class="num">Saldo</th>
                        <th>Estado</th>
                        <th class="no-imprimir" style="width:14rem;">Cobro</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($clientas as $c)
                        @php
                            $ca = $c->creditoActivo;
                            $abonoActual = $ca?->abonos->firstWhere('estado', '!=', 'PAGADO');
                        @endphp
                        <tr>
                            <td>
                                <a href="{{ route('clientas.ficha', $c) }}"
                                   style="font-weight:500; color:var(--patrimonio); text-decoration:none;">{{ $c->nombre }}</a>
                                <div class="apagado" style="font-size:.6875rem;">{{ $c->idPublico() }}</div>
                            </td>
                            <td>{{ $c->grupo->nombre ?? '—' }}</td>
                            <td>{{ $ca ? $ca->fecha_entrega->format('d/m/Y') : '—' }}</td>
                            <td class="num">{{ $ca ? $ca->folioFormateado() : '—' }}</td>
                            <td class="num">{{ $ca ? Dinero::pesos($ca->abono_semanal) : '—' }}</td>
                            <td class="num">{{ $ca ? $ca->semanaActual().' de '.$ca->num_semanas : '—' }}</td>
                            <td class="num">{{ $ca ? Dinero::pesos($ca->saldo()) : '—' }}</td>
                            <td>
                                @if ($abonoActual)
                                    <span class="insignia e-{{ $abonoActual->estado }}">{{ $abonoActual->estado }}</span>
                                @elseif ($ca)
                                    <span class="insignia e-PAGADO">AL CORRIENTE</span>
                                @else
                                    <span class="apagado">sin crédito</span>
                                @endif
                            </td>
                            <td class="no-imprimir">
                                @if ($ca && $abonoActual)
                                    @can('cobranza.marcar')
                                        <form method="POST" action="{{ route('cobranza.marcar', $abonoActual) }}" style="margin-bottom:.35rem;">
                                            @csrf
                                            <button type="submit" class="btn btn-cobro">
                                                Cobrado {{ Dinero::pesos($abonoActual->falta()) }}
                                            </button>
                                        </form>
                                        <form method="POST" action="{{ route('cobranza.abonar', $abonoActual) }}" style="display:flex; gap:.35rem; margin-bottom:.35rem;">
                                            @csrf
                                            <input type="text" name="monto" placeholder="Abonar" inputmode="decimal"
                                                   style="flex:1; padding:.35rem .5rem; font-size:.8125rem;">
                                            <button type="submit" class="btn-secundario btn-chico">Abonar</button>
                                        </form>
                                    @endcan
                                @endif
                                @can('renovaciones.procesar')
                                    @if ($ca && $ca->puedeRenovar())
                                        <a href="{{ route('creditos.renovar', $ca) }}" class="btn-secundario btn-chico" style="width:100%; text-align:center;">Renovación</a>
                                    @elseif ($ca)
                                        <span class="apagado" style="font-size:.6875rem;">Renovación: solo en el último pago</span>
                                    @endif
                                @endcan
                                @if (! $ca)
                                    @can('creditos.crear')
                                        <a href="{{ route('creditos.nuevo', ['clienta' => $c->id]) }}" class="btn-secundario btn-chico">Dar crédito</a>
                                    @endcan
                                @endif
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
