@extends('base')
@section('titulo', 'Panel')

@section('contenido')
    <h1>Panel</h1>
    <p class="sub">Cobro del {{ \App\Support\Fechas::larga($sabado) }}</p>

    <div class="rejilla rejilla-4">
        <div class="dato">
            <div class="dato-etiqueta">Por cobrar el sábado</div>
            <div class="dato-valor">{{ \App\Support\Dinero::pesos($porCobrar) }}</div>
            <div class="dato-pie">Cobrado: {{ \App\Support\Dinero::pesos($cobrado) }}</div>
        </div>

        <div class="dato {{ $montoAtrasado > 0 ? 'dato-alerta' : '' }}">
            <div class="dato-etiqueta">Atraso acumulado</div>
            <div class="dato-valor">{{ \App\Support\Dinero::pesos($montoAtrasado) }}</div>
            <div class="dato-pie">{{ $atrasados->count() }} abonos vencidos sin cubrir</div>
        </div>

        <div class="dato">
            <div class="dato-etiqueta">Saldo de cartera</div>
            <div class="dato-valor">{{ \App\Support\Dinero::pesos($saldoCartera) }}</div>
            <div class="dato-pie">{{ $activos }} activos · {{ $vencidos }} vencidos</div>
        </div>

        <div class="dato">
            <div class="dato-etiqueta">Operación</div>
            <div class="dato-valor">{{ $clientas }}</div>
            <div class="dato-pie">clientas en {{ $grupos }} grupos · {{ $liquidados }} créditos liquidados</div>
        </div>
    </div>

    <h2>Abonos atrasados</h2>

    @if ($atrasados->isEmpty())
        <div class="tarjeta apagado">No hay abonos vencidos sin cubrir. Todo al corriente.</div>
    @else
        <div class="tabla-envoltura tarjeta" style="padding:0;">
            <table class="tabla">
                <thead>
                <tr>
                    <th>Clienta</th>
                    <th>Grupo</th>
                    <th>Debía pagar</th>
                    <th class="num">Sem</th>
                    <th class="num">Falta</th>
                    <th>Estado</th>
                </tr>
                </thead>
                <tbody>
                @foreach ($atrasados as $a)
                    <tr>
                        <td>
                            <a href="{{ route('creditos.ficha', $a->credito_id) }}">
                                {{ $a->credito->cliente->nombre }}
                            </a>
                        </td>
                        <td>{{ $a->credito->grupo->nombre ?? '—' }}</td>
                        <td>{{ $a->fecha_programada->format('d/m/Y') }}</td>
                        <td class="num">{{ $a->semana }}</td>
                        <td class="num">{{ \App\Support\Dinero::pesos($a->falta()) }}</td>
                        <td><span class="etiqueta e-{{ $a->estado }}">{{ $a->estado }}</span></td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
        <p class="pista">Se muestran los 15 más antiguos.</p>
    @endif
@endsection
