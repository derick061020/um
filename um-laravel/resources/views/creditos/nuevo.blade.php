@extends('base')
@section('titulo', 'Nuevo crédito')

@section('contenido')
    <h1>Nuevo crédito</h1>
    <p class="sub">Se captura solo el lunes de entrega: el sistema arma los sábados de abono.</p>

    @if (! empty($avisoFecha))
        <div class="aviso aviso-ojo">{{ $avisoFecha }}</div>
    @endif

    <form method="POST" action="{{ route('creditos.calendario') }}" class="tarjeta">
        @csrf

        <div class="rejilla rejilla-2">
            <div class="campo">
                <label for="cliente_id">Clienta *</label>
                <select id="cliente_id" name="cliente_id" required>
                    <option value="">Elige una clienta…</option>
                    @foreach ($clientas as $c)
                        <option value="{{ $c->id }}" @selected(old('cliente_id', $clientaId) == $c->id)>
                            {{ str_pad($c->folio, 4, '0', STR_PAD_LEFT) }} — {{ $c->nombre }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div class="campo">
                <label for="grupo_id">Grupo</label>
                <select id="grupo_id" name="grupo_id">
                    <option value="">El de la clienta</option>
                    @foreach ($grupos as $g)
                        <option value="{{ $g->id }}" @selected(old('grupo_id', $datos['grupo_id'] ?? null) == $g->id)>
                            {{ $g->nombre }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div class="campo">
                <label for="monto_prestado">Monto prestado *</label>
                <input type="text" id="monto_prestado" name="monto_prestado" required inputmode="decimal"
                       placeholder="3000" value="{{ old('monto_prestado', $datos['monto_prestado'] ?? '') }}">
            </div>

            <div class="campo">
                <label for="monto_total">Total a pagar *</label>
                <input type="text" id="monto_total" name="monto_total" required inputmode="decimal"
                       placeholder="3600" value="{{ old('monto_total', $datos['monto_total'] ?? '') }}">
                <div class="pista">Capital más interés: lo que la clienta termina pagando.</div>
            </div>

            <div class="campo">
                <label for="fecha_entrega">Lunes de entrega *</label>
                <input type="date" id="fecha_entrega" name="fecha_entrega" required
                       value="{{ old('fecha_entrega', $datos['fecha_entrega'] ?? '') }}">
            </div>

            <div class="campo">
                <label for="num_semanas">Semanas *</label>
                <input type="number" id="num_semanas" name="num_semanas" required min="1" max="104"
                       value="{{ old('num_semanas', $datos['num_semanas'] ?? env('UM_SEMANAS', 12)) }}">
            </div>
        </div>

        <div class="campo">
            <label for="notas">Notas</label>
            <textarea id="notas" name="notas" rows="2">{{ old('notas', $datos['notas'] ?? '') }}</textarea>
        </div>

        <button type="submit" class="btn btn-secundario">Ver el calendario antes de guardar</button>
    </form>

    {{-- El calendario se muestra SIEMPRE antes de guardar, para confirmar las
         fechas con la clienta enfrente. --}}
    @if ($calendario)
        <h2>Calendario de abonos</h2>
        <p class="sub">
            Entrega el {{ \App\Support\Fechas::larga($entrega) }} ·
            Vence el {{ \App\Support\Fechas::larga($calendario[count($calendario) - 1]['fecha']) }}
        </p>

        <div class="tabla-envoltura tarjeta" style="padding:0;">
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
                        <td>{{ \App\Support\Fechas::larga($fila['fecha']) }}</td>
                        <td class="num">{{ \App\Support\Dinero::pesos($montos[$i]) }}</td>
                    </tr>
                @endforeach
                <tr style="background:var(--niebla); font-weight:700;">
                    <td colspan="2">Total</td>
                    <td class="num">{{ \App\Support\Dinero::pesos(array_sum($montos)) }}</td>
                </tr>
                </tbody>
            </table>
        </div>

        <form method="POST" action="{{ route('creditos.guardar') }}" class="tarjeta">
            @csrf
            @foreach (['cliente_id', 'grupo_id', 'monto_prestado', 'monto_total', 'num_semanas', 'fecha_entrega', 'notas'] as $campo)
                <input type="hidden" name="{{ $campo }}" value="{{ $datos[$campo] ?? '' }}">
            @endforeach

            <p style="margin-top:0;">Revisa las fechas con la clienta antes de confirmar.</p>
            <button type="submit" class="btn">Confirmar y guardar el crédito</button>
        </form>
    @endif
@endsection
