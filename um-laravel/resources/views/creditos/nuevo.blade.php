@extends('base')
@section('titulo', 'Nuevo crédito')

@php
    use App\Support\Dinero;
    use App\Support\Fechas;
@endphp

@section('contenido')
    <nav class="migas">
        <a href="{{ route('creditos') }}">Créditos</a>
        <span aria-hidden="true">/</span>
        <span class="actual">Nuevo</span>
    </nav>

    <div class="titulo">
        <h1>Nuevo crédito</h1>
        <p>Se captura solo el lunes de entrega: el sistema arma los sábados de abono y te los muestra antes de guardar.</p>
    </div>

    @if (! empty($avisoFecha))
        <div class="aviso aviso-ojo">{{ $avisoFecha }}</div>
    @endif

    <section class="tarjeta" style="margin-bottom:1.5rem;">
        <header><h2>Datos del crédito</h2></header>
        <form method="POST" action="{{ route('creditos.calendario') }}" class="relleno">
            @csrf

            <div class="rejilla rejilla-2">
                <div class="grupo-campo">
                    <label class="etiqueta-campo" for="cliente_id">Clienta *</label>
                    <select id="cliente_id" name="cliente_id" required>
                        <option value="">Elige una clienta…</option>
                        @foreach ($clientas as $c)
                            <option value="{{ $c->id }}" @selected(old('cliente_id', $clientaId) == $c->id)>
                                {{ str_pad($c->folio, 4, '0', STR_PAD_LEFT) }} — {{ $c->nombre }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="grupo-campo">
                    <label class="etiqueta-campo" for="grupo_id">Grupo</label>
                    <select id="grupo_id" name="grupo_id">
                        <option value="">El de la clienta</option>
                        @foreach ($grupos as $g)
                            <option value="{{ $g->id }}" @selected(old('grupo_id', $datos['grupo_id'] ?? null) == $g->id)>
                                {{ $g->nombre }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="grupo-campo">
                    <label class="etiqueta-campo" for="monto_prestado">Monto prestado *</label>
                    <input type="text" id="monto_prestado" name="monto_prestado" required inputmode="decimal"
                           placeholder="3000" value="{{ old('monto_prestado', $datos['monto_prestado'] ?? '') }}">
                </div>

                <div class="grupo-campo">
                    <label class="etiqueta-campo" for="monto_total">Total a pagar *</label>
                    <input type="text" id="monto_total" name="monto_total" required inputmode="decimal"
                           placeholder="3600" value="{{ old('monto_total', $datos['monto_total'] ?? '') }}">
                    <p class="ayuda">Capital más interés: lo que la clienta termina pagando.</p>
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

            <button type="submit" class="btn-secundario">Ver el calendario antes de guardar</button>
        </form>
    </section>

    {{-- El calendario se muestra SIEMPRE antes de guardar, para confirmar las
         fechas con la clienta enfrente. --}}
    @if ($calendario)
        <section class="tarjeta" style="margin-bottom:1.5rem;">
            <header>
                <h2>Calendario de abonos</h2>
                <span class="apagado" style="font-size:.75rem;">
                    Vence el {{ Fechas::larga($calendario[count($calendario) - 1]['fecha']) }}
                </span>
            </header>

            <div class="tabla-envoltura">
                <table class="tabla">
                    <thead>
                    <tr>
                        <th class="num">Semana</th>
                        <th>Sábado</th>
                        <th class="num">Abono</th>
                    </tr>
                    </thead>
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
                <p style="margin-top:0;">Revisa las fechas con la clienta antes de confirmar.</p>
                <form method="POST" action="{{ route('creditos.guardar') }}">
                    @csrf
                    @foreach (['cliente_id', 'grupo_id', 'monto_prestado', 'monto_total', 'num_semanas', 'fecha_entrega', 'notas'] as $campo)
                        <input type="hidden" name="{{ $campo }}" value="{{ $datos[$campo] ?? '' }}">
                    @endforeach
                    <button type="submit" class="btn">Confirmar y guardar el crédito</button>
                </form>
            </div>
        </section>
    @endif
@endsection
