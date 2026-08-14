@extends('base')
@section('titulo', 'Cobro del día')

@php
    use App\Support\Dinero;
    use App\Support\Fechas;
@endphp

@section('contenido')
    <div class="titulo">
        <h1>Cobro del día</h1>
        <p>{{ ucfirst(Fechas::larga($fecha)) }}</p>
    </div>

    {{-- Pantalla única de la ENCARGADA: el total y nada más. Sin nombres,
         sin domicilios y sin importes por clienta. --}}
    <section class="tarjeta" style="text-align:center; padding:2.5rem 1.5rem; margin-bottom:1.5rem;">
        <p class="dato-etiqueta">Total a cobrar hoy</p>
        <p style="margin:.5rem 0 0; font-family:var(--display); font-size:3.5rem; line-height:1.1;
                  color:var(--patrimonio); font-variant-numeric:tabular-nums;">
            {{ Dinero::pesos($esperado) }}
        </p>
        <p class="nota apagado" style="margin-top:.5rem; font-size:.875rem;">
            {{ $clientas }} {{ $clientas === 1 ? 'clienta' : 'clientas' }} en la lista
        </p>
    </section>

    <div class="rejilla rejilla-3" style="margin-bottom:1.5rem;">
        <div class="indicador">
            <p class="etiqueta">Cobrado</p>
            <p class="valor valor-verde">{{ Dinero::pesos($cobrado) }}</p>
            <p class="nota">{{ $pagados }} de {{ $clientas }} pagados</p>
        </div>

        <div class="indicador">
            <p class="etiqueta">Falta por cobrar</p>
            <p class="valor {{ $faltante > 0 ? 'valor-rojo' : '' }}">{{ Dinero::pesos($faltante) }}</p>
        </div>

        <div class="indicador">
            <p class="etiqueta">Avance</p>
            <p class="valor">{{ $esperado > 0 ? round($cobrado * 100 / $esperado) : 0 }}%</p>
        </div>
    </div>

    <form method="GET" class="tarjeta relleno no-imprimir"
          style="display:flex; gap:.75rem; align-items:end; max-width:26rem; margin-bottom:1.5rem;">
        <div style="flex:1;">
            <label class="etiqueta-campo" for="fecha">Ver otro día</label>
            <input type="date" id="fecha" name="fecha" value="{{ $fecha->format('Y-m-d') }}">
        </div>
        <button type="submit" class="btn-secundario">Ver</button>
    </form>

    @if ($verDesglose && $porGrupo->isNotEmpty())
        <section class="tarjeta">
            <header><h2>Desglose por grupo</h2></header>
            <div class="tabla-envoltura">
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
                            <td class="num">{{ Dinero::pesos($g['esperado']) }}</td>
                            <td class="num">{{ Dinero::pesos($g['cobrado']) }}</td>
                            <td class="num {{ $g['esperado'] - $g['cobrado'] > 0 ? '' : 'apagado' }}">
                                {{ Dinero::pesos(max(0, $g['esperado'] - $g['cobrado'])) }}
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        </section>
    @endif
@endsection
