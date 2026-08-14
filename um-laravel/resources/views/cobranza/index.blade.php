@extends('base')
@section('titulo', 'Cobranza')

@section('contenido')
    <h1>Cobranza del sábado</h1>
    <p class="sub">{{ \App\Support\Fechas::larga($fecha) }}</p>

    <div class="rejilla rejilla-3">
        <div class="dato">
            <div class="dato-etiqueta">Por cobrar</div>
            <div class="dato-valor">{{ \App\Support\Dinero::pesos($esperado) }}</div>
        </div>
        <div class="dato">
            <div class="dato-etiqueta">Cobrado</div>
            <div class="dato-valor">{{ \App\Support\Dinero::pesos($cobrado) }}</div>
        </div>
        <div class="dato {{ $esperado - $cobrado > 0 ? 'dato-alerta' : '' }}">
            <div class="dato-etiqueta">Falta</div>
            <div class="dato-valor">{{ \App\Support\Dinero::pesos(max(0, $esperado - $cobrado)) }}</div>
        </div>
    </div>

    <form method="GET" class="tarjeta no-imprimir" style="display:flex; gap:10px; align-items:end; flex-wrap:wrap;">
        <div>
            <label for="fecha">Sábado</label>
            <input type="date" id="fecha" name="fecha" value="{{ $fecha->format('Y-m-d') }}">
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
        <button type="submit" class="btn btn-secundario">Ver lista</button>
    </form>

    @if ($abonos->isEmpty())
        <div class="tarjeta apagado">No hay abonos programados para este día.</div>
    @else
        <div class="tabla-envoltura tarjeta" style="padding:0;">
            <table class="tabla">
                <thead>
                <tr>
                    <th>Clienta</th>
                    <th>Grupo</th>
                    <th class="num">Sem</th>
                    <th class="num">Toca</th>
                    <th class="num">Pagado</th>
                    <th>Estado</th>
                    <th class="no-imprimir" style="width:230px;">Cobro</th>
                </tr>
                </thead>
                <tbody>
                @foreach ($abonos as $a)
                    <tr>
                        <td>
                            <a href="{{ route('creditos.ficha', $a->credito_id) }}">
                                {{ $a->credito->cliente->nombre }}
                            </a>
                            <div class="apagado" style="font-size:12px;">
                                Folio {{ str_pad($a->credito->cliente->folio, 4, '0', STR_PAD_LEFT) }}
                                @if ($a->credito->cliente->telefono) · {{ $a->credito->cliente->telefono }} @endif
                            </div>
                        </td>
                        <td>{{ $a->credito->grupo->nombre ?? '—' }}</td>
                        <td class="num">{{ $a->semana }}</td>
                        <td class="num">{{ \App\Support\Dinero::pesos($a->monto_esperado) }}</td>
                        <td class="num">{{ \App\Support\Dinero::pesos($a->monto_pagado) }}</td>
                        <td><span class="etiqueta e-{{ $a->estado }}">{{ $a->estado }}</span></td>
                        <td class="no-imprimir">
                            @if ($a->estado === 'PAGADO')
                                <span class="apagado" style="font-size:13px;">Cubierto</span>
                                @can('cobranza.anular')
                                    <form method="POST" action="{{ route('cobranza.anular', $a) }}"
                                          onsubmit="return confirm('¿Cancelar el último movimiento de este abono?')"
                                          style="display:inline;">
                                        @csrf
                                        <button type="submit" class="btn btn-chico btn-secundario">Anular</button>
                                    </form>
                                @endcan
                            @else
                                @can('cobranza.marcar')
                                    <form method="POST" action="{{ route('cobranza.marcar', $a) }}" style="margin-bottom:6px;">
                                        @csrf
                                        <button type="submit" class="btn btn-cobro">
                                            Cobrar {{ \App\Support\Dinero::pesos($a->falta()) }}
                                        </button>
                                    </form>
                                    <form method="POST" action="{{ route('cobranza.abonar', $a) }}"
                                          style="display:flex; gap:6px;">
                                        @csrf
                                        <input type="text" name="monto" placeholder="Abono parcial"
                                               inputmode="decimal" style="flex:1;">
                                        <button type="submit" class="btn btn-chico btn-secundario">Abonar</button>
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
@endsection
