@extends('base')
@section('titulo', 'Crédito '.$credito->folioFormateado())

@php
    use App\Support\Dinero;
    use App\Support\Fechas;
@endphp

@section('contenido')
    <nav class="migas">
        <a href="{{ route('creditos') }}">Créditos</a>
        <span aria-hidden="true">/</span>
        <span class="actual">Folio {{ $credito->folioFormateado() }}</span>
    </nav>

    <div style="display:flex; justify-content:space-between; align-items:start; gap:1rem; flex-wrap:wrap;">
        <div class="titulo">
            <h1>Crédito {{ $credito->folioFormateado() }}</h1>
            <p>
                <a href="{{ route('clientas.ficha', $credito->cliente_id) }}">{{ $credito->cliente->nombre }}</a>
                @if ($credito->grupo) · {{ $credito->grupo->nombre }} @endif
                · <span class="insignia e-{{ $credito->estado }}">{{ $credito->estado }}</span>
            </p>
        </div>
        @can('creditos.tarjeton')
            <a href="{{ route('creditos.tarjeton', $credito) }}" target="_blank" class="btn">Imprimir tarjetón</a>
        @endcan
    </div>

    <div class="rejilla rejilla-4" style="margin-bottom:1.5rem;">
        <div class="indicador">
            <p class="etiqueta">Prestado</p>
            <p class="valor">{{ Dinero::pesos($credito->monto_prestado) }}</p>
            <p class="nota">Total a pagar: {{ Dinero::pesos($credito->monto_total) }}</p>
        </div>
        <div class="indicador">
            <p class="etiqueta">Pagado</p>
            <p class="valor valor-verde">{{ Dinero::pesos($resumen['total_pagado']) }}</p>
            <p class="nota">{{ $resumen['abonos_pagados'] }} de {{ $credito->num_semanas }} abonos</p>
        </div>
        <div class="indicador">
            <p class="etiqueta">Saldo</p>
            <p class="valor">{{ Dinero::pesos($resumen['saldo']) }}</p>
        </div>
        <div class="indicador">
            <p class="etiqueta">Atraso</p>
            <p class="valor {{ $resumen['atraso_centavos'] > 0 ? 'valor-rojo' : 'valor-verde' }}">
                {{ Dinero::pesos($resumen['atraso_centavos']) }}
            </p>
            <p class="nota">{{ $resumen['semanas_atrasadas'] }} semanas</p>
        </div>
    </div>

    <section class="tarjeta" style="margin-bottom:1.5rem;">
        <header><h2>Datos del crédito</h2></header>
        <div class="relleno rejilla rejilla-3">
            <div class="dato">
                <dt>Entrega</dt>
                <dd>{{ Fechas::larga(Fechas::parse($credito->fecha_entrega->format('Y-m-d'))) }}</dd>
            </div>
            <div class="dato">
                <dt>Primer abono</dt>
                <dd>{{ $credito->fecha_primer_abono->format('d/m/Y') }}</dd>
            </div>
            <div class="dato">
                <dt>Vencimiento</dt>
                <dd>{{ $credito->fecha_vencimiento->format('d/m/Y') }}</dd>
            </div>
            @if ($credito->notas)
                <div class="dato" style="grid-column:1/-1;">
                    <dt>Notas</dt>
                    <dd>{{ $credito->notas }}</dd>
                </div>
            @endif
            @if ($credito->capturadoPor)
                <div class="dato">
                    <dt>Capturado por</dt>
                    <dd>{{ $credito->capturadoPor->nombre }}</dd>
                </div>
            @endif
        </div>
    </section>

    <section class="tarjeta">
        <header><h2>Calendario de abonos</h2></header>
        <div class="tabla-envoltura">
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
                        <td class="num">{{ Dinero::pesos($a->monto_esperado) }}</td>
                        <td class="num">{{ Dinero::pesos($a->monto_pagado) }}</td>
                        <td><span class="insignia e-{{ $a->estado }}">{{ $a->estado }}</span></td>
                        <td class="apagado">{{ $a->pagado_en?->format('d/m/Y') ?? '—' }}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </section>
@endsection
