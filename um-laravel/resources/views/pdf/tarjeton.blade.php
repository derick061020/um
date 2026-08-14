{{-- Tarjetón de control: una tarjeta por hoja, apaisada, con la rejilla de
     abonos lo bastante ancha como para anotar a mano en ventanilla. --}}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <style>
        @page { margin: 26px; }

        body {
            font-family: "DejaVu Sans", sans-serif;
            color: #252a27;             /* tinta */
            margin: 0;
        }

        /* dompdf no aplica bien :last-child, así que el salto se pone ANTES
           de cada tarjeta salvo la primera: así no queda una hoja en blanco
           al final. */
        .tarjeta {
            border: 2px solid #16402e;  /* patrimonio */
            padding: 12px 14px;
        }
        .salto { page-break-before: always; }

        .encabezado { width: 100%; border-bottom: 1.5px solid #2f6b50; padding-bottom: 8px; }
        .institucion { font-size: 15px; font-weight: bold; color: #16402e; letter-spacing: 1px; }
        .rotulo { font-size: 8px; color: #2f6b50; letter-spacing: 2px; text-align: right; }

        .nombre-fila { margin-top: 14px; }
        .etiqueta { font-size: 7.5px; color: #2f6b50; letter-spacing: 1.5px; }
        .nombre { font-size: 17px; font-weight: bold; border-bottom: 1px solid #afc7b9; padding-bottom: 4px; }
        .folio { font-size: 10px; color: #2f6b50; text-align: right; }

        table.rejilla { width: 100%; border-collapse: collapse; margin-top: 16px; table-layout: fixed; }

        table.rejilla th {
            background: #16402e;
            color: #ffffff;
            font-size: 7.5px;
            padding: 5px 1px;
            border: 0.5px solid #2f6b50;
            font-weight: normal;
        }

        table.rejilla td {
            border: 0.5px solid #afc7b9;
            text-align: center;
            vertical-align: top;
        }

        .semana { font-size: 7px; color: #2f6b50; background: #e8ecea; padding: 2px 0; }
        .importe { font-size: 9px; font-weight: bold; padding: 4px 0 2px; }
        .firma { height: 52px; }         /* espacio para anotar a mano */

        .pie { margin-top: 12px; font-size: 7.5px; color: #2f6b50; }
    </style>
</head>
<body>
@foreach ($tarjetas as $t)
    <div class="tarjeta @unless ($loop->first) salto @endunless">
        <table class="encabezado">
            <tr>
                <td class="institucion">{{ $institucion }}</td>
                <td class="rotulo">TARJETA DE CONTROL</td>
            </tr>
        </table>

        <table class="nombre-fila">
            <tr>
                <td>
                    <div class="etiqueta">NOMBRE DE LA CLIENTA</div>
                    <div class="nombre">{{ $t['nombre'] }}</div>
                </td>
                <td width="90" class="folio">Folio {{ $t['folio'] }}</td>
            </tr>
        </table>

        <table class="rejilla">
            <tr>
                @foreach ($t['abonos'] as $a)
                    <th>{{ $a['columna'] }}</th>
                @endforeach
            </tr>
            <tr>
                @foreach ($t['abonos'] as $a)
                    <td class="semana">SEM {{ $a['semana'] }}</td>
                @endforeach
            </tr>
            <tr>
                @foreach ($t['abonos'] as $a)
                    <td class="importe">${{ number_format($a['monto'] / 100, 0, '.', ',') }}</td>
                @endforeach
            </tr>
            <tr>
                @foreach ($t['abonos'] as $a)
                    <td class="firma"></td>
                @endforeach
            </tr>
        </table>

        <div class="pie">
            Cada recuadro se firma o se sella al recibir el abono del sábado correspondiente.
        </div>
    </div>
@endforeach
</body>
</html>
