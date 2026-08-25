@extends('base')
@section('titulo', $clienta->nombre)

@php use App\Support\Dinero; @endphp

@section('contenido')
    <nav class="migas">
        <a href="{{ route('consulta') }}">Consulta</a>
        <span aria-hidden="true">/</span>
        <span class="actual">{{ $clienta->nombre }}</span>
    </nav>

    <div class="titulo">
        <h1>{{ $clienta->nombre }}</h1>
        <p>{{ $clienta->idPublico() }} @if ($clienta->grupo) · {{ $clienta->grupo->nombre }} @endif</p>
    </div>

    <section class="tarjeta" style="margin-bottom:1.5rem;">
        <header><h2>Datos</h2></header>
        <div class="relleno rejilla rejilla-3">
            <div class="dato"><dt>Teléfono</dt><dd>{{ $clienta->telefono ?: '—' }}</dd></div>
            <div class="dato"><dt>Domicilio</dt><dd>{{ $clienta->domicilio ?: '—' }}</dd></div>
            <div class="dato"><dt>Aval</dt><dd>{{ $clienta->aval_nombre ?: '—' }}</dd></div>
        </div>
    </section>

    <section class="tarjeta">
        <header><h2>Historial de créditos</h2></header>
        @if ($clienta->creditos->isEmpty())
            <div class="vacio"><p>Esta clienta no tiene créditos registrados.</p></div>
        @else
            <div class="tabla-envoltura">
                <table class="tabla">
                    <thead>
                    <tr>
                        <th class="num">Folio</th>
                        <th>Entrega</th>
                        <th class="num">Total</th>
                        <th class="num">Pagado</th>
                        <th class="num">Saldo</th>
                        <th>Estado</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($clienta->creditos as $c)
                        @php $pagado = (int) $c->abonos->sum('monto_pagado'); @endphp
                        <tr>
                            <td class="num">{{ $c->folioFormateado() }}</td>
                            <td>{{ $c->fecha_entrega->format('d/m/Y') }}</td>
                            <td class="num">{{ Dinero::pesos($c->monto_total) }}</td>
                            <td class="num">{{ Dinero::pesos($pagado) }}</td>
                            <td class="num">{{ Dinero::pesos(max(0, $c->monto_total - $pagado)) }}</td>
                            <td><span class="insignia e-{{ $c->estado }}">{{ $c->estado }}</span></td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </section>
@endsection
