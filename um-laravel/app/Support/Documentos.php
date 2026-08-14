<?php

namespace App\Support;

class Documentos
{
    /** Orden en que se pide el expediente en ventanilla. */
    public const TIPOS = [
        'INE_FRENTE',
        'INE_REVERSO',
        'COMPROBANTE_DOMICILIO',
        'INE_AVAL_FRENTE',
        'INE_AVAL_REVERSO',
        'COMPROBANTE_AVAL',
        'PAGARE',
        'CONTRATO',
        'OTRO',
    ];

    /** Documentos mínimos para considerar completo el expediente. */
    public const OBLIGATORIOS = [
        'INE_FRENTE',
        'INE_REVERSO',
        'COMPROBANTE_DOMICILIO',
    ];

    /** @return array<string, string> */
    public static function etiquetas(): array
    {
        return [
            'INE_FRENTE' => 'INE — frente',
            'INE_REVERSO' => 'INE — reverso',
            'COMPROBANTE_DOMICILIO' => 'Comprobante de domicilio',
            'INE_AVAL_FRENTE' => 'INE del aval — frente',
            'INE_AVAL_REVERSO' => 'INE del aval — reverso',
            'COMPROBANTE_AVAL' => 'Comprobante del aval',
            'PAGARE' => 'Pagaré',
            'CONTRATO' => 'Contrato',
            'OTRO' => 'Otro documento',
        ];
    }

    public static function etiqueta(string $tipo): string
    {
        return self::etiquetas()[$tipo] ?? $tipo;
    }

    /** @return array<int, array{valor:string, texto:string}> */
    public static function opciones(): array
    {
        return array_map(
            fn (string $t) => ['valor' => $t, 'texto' => self::etiqueta($t)],
            self::TIPOS,
        );
    }

    public static function pesoLegible(int $bytes): string
    {
        if ($bytes < 1024) {
            return "$bytes B";
        }

        if ($bytes < 1024 * 1024) {
            return round($bytes / 1024).' KB';
        }

        return number_format($bytes / 1024 / 1024, 1).' MB';
    }
}
