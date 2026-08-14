<?php

namespace App\Support;

use DateTimeImmutable;
use DateTimeZone;
use InvalidArgumentException;

/**
 * Utilidades de fecha para el calendario de cobranza.
 *
 * Regla de negocio (Mujeres Unidas):
 *   se captura el LUNES de entrega del crédito y el sistema genera
 *   automáticamente los 12 sábados de abono. El crédito vence el sábado 12.
 *
 * Todas las fechas "de calendario" se manejan en UTC a las 00:00 para que el
 * cambio de horario o la zona del servidor nunca corra un día.
 */
class Fechas
{
    public const DOMINGO = 0;
    public const LUNES = 1;
    public const SABADO = 6;

    private const MESES = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ];

    private const DIAS = [
        'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado',
    ];

    public static function utc(): DateTimeZone
    {
        return new DateTimeZone('UTC');
    }

    /** Convierte "2026-08-17" en una fecha a las 00:00 UTC. */
    public static function parse(string $iso): DateTimeImmutable
    {
        $iso = trim($iso);

        if (! preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $iso, $m)) {
            throw new InvalidArgumentException("Fecha inválida: \"$iso\". Se espera AAAA-MM-DD.");
        }

        if (! checkdate((int) $m[2], (int) $m[3], (int) $m[1])) {
            throw new InvalidArgumentException("Fecha inválida: \"$iso\".");
        }

        return new DateTimeImmutable("$iso 00:00:00", self::utc());
    }

    /** Devuelve "2026-08-17". */
    public static function iso(DateTimeImmutable $d): string
    {
        return $d->format('Y-m-d');
    }

    public static function sumarDias(DateTimeImmutable $d, int $dias): DateTimeImmutable
    {
        return $d->modify(($dias >= 0 ? '+' : '-').abs($dias).' days');
    }

    public static function diaSemana(DateTimeImmutable $d): int
    {
        return (int) $d->format('w');
    }

    public static function esLunes(DateTimeImmutable $d): bool
    {
        return self::diaSemana($d) === self::LUNES;
    }

    public static function esSabado(DateTimeImmutable $d): bool
    {
        return self::diaSemana($d) === self::SABADO;
    }

    /** Hoy, normalizado a fecha de calendario (00:00 UTC). */
    public static function hoy(): DateTimeImmutable
    {
        return new DateTimeImmutable(date('Y-m-d').' 00:00:00', self::utc());
    }

    /**
     * Primer sábado de cobro a partir de la fecha de entrega.
     * Si se entrega en lunes, el primer abono cae 5 días después (misma semana).
     * Si por excepción se entrega en sábado, se toma el sábado siguiente.
     */
    public static function primerSabado(DateTimeImmutable $entrega): DateTimeImmutable
    {
        $faltan = (self::SABADO - self::diaSemana($entrega) + 7) % 7;

        return self::sumarDias($entrega, $faltan === 0 ? 7 : $faltan);
    }

    /**
     * Sábado de cobro vigente: hoy mismo si hoy es sábado, o el siguiente.
     * Es el día que abren por omisión la cobranza y el corte del día.
     */
    public static function sabadoDeCobro(?DateTimeImmutable $referencia = null): DateTimeImmutable
    {
        $referencia ??= self::hoy();

        return self::sumarDias($referencia, (self::SABADO - self::diaSemana($referencia) + 7) % 7);
    }

    /**
     * Genera el calendario completo de abonos.
     *
     * @return array<int, array{semana:int, fecha:DateTimeImmutable, iso:string}>
     */
    public static function generarCalendario(DateTimeImmutable $entrega, int $semanas = 12): array
    {
        if ($semanas < 1 || $semanas > 104) {
            throw new InvalidArgumentException('El número de semanas debe estar entre 1 y 104.');
        }

        $inicio = self::primerSabado($entrega);
        $filas = [];

        for ($i = 0; $i < $semanas; $i++) {
            $fecha = self::sumarDias($inicio, $i * 7);
            $filas[] = ['semana' => $i + 1, 'fecha' => $fecha, 'iso' => self::iso($fecha)];
        }

        return $filas;
    }

    /** Sábado de vencimiento (última semana). */
    public static function fechaVencimiento(DateTimeImmutable $entrega, int $semanas = 12): DateTimeImmutable
    {
        $cal = self::generarCalendario($entrega, $semanas);

        return $cal[count($cal) - 1]['fecha'];
    }

    /** "sábado 22 de agosto de 2026" */
    public static function larga(DateTimeImmutable $d): string
    {
        return sprintf(
            '%s %d de %s de %d',
            self::DIAS[self::diaSemana($d)],
            (int) $d->format('j'),
            self::MESES[(int) $d->format('n') - 1],
            (int) $d->format('Y'),
        );
    }

    /** "22/08/26" — formato del tarjetón impreso */
    public static function corta(DateTimeImmutable $d): string
    {
        return $d->format('d/m/y');
    }

    /** "22 AGO" — encabezado de columna del tarjetón */
    public static function columna(DateTimeImmutable $d): string
    {
        $mes = mb_strtoupper(mb_substr(self::MESES[(int) $d->format('n') - 1], 0, 3));

        return $d->format('d').' '.$mes;
    }

    public static function diasEntre(DateTimeImmutable $a, DateTimeImmutable $b): int
    {
        return (int) round(($b->getTimestamp() - $a->getTimestamp()) / 86400);
    }
}
