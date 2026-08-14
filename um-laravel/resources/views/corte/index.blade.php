@extends('base')
@section('titulo', 'Corte del día')

@section('contenido')
    <h1>Corte del día</h1>
    <p class="sub">{{ \App\Support\Fechas::larga($fecha) }}</p>

    {{-- Pantalla única de la ENCARGADA: el total y nada más. Sin nombres,
         sin domicilios y sin importes por clienta. --}}
    <div class="tarjeta" style="text-align:center; padding:34px 18px;">
        <div class="dato-etiqueta">Total a cobrar hoy</div>
        <div class="dato-valor" style="font-size:56px;">{{ \App\Support\Dinero::pesos($esperado) }}</div>
        <div class="dato-pie">{{ $clientas }} {{ $clientas === 1 ? 'clienta' : 'clientas' }} en la lista</div>
    </div>

    <div class="rejilla rejilla-3">
        <div class="dato">
            <div class="dato-etiqueta">Cobrado</div>
            <div class="dato-valor">{{ \App\Support\Dinero::pesos($cobrado) }}</div>
            <div class="dato-pie">{{ $pagados }} de {{ $clientas }} pagados</div>
        </div>

        <div class="dato {{ $faltante > 0 ? 'dato-alerta' : '' }}">
            <div class="dato-etiqueta">Falta por cobrar</div>
            <div class="dato-valor">{{ \App\Support\Dinero::pesos($faltante) }}</div>
        </div>

        <div class="dato">
            <div class="dato-etiqueta">Avance</div>
            <div class="dato-valor">{{ $esperado > 0 ? round($cobrado * 100 / $esperado) : 0 }}%</div>
        </div>
    </div>

    <form method="GET" class="tarjeta no-imprimir" style="display:flex; gap:10px; align-items:end; max-width:420px;">
        <div style="flex:1;">
            <label for="fecha">Ver otro día</label>
            <input type="date" id="fecha" name="fecha" value="{{ $fecha->format('Y-m-d') }}">
        </div>
        <button type="submit" class="btn btn-secundario">Ver</button>
    </form>

    @if ($verDesglose && $porGrupo->isNotEmpty())
        <h2>Desglose por grupo</h2>
        <div class="tabla-envoltura tarjeta" style="padding:0;">
            <table class="tabla">
                <thead>
                <tr>
                    <th>Grupo</th>
                    <th class="num">Clientas</th>
                    <th class="num">Esperado</th>
                    <th class="num">Cobrado</th>
                    <th class="num">Falta</th>
                </tr>
                </thead>
                <tbody>
                @foreach ($porGrupo as $g)
                    <tr>
                        <td><strong>{{ $g['grupo'] }}</strong></td>
                        <td class="num">{{ $g['clientas'] }}</td>
                        <td class="num">{{ \App\Support\Dinero::pesos($g['esperado']) }}</td>
                        <td class="num">{{ \App\Support\Dinero::pesos($g['cobrado']) }}</td>
                        <td class="num {{ $g['esperado'] - $g['cobrado'] > 0 ? '' : 'apagado' }}">
                            {{ \App\Support\Dinero::pesos(max(0, $g['esperado'] - $g['cobrado'])) }}
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    @endif
@endsection
