@extends('base')
@section('titulo', 'Entregas')

@php
    use App\Support\Dinero;
    use App\Support\Fechas;
@endphp

@section('contenido')
    <div class="titulo">
        <h1>Entregas de la semana</h1>
        <p>Sábado de cobro: {{ ucfirst(Fechas::larga($fecha)) }}. «Debe entregar» lo calcula el sistema; tú solo capturas préstamo, entregó, faltaron y adelantaron.</p>
    </div>

    <div class="tarjeta relleno no-imprimir"
         style="display:flex; gap:.75rem; align-items:end; flex-wrap:wrap; margin-bottom:1.5rem;">
        <form method="GET" style="display:flex; gap:.75rem; align-items:end;">
            <div>
                <label class="etiqueta-campo" for="fecha">Ver otro sábado</label>
                <input type="date" id="fecha" name="fecha" value="{{ $fecha->format('Y-m-d') }}">
            </div>
            <button type="submit" class="btn-secundario">Ver</button>
        </form>
        <a href="{{ route('entregas.pdf', ['fecha' => $fecha->format('Y-m-d')]) }}" target="_blank" class="btn">
            Descargar hoja (PDF)
        </a>
    </div>

    @if ($filas->isEmpty())
        <div class="tarjeta"><div class="vacio"><p>No tienes grupos asignados. Pídele al admin que te asigne uno.</p></div></div>
    @endif

    @foreach ($filas as $fila)
        @php $g = $fila['grupo']; $e = $fila['entrega']; $cerrada = $e->exists && $e->estaCerrada(); @endphp
        <section class="tarjeta" style="margin-bottom:1.5rem;">
            <header>
                <h2>{{ $g->nombre }} <span class="apagado" style="font-size:.8125rem;">{{ $g->codigoFormateado() }}</span></h2>
                <span class="insignia {{ $cerrada ? 'insignia-tinta' : 'insignia-verde' }}">
                    {{ $cerrada ? 'CERRADA' : 'ABIERTA' }}
                </span>
            </header>

            {{-- Tarjetón: las mismas columnas de la hoja física. --}}
            <div class="tabla-envoltura">
                <table class="tabla">
                    <thead>
                    <tr>
                        <th>Fecha</th>
                        <th class="num">Préstamo</th>
                        <th class="num">Debe entregar</th>
                        <th class="num">Entregó</th>
                        <th class="num">Faltaron</th>
                        <th class="num">Adelantado</th>
                        <th class="num">Saldo</th>
                        <th class="num">Comisión</th>
                        <th>Firma encargada</th>
                        <th>Firma encargado</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{{ $fecha->format('d/m/Y') }}</td>
                        <td class="num">{{ Dinero::pesos($e->prestamo ?? 0) }}</td>
                        <td class="num" style="font-weight:700; color:var(--patrimonio);">{{ Dinero::pesos($e->debe_entregar) }}</td>
                        <td class="num">{{ Dinero::pesos($e->entrego ?? 0) }}</td>
                        <td class="num {{ ($e->faltante ?? 0) > 0 ? 'valor-rojo' : '' }}">{{ Dinero::pesos($e->faltante ?? 0) }}</td>
                        <td class="num">{{ Dinero::pesos($e->adelantado ?? 0) }}</td>
                        <td class="num">{{ ($e->saldo ?? 0) >= 0 ? '+' : '−' }}{{ Dinero::pesos(abs($e->saldo ?? 0)) }}</td>
                        <td class="num">{{ Dinero::pesos($e->comision ?? 0) }}</td>
                        {{-- Firma = identificación digital de quién manipuló el renglón --}}
                        <td style="font-size:.75rem;">
                            <strong>{{ $g->encargada->nombre ?? '—' }}</strong>
                            <div class="apagado" style="font-size:.6875rem;">encargada del grupo</div>
                        </td>
                        <td style="font-size:.75rem;">
                            @if ($e->exists && $e->cerradoPor)
                                <strong>{{ $e->cerradoPor->nombre }}</strong>
                                <div class="apagado" style="font-size:.6875rem;">cerró · {{ $e->cerrado_en?->format('d/m/y H:i') }}</div>
                            @elseif ($e->exists && $e->capturadoPor)
                                <strong>{{ $e->capturadoPor->nombre }}</strong>
                                <div class="apagado" style="font-size:.6875rem;">capturó · {{ $e->updated_at?->format('d/m/y H:i') }}</div>
                            @else
                                <span class="apagado">sin capturar</span>
                            @endif
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {{-- Captura del supervisor: solo estos cuatro campos + qué clientas. --}}
            @if ($puedeCapturar && ! $cerrada)
                <div class="relleno" style="border-top:1px solid var(--niebla);">
                    <form method="POST" action="{{ route('entregas.capturar', $g) }}" class="no-imprimir">
                        @csrf
                        <input type="hidden" name="fecha" value="{{ $fecha->format('Y-m-d') }}">
                        <div class="rejilla rejilla-4">
                            <div class="grupo-campo">
                                <label class="etiqueta-campo">Préstamos</label>
                                <input type="text" name="prestamo" inputmode="decimal"
                                       value="{{ $e->prestamo ? Dinero::compacto($e->prestamo) : '' }}" placeholder="0">
                            </div>
                            <div class="grupo-campo">
                                <label class="etiqueta-campo">Entregó</label>
                                <input type="text" name="entrego" inputmode="decimal"
                                       value="{{ $e->entrego ? Dinero::compacto($e->entrego) : '' }}" placeholder="0">
                            </div>
                            <div class="grupo-campo">
                                <label class="etiqueta-campo">Faltaron</label>
                                <input type="text" name="faltante" inputmode="decimal"
                                       value="{{ $e->faltante ? Dinero::compacto($e->faltante) : '' }}" placeholder="0">
                            </div>
                            <div class="grupo-campo">
                                <label class="etiqueta-campo">Adelantaron</label>
                                <input type="text" name="adelantado" inputmode="decimal"
                                       value="{{ $e->adelantado ? Dinero::compacto($e->adelantado) : '' }}" placeholder="0">
                            </div>
                        </div>
                        <div class="grupo-campo">
                            <label class="etiqueta-campo">¿Qué clientas faltaron o se adelantaron?</label>
                            <input type="text" name="notas" value="{{ $e->notas }}"
                                   placeholder="Ej.: faltó Susana; adelantó Claudia">
                        </div>
                        <button type="submit" class="btn">Guardar entrega</button>
                    </form>
                </div>
            @elseif ($e->notas)
                <div class="relleno" style="border-top:1px solid var(--niebla);">
                    <div class="dato"><dt>Clientas (faltaron / adelantaron)</dt><dd>{{ $e->notas }}</dd></div>
                </div>
            @endif

            {{-- Tablita de clientas del sábado: nombre, semana y pago. --}}
            @if ($fila['clientas']->isNotEmpty())
                <details class="relleno no-imprimir" style="border-top:1px solid var(--niebla);">
                    <summary style="cursor:pointer; font-size:.8125rem; color:var(--patrimonio);">
                        Ver las {{ $fila['clientas']->count() }} clientas de este sábado
                    </summary>
                    <div class="tabla-envoltura" style="margin-top:.75rem;">
                        <table class="tabla">
                            <thead><tr><th>Clienta</th><th class="num">Semana</th><th class="num">Pago</th></tr></thead>
                            <tbody>
                            @foreach ($fila['clientas'] as $a)
                                <tr>
                                    <td>{{ $a->credito->cliente->nombre }}</td>
                                    <td class="num">{{ $a->semana }} / {{ $a->credito->num_semanas }}</td>
                                    <td class="num">{{ Dinero::pesos($a->monto_esperado) }}</td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </details>
            @endif

            @if ($cerrada)
                <div class="relleno" style="border-top:1px solid var(--niebla);">
                    <p class="apagado" style="font-size:.8125rem; margin:0;">
                        Cerrada por {{ $e->cerradoPor->nombre ?? '—' }} el {{ $e->cerrado_en?->format('d/m/Y H:i') }}.
                    </p>
                </div>
            @endif

            @if ($puedeCerrar && $e->exists)
                <div class="relleno no-imprimir" style="border-top:1px solid var(--niebla); display:flex; gap:.75rem;">
                    @if (! $cerrada)
                        <form method="POST" action="{{ route('entregas.cerrar', $e) }}"
                              onsubmit="return confirm('¿Cerrar la semana de {{ $g->nombre }}? Después solo el admin podrá modificarla.')">
                            @csrf
                            <button type="submit" class="btn">Cerrar semana</button>
                        </form>
                    @else
                        <form method="POST" action="{{ route('entregas.reabrir', $e) }}"
                              onsubmit="return confirm('¿Reabrir esta semana ya cerrada?')">
                            @csrf
                            <button type="submit" class="btn-peligro">Reabrir semana</button>
                        </form>
                    @endif
                </div>
            @endif
        </section>
    @endforeach
@endsection
