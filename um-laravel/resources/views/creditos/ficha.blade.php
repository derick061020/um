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
        <div style="display:flex; gap:.5rem; flex-wrap:wrap;">
            @can('renovaciones.procesar')
                @if ($credito->estaAbierto())
                    <a href="{{ route('creditos.renovar', $credito) }}" class="btn-secundario">Renovar</a>
                @endif
            @endcan
            @can('creditos.tarjeton')
                <a href="{{ route('creditos.tarjeton', $credito) }}" target="_blank" class="btn">Imprimir tarjetón</a>
            @endcan
        </div>
    </div>

    @if ($credito->renovado_de_id || $credito->renovacion->isNotEmpty())
        <div class="aviso aviso-info">
            @if ($credito->renovado_de_id)
                Es una <strong>renovación</strong> del crédito
                <a href="{{ route('creditos.ficha', $credito->renovado_de_id) }}">{{ $credito->renovadoDe?->folioFormateado() }}</a>.
            @endif
            @foreach ($credito->renovacion as $r)
                Fue renovado en el crédito
                <a href="{{ route('creditos.ficha', $r->id) }}">{{ $r->folioFormateado() }}</a>.
            @endforeach
        </div>
    @endif

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

    @can('correcciones.aplicar')
        <section class="tarjeta no-imprimir" style="margin-top:1.5rem; border-color:rgba(156,47,47,.25);">
            <header><h2 style="color:var(--riesgo);">Corrección del admin</h2></header>
            <div class="relleno">
                <p class="ayuda" style="margin-top:0;">
                    Corrige semanas, montos o estado cuando hubo un error de captura. Se rehace el
                    calendario conservando el total ya pagado, y el cambio queda en la bitácora con
                    el valor anterior, el nuevo y el motivo.
                </p>
                <form method="POST" action="{{ route('creditos.corregir', $credito) }}"
                      onsubmit="return confirm('¿Aplicar la corrección? Se rehará el calendario del crédito.')">
                    @csrf
                    <div class="rejilla rejilla-3">
                        <div class="grupo-campo">
                            <label class="etiqueta-campo">Monto prestado</label>
                            <input type="text" name="monto_prestado" inputmode="decimal"
                                   value="{{ Dinero::compacto($credito->monto_prestado) }}">
                        </div>
                        <div class="grupo-campo">
                            <label class="etiqueta-campo">Total a pagar</label>
                            <input type="text" name="monto_total" inputmode="decimal"
                                   value="{{ Dinero::compacto($credito->monto_total) }}">
                        </div>
                        <div class="grupo-campo">
                            <label class="etiqueta-campo">Semanas</label>
                            <input type="number" name="num_semanas" min="1" max="104" value="{{ $credito->num_semanas }}">
                        </div>
                        <div class="grupo-campo">
                            <label class="etiqueta-campo">Lunes de entrega</label>
                            <input type="date" name="fecha_entrega" value="{{ $credito->fecha_entrega->format('Y-m-d') }}">
                        </div>
                        <div class="grupo-campo">
                            <label class="etiqueta-campo">Estado</label>
                            <select name="estado">
                                @foreach (['ACTIVO', 'VENCIDO', 'LIQUIDADO', 'CANCELADO', 'RENOVADO'] as $e)
                                    <option value="{{ $e }}" @selected($credito->estado === $e)>{{ $e }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="grupo-campo">
                            <label class="etiqueta-campo">Motivo *</label>
                            <input type="text" name="motivo" required minlength="4"
                                   placeholder="Ej.: se capturó a 13 semanas, eran 12">
                        </div>
                    </div>
                    <button type="submit" class="btn-peligro">Aplicar corrección</button>
                </form>
            </div>
        </section>
    @endcan
@endsection
