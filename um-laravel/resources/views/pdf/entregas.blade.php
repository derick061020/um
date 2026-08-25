{{-- Hoja de entregas de la semana, con las mismas columnas del tarjetón físico.
     Las firmas son la identificación digital de quién capturó y quién cerró. --}}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <style>
        @page { margin: 24px; }
        body { font-family: "DejaVu Sans", sans-serif; color: #252a27; margin: 0; font-size: 10px; }

        .encabezado { width: 100%; border-bottom: 1.5px solid #2f6b50; padding-bottom: 6px; margin-bottom: 10px; }
        .encabezado td { vertical-align: middle; }
        .logo { height: 42px; }
        .institucion { font-size: 15px; font-weight: bold; color: #16402e; letter-spacing: 1px; }
        .rotulo { font-size: 8px; color: #2f6b50; letter-spacing: 2px; text-align: right; }
        .subtitulo { font-size: 11px; color: #2f6b50; margin: 2px 0 0; }

        table.hoja { width: 100%; border-collapse: collapse; }
        table.hoja th {
            background: #16402e; color: #fff; font-size: 8px; font-weight: normal;
            padding: 6px 3px; border: 0.5px solid #2f6b50; text-transform: uppercase; letter-spacing: .5px;
        }
        table.hoja td { border: 0.5px solid #afc7b9; padding: 6px 4px; vertical-align: top; }
        .grupo { font-weight: bold; color: #16402e; }
        .num { text-align: right; font-variant-numeric: tabular-nums; }
        .debe { font-weight: bold; color: #16402e; }
        .rojo { color: #9c2f2f; }
        .firma { font-size: 8px; }
        .firma .quien { font-weight: bold; }
        .firma .sello { color: #2f6b50; }
        .apagado { color: #7b8781; }

        .pie { margin-top: 14px; font-size: 8px; color: #2f6b50; }
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
                <td class="grupo">{{ $g->nombre }}<br><span class="apagado" style="font-weight:normal;">{{ $g->codigoFormateado() }}</span></td>
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
