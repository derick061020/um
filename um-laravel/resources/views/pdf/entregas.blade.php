{{-- Hoja de entregas de la semana, con las mismas columnas del tarjetón físico.
     Las firmas son la identificación digital de quién capturó y quién cerró. --}}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <style>
        @page { margin: 40px 38px; }
        body { font-family: "DejaVu Sans", sans-serif; color: #252a27; margin: 0; font-size: 10px; line-height: 1.45; }

        .encabezado { width: 100%; border-bottom: 1.5px solid #2f6b50; padding-bottom: 12px; margin-bottom: 8px; }
        .encabezado td { vertical-align: middle; }
        .logo { height: 46px; }
        .institucion { font-size: 16px; font-weight: bold; color: #16402e; letter-spacing: 1px; }
        .rotulo { font-size: 8.5px; color: #2f6b50; letter-spacing: 2.5px; text-align: right; }
        .subtitulo { font-size: 11px; color: #2f6b50; margin: 0 0 22px; }

        table.hoja { width: 100%; border-collapse: separate; border-spacing: 0; }
        table.hoja th {
            background: #16402e; color: #fff; font-size: 8px; font-weight: normal;
            padding: 10px 6px; border-right: 0.5px solid #3a6b53; text-transform: uppercase; letter-spacing: .6px;
        }
        table.hoja th:last-child { border-right: 0; }
        table.hoja td { border-bottom: 0.5px solid #dbe4de; padding: 12px 7px; vertical-align: top; }
        table.hoja tbody tr:nth-child(even) td { background: #f6f9f7; }
        .grupo { font-weight: bold; color: #16402e; }
        .grupo .cod { font-weight: normal; color: #7b8781; font-size: 8px; }
        .num { text-align: right; font-variant-numeric: tabular-nums; }
        .debe { font-weight: bold; color: #16402e; }
        .rojo { color: #9c2f2f; }
        .firma { font-size: 8px; line-height: 1.5; }
        .firma .quien { font-weight: bold; }
        .firma .sello { color: #2f6b50; }
        .apagado { color: #7b8781; }

        .pie { margin-top: 26px; font-size: 8px; color: #2f6b50; line-height: 1.7;
               border-top: 0.5px solid #dbe4de; padding-top: 12px; }
        .pie strong { color: #16402e; }
    </style>
</head>
<body>
    @php $logo = \App\Support\Marca::logoDataUri(); @endphp
    <table class="encabezado">
        <tr>
            <td>
                @if ($logo)
                    <img src="{{ $logo }}" class="logo" alt="{{ $institucion }}">
                @else
                    <span class="institucion">{{ $institucion }}</span>
                @endif
            </td>
            <td class="rotulo">HOJA DE ENTREGAS SEMANALES</td>
        </tr>
    </table>
    <p class="subtitulo">Sábado de cobro: {{ \App\Support\Fechas::larga($fecha) }}</p>

    <table class="hoja">
        <thead>
        <tr>
            <th style="text-align:left;">Grupo</th>
            <th>Fecha</th>
            <th>Préstamo</th>
            <th>Debe entregar</th>
            <th>Entregó</th>
            <th>Faltaron</th>
            <th>Adelantado</th>
            <th>Saldo</th>
            <th>Comisión</th>
            <th>Firma encargada</th>
            <th>Firma encargado</th>
        </tr>
        </thead>
        <tbody>
        @forelse ($filas as $f)
            @php $g = $f['grupo']; $e = $f['entrega']; @endphp
            <tr>
                <td class="grupo">{{ $g->nombre }}<br><span class="cod">{{ $g->codigoFormateado() }}</span></td>
                <td>{{ $fecha->format('d/m/y') }}</td>
                <td class="num">{{ \App\Support\Dinero::pesos($e->prestamo ?? 0) }}</td>
                <td class="num debe">{{ \App\Support\Dinero::pesos($f['debe']) }}</td>
                <td class="num">{{ \App\Support\Dinero::pesos($e->entrego ?? 0) }}</td>
                <td class="num {{ ($e->faltante ?? 0) > 0 ? 'rojo' : '' }}">{{ \App\Support\Dinero::pesos($e->faltante ?? 0) }}</td>
                <td class="num">{{ \App\Support\Dinero::pesos($e->adelantado ?? 0) }}</td>
                <td class="num">{{ $e ? (($e->saldo >= 0 ? '+' : '−').\App\Support\Dinero::pesos(abs($e->saldo))) : '—' }}</td>
                <td class="num">{{ \App\Support\Dinero::pesos($e->comision ?? 0) }}</td>
                {{-- Firma = identificación digital, no manuscrita --}}
                <td class="firma">
                    <span class="quien">{{ $g->encargada->nombre ?? '—' }}</span>
                    <br><span class="sello">encargada del grupo</span>
                </td>
                <td class="firma">
                    @if ($e && $e->cerradoPor)
                        <span class="quien">{{ $e->cerradoPor->nombre }}</span>
                        <br><span class="sello">cerró · {{ $e->cerrado_en?->format('d/m/y H:i') }}</span>
                    @elseif ($e && $e->capturadoPor)
                        <span class="quien">{{ $e->capturadoPor->nombre }}</span>
                        <br><span class="sello">capturó · {{ $e->updated_at?->format('d/m/y H:i') }}</span>
                    @else
                        <span class="apagado">sin capturar</span>
                    @endif
                </td>
            </tr>
        @empty
            <tr><td colspan="11" class="apagado" style="text-align:center; padding:16px;">No hay grupos para mostrar.</td></tr>
        @endforelse
        </tbody>
    </table>

    <p class="pie">
        Las firmas son la <strong>identificación digital</strong> del usuario que capturó o cerró cada renglón, no una firma manuscrita.<br>
        Hoja descargada por <strong>{{ $descargadoPor->nombre }}</strong> ({{ $descargadoPor->usuario }}) el {{ $generadoEn->format('d/m/Y H:i') }}.
    </p>
</body>
</html>
