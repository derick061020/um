@extends('base')
@section('titulo', 'Panel')

@php
    use App\Support\Dinero;
    use App\Support\Fechas;
@endphp

@section('contenido')
    <div class="titulo">
        <h1>Panel general</h1>
        <p>Hola, {{ $nombre }}. Esto es lo que hay al {{ Fechas::larga($referencia) }}.</p>
    </div>

    <div class="rejilla rejilla-4" style="margin-bottom:1.5rem;">
        <a class="indicador" href="{{ route('cobranza', ['fecha' => $sabado->format('Y-m-d')]) }}">
            <p class="etiqueta">A cobrar el sábado</p>
            <p class="valor">{{ Dinero::pesos($esperadoSabado) }}</p>
            <p class="nota">
                {{ ucfirst(Fechas::larga($sabado)) }} · cobrado {{ Dinero::pesos($cobradoSabado) }}
            </p>
        </a>

        <a class="indicador" href="{{ route('creditos') }}">
            <p class="etiqueta">Cartera activa</p>
            <p class="valor">{{ Dinero::pesos($carteraActiva) }}</p>
            <p class="nota">{{ $creditosActivos }} créditos vigentes</p>
        </a>

        <a class="indicador" href="{{ route('creditos', ['estado' => 'VENCIDO']) }}">
            <p class="etiqueta">Atraso acumulado</p>
            <p class="valor {{ $atrasoTotal > 0 ? 'valor-rojo' : 'valor-verde' }}">
                {{ Dinero::pesos($atrasoTotal) }}
            </p>
            <p class="nota">{{ $vencidos }} crédito(s) vencido(s)</p>
        </a>

        <a class="indicador" href="{{ route('clientas') }}">
            <p class="etiqueta">Clientas activas</p>
            <p class="valor">{{ $clientas }}</p>
            <p class="nota">Con expediente abierto</p>
        </a>
    </div>

    <div class="rejilla rejilla-ancha">
        <section class="tarjeta">
            <header>
                <h2>Últimos abonos capturados</h2>
                <a href="{{ route('cobranza') }}" class="btn-fantasma btn-chico">Ir a cobranza</a>
            </header>

            @if ($ultimos->isEmpty())
                <div class="vacio">
                    <p>Todavía no se ha capturado ningún abono.</p>
                </div>
            @else
                <ul class="lista-partida">
                    @foreach ($ultimos as $p)
                        <li>
                            <div style="min-width:0;">
                                <a class="principal" href="{{ route('creditos.ficha', $p->credito_id) }}">
                                    {{ $p->credito->cliente->nombre ?? '—' }}
                                </a>
                                <p class="secundario">
                                    {{ $p->registradoPor->nombre ?? '—' }} ·
                                    {{ preg_replace('/ de \d{4}$/', '', Fechas::larga(Fechas::parse($p->fecha->format('Y-m-d')))) }}
                                </p>
                            </div>
                            <span class="monto">{{ Dinero::pesos($p->monto) }}</span>
                        </li>
                    @endforeach
                </ul>
            @endif
        </section>

        <section class="tarjeta">
            <header><h2>Accesos rápidos</h2></header>
            <div class="relleno rejilla rejilla-2">
                <a class="acceso" href="{{ route('clientas.nueva') }}">Dar de alta una clienta</a>
                <a class="acceso" href="{{ route('creditos.nuevo') }}">Registrar un crédito</a>
                <a class="acceso" href="{{ route('cobranza') }}">Capturar la cobranza</a>
                <a class="acceso" href="{{ route('grupos') }}">Administrar grupos</a>
                <a class="acceso" href="{{ route('corte') }}">Ver el cobro del día</a>
                <a class="acceso" href="{{ route('usuarios') }}">Usuarios del sistema</a>
            </div>
        </section>
    </div>
@endsection
