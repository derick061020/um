<?php

namespace App\Support;

use InvalidArgumentException;

/**
 * Los importes viven en CENTAVOS (enteros) en toda la aplicación.
 * Se convierten a pesos únicamente al mostrar o al leer un formulario.
 */
class Dinero
{
    public static function aCentavos(string|int|float $valor): int
    {
        if (is_int($valor) || is_float($valor)) {
            if (! is_finite((float) $valor)) {
                throw new InvalidArgumentException('Importe inválido.');
            }

            return (int) round($valor * 100);
        }

        $limpio = trim(preg_replace('/[$,\s]/', '', $valor));

        if ($limpio === '') {
            throw new InvalidArgumentException('Importe vacío.');
        }

        if (! preg_match('/^-?\d+(\.\d{1,2})?$/', $limpio)) {
            throw new InvalidArgumentException("Importe inválido: \"$valor\".");
        }

        return (int) round((float) $limpio * 100);
    }

    public static function aPesos(int $centavos): float
    {
        return $centavos / 100;
    }

    /** "$1,000.00" */
    public static function pesos(int $centavos): string
    {
        return '$'.number_format($centavos / 100, 2, '.', ',');
    }

    /** "1,000" — sin símbolo, y sin decimales cuando son cerrados (para el tarjetón) */
    public static function compacto(int $centavos): string
    {
        $v = $centavos / 100;

        return floor($v) == $v
            ? number_format($v, 0, '.', ',')
            : number_format($v, 2, '.', ',');
    }

    /**
     * Reparte el total en `n` abonos iguales; el redondeo sobrante se carga
     * al último abono para que la suma cuadre exactamente con el total.
     *
     * @return array<int, int>
     */
    public static function repartirAbonos(int $totalCentavos, int $n): array
    {
        if ($n < 1) {
            throw new InvalidArgumentException('Número de abonos inválido.');
        }

        $base = intdiv($totalCentavos, $n);
        $abonos = array_fill(0, $n, $base);
        $abonos[$n - 1] += $totalCentavos - $base * $n;

        return $abonos;
    }
}
