@extends('base')
@section('titulo', 'Renovar crédito')

@php
    use App\Support\Dinero;
    use App\Support\Fechas;
@endphp

@section('contenido')
    <nav class="migas">
        <a href="{{ route('creditos') }}">Créditos</a>
        <span aria-hidden="true">/</span>
        <a href="{{ route('creditos.ficha', $credito) }}">Folio {{ $credito->folioFormateado() }}</a>
        <span aria-hidden="true">/</span>
        <span class="actual">Renovar</span>
    </nav>

    <div class="titulo">
        <h1>Renovar crédito</h1>
        <p>{{ $credito->cliente->nombre }} · el crédito {{ $credito->folioFormateado() }} se liquidará y arrancará uno nuevo en la semana 1.</p>
    </div>

    <section class="tarjeta" style="margin-bottom:1.5rem;">
        <header><h2>Crédito actual</h2></header>
        <div class="relleno rejilla rejilla-3">
            <div class="dato"><dt>Total</dt><dd>{{ Dinero::pesos($credito->monto_total) }}</dd></div>
            <div class="dato"><dt>Saldo pendiente que se liquida</dt>
                <dd style="font-weight:700; color:var(--patrimonio);">{{ Dinero::pesos($saldo) }}</dd></div>
            <div class="dato"><dt>Estado</dt><dd><span class="insignia e-{{ $credito->estado }}">{{ $credito->estado }}</span></dd></div>
        </div>
    </section>

    <section class="tarjeta" style="margin-bottom:1.5rem;">
        <header><h2>Nuevo crédito</h2></header>
        <form method="POST" action="{{ route('creditos.renovar.guardar', $credito) }}" class="relleno">
            @csrf
            <div class="rejilla rejilla-2">
                <div class="grupo-campo">
                    <label class="etiqueta-campo" for="monto_prestado">Monto prestado *</label>
                    <input type="text" id="monto_prestado" name="monto_prestado" required inputmode="decimal"
                           placeholder="3000" value="{{ old('monto_prestado', $datos['monto_prestado'] ?? '') }}">
                </div>
                <div class="grupo-campo">
                    <label class="etiqueta-campo" for="monto_total">Total a pagar *</label>
                    <input type="text" id="monto_total" name="monto_total" required inputmode="decimal"
                           placeholder="3600" value="{{ old('monto_total', $datos['monto_total'] ?? '') }}">
                </div>
                <div class="grupo-campo">
                    <label class="etiqueta-campo" for="fecha_entrega">Lunes de entrega *</label>
                    <input type="date" id="fecha_entrega" name="fecha_entrega" required
                           value="{{ old('fecha_entrega', $datos['fecha_entrega'] ?? '') }}">
                </div>
                <div class="grupo-campo">
                    <label class="etiqueta-campo" for="num_semanas">Semanas *</label>
                    <input type="number" id="num_semanas" name="num_semanas" required min="1" max="104"
                           value="{{ old('num_semanas', $datos['num_semanas'] ?? env('UM_SEMANAS', 12)) }}">
                </div>
            </div>
            <div class="grupo-campo">
                <label class="etiqueta-campo" for="notas">Notas</label>
                <textarea id="notas" name="notas" rows="2">{{ old('notas', $datos['notas'] ?? '') }}</textarea>
            </div>
            <button type="submit" class="btn-secundario">Ver el calendario del nuevo crédito</button>
        </form>
    </section>

    @if ($calendario)
        <section class="tarjeta" style="margin-bottom:1.5rem; border-color:var(--salvia);">
            <header><h2>Resumen de la renovación</h2></header>
            <div class="relleno">
                <div class="rejilla rejilla-3">
                    <div class="dato"><dt>Pago en el que va</dt><dd>{{ $credito->semanaActual() }} de {{ $credito->num_semanas }}</dd></div>
                    <div class="dato"><dt>Saldo del préstamo anterior</dt><dd>{{ Dinero::pesos($saldo) }}</dd></div>
                    <div class="dato"><dt>Monto del nuevo préstamo</dt><dd>{{ Dinero::pesos(App\Support\Dinero::aCentavos($datos['monto_prestado'])) }}</dd></div>
                    <div class="dato"><dt>Se descuenta para liquidar</dt><dd style="color:var(--riesgo);">− {{ Dinero::pesos($descuento) }}</dd></div>
                    <div class="dato"><dt>Neto que recibe la clienta</dt><dd style="font-weight:700; color:var(--patrimonio); font-size:1.1rem;">{{ Dinero::pesos($neto) }}</dd></div>
                    <div class="dato"><dt>Entrega de la renovación</dt><dd>{{ ucfirst(Fechas::larga($entrega)) }}</dd></div>
                    <div class="dato"><dt>Primer abono nuevo</dt><dd>{{ ucfirst(Fechas::larga($calendario[0]['fecha'])) }}</dd></div>
                </div>
            </div>
        </section>

        <section class="tarjeta" style="margin-bottom:1.5rem;">
            <header>
                <h2>Calendario del nuevo crédito</h2>
                <span class="apagado" style="font-size:.75rem;">
                    Vence el {{ Fechas::larga($calendario[count($calendario) - 1]['fecha']) }}
                </span>
            </header>
            <div class="tabla-envoltura">
                <table class="tabla">
                    <thead><tr><th class="num">Semana</th><th>Sábado</th><th class="num">Abono</th></tr></thead>
                    <tbody>
                    @foreach ($calendario as $i => $fila)
                        <tr>
                            <td class="num">{{ $fila['semana'] }}</td>
                            <td>{{ ucfirst(Fechas::larga($fila['fecha'])) }}</td>
                            <td class="num">{{ Dinero::pesos($montos[$i]) }}</td>
                        </tr>
                    @endforeach
                    <tr style="background:var(--marfil); font-weight:700;">
                        <td colspan="2">Total</td>
                        <td class="num">{{ Dinero::pesos(array_sum($montos)) }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="tarjeta">
            <div class="relleno">
                <p style="margin-top:0;">Al confirmar, el crédito {{ $credito->folioFormateado() }} queda
                    <strong>liquidado por renovación</strong> (con su historial intacto) y arranca el nuevo.</p>
                <form method="POST" action="{{ route('creditos.renovar.guardar', $credito) }}">
                    @csrf
                    <input type="hidden" name="confirmar" value="1">
                    @foreach (['monto_prestado', 'monto_total', 'num_semanas', 'fecha_entrega', 'notas'] as $campo)
                        <input type="hidden" name="{{ $campo }}" value="{{ $datos[$campo] ?? '' }}">
                    @endforeach
                    <button type="submit" class="btn">Confirmar renovación</button>
                </form>
            </div>
        </section>
    @endif
@endsection
