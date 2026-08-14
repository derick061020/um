@extends('base')
@section('titulo', 'Cobranza')

@php
    use App\Support\Dinero;
    use App\Support\Fechas;
@endphp

@section('contenido')
    <div class="titulo">
        <h1>Cobranza del sábado</h1>
        <p>{{ ucfirst(Fechas::larga($fecha)) }}</p>
    </div>

    <div class="rejilla rejilla-3" style="margin-bottom:1.5rem;">
        <div class="indicador">
            <p class="etiqueta">Por cobrar</p>
            <p class="valor">{{ Dinero::pesos($esperado) }}</p>
        </div>
        <div class="indicador">
            <p class="etiqueta">Cobrado</p>
            <p class="valor valor-verde">{{ Dinero::pesos($cobrado) }}</p>
        </div>
        <div class="indicador">
            <p class="etiqueta">Falta</p>
            <p class="valor {{ $esperado - $cobrado > 0 ? 'valor-rojo' : '' }}">
                {{ Dinero::pesos(max(0, $esperado - $cobrado)) }}
            </p>
        </div>
    </div>

    <form method="GET" class="tarjeta relleno no-imprimir"
          style="display:flex; gap:.75rem; align-items:end; flex-wrap:wrap; margin-bottom:1.5rem;">
        <div>
            <label class="etiqueta-campo" for="fecha">Sábado</label>
            <input type="date" id="fecha" name="fecha" value="{{ $fecha->format('Y-m-d') }}">
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
        <button type="submit" class="btn-secundario">Ver lista</button>
    </form>

    <section class="tarjeta">
        <header><h2>Lista de cobro</h2></header>

        @if ($abonos->isEmpty())
            <div class="vacio"><p>No hay abonos programados para este día.</p></div>
        @else
            <div class="tabla-envoltura">
                <table class="tabla">
                    <thead>
                    <tr>
                        <th>Clienta</th>
                        <th>Grupo</th>
                        <th class="num">Sem</th>
                        <th class="num">Toca</th>
                        <th class="num">Pagado</th>
                        <th>Estado</th>
                        <th class="no-imprimir" style="width:15rem;">Cobro</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($abonos as $a)
                        <tr>
                            <td>
                                <a href="{{ route('creditos.ficha', $a->credito_id) }}"
                                   style="font-weight:500; color:var(--patrimonio); text-decoration:none;">
                                    {{ $a->credito->cliente->nombre }}
                                </a>
                                <div class="apagado" style="font-size:.75rem;">
                                    Folio {{ str_pad($a->credito->cliente->folio, 4, '0', STR_PAD_LEFT) }}
                                    @if ($a->credito->cliente->telefono) · {{ $a->credito->cliente->telefono }} @endif
                                </div>
                            </td>
                            <td>{{ $a->credito->grupo->nombre ?? '—' }}</td>
                            <td class="num">{{ $a->semana }}</td>
                            <td class="num">{{ Dinero::pesos($a->monto_esperado) }}</td>
                            <td class="num">{{ Dinero::pesos($a->monto_pagado) }}</td>
                            <td><span class="insignia e-{{ $a->estado }}">{{ $a->estado }}</span></td>
                            <td class="no-imprimir">
                                @if ($a->estado === 'PAGADO')
                                    <span class="apagado" style="font-size:.8125rem;">Cubierto</span>
                                    @can('cobranza.anular')
                                        <form method="POST" action="{{ route('cobranza.anular', $a) }}"
                                              onsubmit="return confirm('¿Cancelar el último movimiento de este abono?')"
                                              style="display:inline;">
                                            @csrf
                                            <button type="submit" class="btn-peligro btn-chico">Anular</button>
                                        </form>
                                    @endcan
                                @else
                                    @can('cobranza.marcar')
                                        <form method="POST" action="{{ route('cobranza.marcar', $a) }}" style="margin-bottom:.375rem;">
                                            @csrf
                                            <button type="submit" class="btn btn-cobro">
                                                Cobrar {{ Dinero::pesos($a->falta()) }}
                                            </button>
                                        </form>
                                        <form method="POST" action="{{ route('cobranza.abonar', $a) }}"
                                              style="display:flex; gap:.375rem;">
                                            @csrf
                                            <input type="text" name="monto" placeholder="Parcial"
                                                   inputmode="decimal" style="flex:1; padding:.375rem .5rem; font-size:.8125rem;">
                                            <button type="submit" class="btn-secundario btn-chico">Abonar</button>
                                        </form>
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
@endsection
