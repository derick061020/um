@extends('base')
@section('titulo', 'Mis clientas')

@php
    use App\Support\Dinero;
    use App\Support\Fechas;
@endphp

@section('contenido')
    <div class="titulo">
        <h1>Mis clientas</h1>
        <p>{{ ucfirst(Fechas::larga($fecha)) }}</p>
    </div>

    <section class="tarjeta" style="text-align:center; padding:2rem 1.5rem; margin-bottom:1.5rem;">
        <p class="dato-etiqueta">Total a entregar hoy</p>
        <p style="margin:.5rem 0 0; font-family:var(--display); font-size:3rem; line-height:1.1;
                  color:var(--patrimonio); font-variant-numeric:tabular-nums;">
            {{ Dinero::pesos($totalGeneral) }}
        </p>
    </section>

    <form method="GET" class="tarjeta relleno no-imprimir"
          style="display:flex; gap:.75rem; align-items:end; flex-wrap:wrap; margin-bottom:1.5rem;">
        <div>
            <label class="etiqueta-campo" for="fecha">Ver otro sábado</label>
            <input type="date" id="fecha" name="fecha" value="{{ $fecha->format('Y-m-d') }}">
        </div>
        <button type="submit" class="btn-secundario">Ver</button>
        <a href="{{ route('consulta') }}" class="btn-fantasma">Buscar una clienta</a>
    </form>

    @if ($porGrupo->isEmpty())
        <div class="tarjeta"><div class="vacio"><p>No hay abonos programados para este sábado en tus grupos.</p></div></div>
    @endif

    @foreach ($porGrupo as $bloque)
        <section class="tarjeta" style="margin-bottom:1.5rem;">
            <header>
                <h2>{{ $bloque['grupo']->nombre }}</h2>
                <span class="apagado" style="font-size:.8125rem;">Total: {{ Dinero::pesos($bloque['total']) }}</span>
            </header>
            <div class="tabla-envoltura">
                <table class="tabla">
                    <thead>
                    <tr>
                        <th>Clienta</th>
                        <th class="num">Se le entregó</th>
                        <th class="num">Abono</th>
                        <th class="num">Semana</th>
                        <th class="num">Falta por pagar</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($bloque['abonos'] as $a)
                        @php $falta = max(0, $a->credito->monto_total - (int) $a->credito->pagado); @endphp
                        <tr>
                            <td style="font-weight:500;">{{ $a->credito->cliente->nombre }}</td>
                            <td class="num">{{ Dinero::pesos($a->credito->monto_prestado) }}</td>
                            <td class="num">{{ Dinero::pesos($a->monto_esperado) }}</td>
                            <td class="num">{{ $a->semana }} / {{ $a->credito->num_semanas }}</td>
                            <td class="num {{ $falta > 0 ? '' : 'apagado' }}">{{ Dinero::pesos($falta) }}</td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        </section>
    @endforeach
@endsection
