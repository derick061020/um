<?php

namespace App\Support;

/**
 * Matriz de permisos. Un permiso es una capacidad concreta del sistema;
 * las pantallas y los controladores preguntan siempre por el permiso,
 * nunca por el rol, para que agregar un rol nuevo no obligue a tocar la app.
 */
class Rbac
{
    public const PERMISOS = [
        'usuarios.ver',
        'usuarios.crear',
        'usuarios.editar',

        'grupos.ver',
        'grupos.crear',
        'grupos.editar',

        'clientas.ver',
        'clientas.crear',
        'clientas.editar',
        'clientas.historial',

        'creditos.ver',
        'creditos.crear',
        'creditos.editar',
        'creditos.tarjeton',

        'cobranza.ver',
        'cobranza.marcar',
        'cobranza.anular',

        'documentos.ver',
        'documentos.subir',

        'corte.dia',      // total a cobrar del día
        'reportes.ver',
        'auditoria.ver',
    ];

    public const PRINCIPAL = 'PRINCIPAL';
    public const SUPERVISOR = 'SUPERVISOR';
    public const CAPTURISTA = 'CAPTURISTA';
    public const ENCARGADA = 'ENCARGADA';

    public const ROLES = [self::PRINCIPAL, self::SUPERVISOR, self::CAPTURISTA, self::ENCARGADA];

    /** @return array<string, array<int, string>> */
    public static function matriz(): array
    {
        return [
            // Dirección: hace todo, y es la única que da de alta usuarios.
            self::PRINCIPAL => self::PERMISOS,

            // Supervisor: arma y administra los grupos (VIRI 1, CHIHUAHUA 1...) y su cartera.
            self::SUPERVISOR => [
                'grupos.ver', 'grupos.crear', 'grupos.editar',
                'clientas.ver', 'clientas.crear', 'clientas.editar', 'clientas.historial',
                'creditos.ver', 'creditos.crear', 'creditos.editar', 'creditos.tarjeton',
                'cobranza.ver', 'cobranza.marcar', 'cobranza.anular',
                'documentos.ver', 'documentos.subir',
                'corte.dia', 'reportes.ver',
                'usuarios.ver',
            ],

            // Capturista: alta de clienta y aval, historial y marcado de abonos del sábado.
            self::CAPTURISTA => [
                'grupos.ver',
                'clientas.ver', 'clientas.crear', 'clientas.editar', 'clientas.historial',
                'creditos.ver', 'creditos.crear', 'creditos.tarjeton',
                'cobranza.ver', 'cobranza.marcar',
                'documentos.ver', 'documentos.subir',
            ],

            // Encargada: únicamente el total a cobrar del día.
            self::ENCARGADA => ['corte.dia'],
        ];
    }

    /** @return array<int, string> */
    public static function permisosDe(string $rol): array
    {
        return self::matriz()[$rol] ?? [];
    }

    public static function puede(string $rol, string $permiso): bool
    {
        return in_array($permiso, self::permisosDe($rol), true);
    }

    /** @param array<int, string> $permisos */
    public static function puedeAlguno(string $rol, array $permisos): bool
    {
        foreach ($permisos as $p) {
            if (self::puede($rol, $p)) {
                return true;
            }
        }

        return false;
    }

    /** @return array<string, string> */
    public static function etiquetas(): array
    {
        return [
            self::PRINCIPAL => 'Principal',
            self::SUPERVISOR => 'Supervisor',
            self::CAPTURISTA => 'Capturista',
            self::ENCARGADA => 'Encargada',
        ];
    }

    public static function etiqueta(string $rol): string
    {
        return self::etiquetas()[$rol] ?? $rol;
    }

    /** @return array<string, string> */
    public static function descripciones(): array
    {
        return [
            self::PRINCIPAL => 'Dirección. Crea usuarios y ve toda la operación.',
            self::SUPERVISOR => 'Crea y administra grupos, clientas, créditos y cobranza.',
            self::CAPTURISTA => 'Da de alta clientas y avales, consulta historial y marca los abonos del sábado.',
            self::ENCARGADA => 'Solo consulta el total a cobrar del día.',
        ];
    }

    /** Pantalla de inicio según el rol. */
    public static function rutaInicio(string $rol): string
    {
        return match ($rol) {
            self::ENCARGADA => '/corte',
            self::CAPTURISTA => '/cobranza',
            default => '/panel',
        };
    }
}
