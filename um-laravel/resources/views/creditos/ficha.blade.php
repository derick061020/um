@extends('base')
@section('titulo', 'Crédito '.$credito->folioFormateado())

@section('contenido')
    <div style="display:flex; justify-content:space-between; align-items:start; gap:12px; flex-wrap:wrap;">
        <div>
            <h1>Crédito {{ $credito->folioFormateado() }}</h1>
            <p class="sub">
                <a href="{{ route('clientas.ficha', $credito->cliente_id) }}">{{ $credito->cliente->nombre }}</a>
                @if ($credito->grupo) · {{ $credito->grupo->nombre }} @endif
                · <span class="etiqueta e-{{ $credito->estado }}">{{ $credito->estado }}</span>
            </p>
        </div>
        @can('creditos.tarjeton')
            <a href="{{ route('creditos.tarjeton', $credito) }}" target="_blank" class="btn">Imprimir tarjetón</a>
        @endcan
    </div>

    <div class="rejilla rejilla-4">
        <div class="dato">
            <div class="dato-etiqueta">Prestado</div>
            <div class="dato-valor">{{ \App\Support\Dinero::pesos($credito->monto_prestado) }}</div>
            <div class="dato-pie">Total a pagar: {{ \App\Support\Dinero::pesos($credito->monto_total) }}</div>
        </div>

        <div class="dato">
            <div class="dato-etiqueta">Pagado</div>
            <div class="dato-valor">{{ \App\Support\Dinero::pesos($resumen['total_pagado']) }}</div>
            <div class="dato-pie">{{ $resumen['abonos_pagados'] }} de {{ $credito->num_semanas }} abonos</div>
        </div>

        <div class="dato">
            <div class="dato-etiqueta">Saldo</div>
            <div class="dato-valor">{{ \App\Support\Dinero::pesos($resumen['saldo']) }}</div>
        </div>

        <div class="dato {{ $resumen['atraso_centavos'] > 0 ? 'dato-alerta' : '' }}">
            <div class="dato-etiqueta">Atraso</div>
            <div class="dato-valor">{{ \App\Support\Dinero::pesos($resumen['atraso_centavos']) }}</div>
            <div class="dato-pie">{{ $resumen['semanas_atrasadas'] }} semanas</div>
        </div>
    </div>

    <div class="tarjeta">
        <div class="rejilla rejilla-3">
            <div>
                <div class="dato-etiqueta">Entrega</div>
                <div>{{ \App\Support\Fechas::larga(\App\Support\Fechas::parse($credito->fecha_entrega->format('Y-m-d'))) }}</div>
            </div>
            <div>
                <div class="dato-etiqueta">Primer abono</div>
                <div>{{ $credito->fecha_primer_abono->format('d/m/Y') }}</div>
            </div>
            <div>
                <div class="dato-etiqueta">Vencimiento</div>
                <div>{{ $credito->fecha_vencimiento->format('d/m/Y') }}</div>
            </div>
        </div>
        @if ($credito->notas)
            <p class="pista" style="margin-top:12px;">{{ $credito->notas }}</p>
        @endif
        @if ($credito->capturadoPor)
            <p class="pista">Capturado por {{ $credito->capturadoPor->nombre }}.</p>
        @endif
    </div>

    <h2>Calendario de abonos</h2>

    <div class="tabla-envoltura tarjeta" style="padding:0;">
        <table class="tabla">
            <thead>
            <tr>
                <th class="num">Semana</th>
                <th>Sábado</th>
                <th class="num">Toca</th>
                <th class="num">Pagado</th>
                <th>Estado</th>
                <th>Cubierto el</th>
            </tr>
            </thead>
            <tbody>
            @foreach ($credito->abonos as $a)
                <tr>
                    <td class="num">{{ $a->semana }}</td>
                    <td>{{ $a->fecha_programada->format('d/m/Y') }}</td>
                    <td class="num">{{ \App\Support\Dinero::pesos($a->monto_esperado) }}</td>
                    <td class="num">{{ \App\Support\Dinero::pesos($a->monto_pagado) }}</td>
                    <td><span class="etiqueta e-{{ $a->estado }}">{{ $a->estado }}</span></td>
                    <td class="apagado">{{ $a->pagado_en?->format('d/m/Y') ?? '—' }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
@endsection
