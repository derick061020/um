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
        'clientas.consultar',   // búsqueda de solo lectura (encargada/supervisor)

        'creditos.ver',
        'creditos.crear',
        'creditos.editar',
        'creditos.tarjeton',
        'renovaciones.procesar',
        'correcciones.aplicar', // corregir semanas, montos, deuda (solo admin)

        'cobranza.ver',
        'cobranza.marcar',
        'cobranza.anular',

        'entregas.ver',         // hoja semanal del supervisor
        'entregas.capturar',    // entregó, faltante, adelantado
        'cierre.cerrar',        // cerrar la semana del grupo (solo admin)

        'documentos.ver',
        'documentos.subir',

        'corte.dia',        // total a cobrar del día
        'encargada.panel',  // pantalla de la encargada (sus clientas)
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

            // Supervisor: SOLO ve los grupos que le asignó el admin y, en cada
            // uno, cuánto debe entregar. Lo único que captura es préstamo,
            // entregó, faltaron y adelantaron (más qué clientas). No mueve nada
            // más: ni deudas, ni semanas, ni información administrativa.
            self::SUPERVISOR => [
                'entregas.ver', 'entregas.capturar',
            ],

            // Capturista: mano derecha del admin en captura. Da de alta clientas,
            // créditos y renovaciones, y marca abonos. No hace correcciones
            // sensibles ni cierra semanas (eso es exclusivo del admin).
            self::CAPTURISTA => [
                'grupos.ver', 'grupos.crear', 'grupos.editar',
                'clientas.ver', 'clientas.crear', 'clientas.editar',
                'clientas.historial', 'clientas.consultar',
                'creditos.ver', 'creditos.crear', 'creditos.editar',
                'creditos.tarjeton', 'renovaciones.procesar',
                'cobranza.ver', 'cobranza.marcar',
                'entregas.ver',
                'documentos.ver', 'documentos.subir',
                'reportes.ver',
            ],

            // Encargada: trabaja con sus clientas. Ve sus clientas, el abono y la
            // semana de cada una, y puede buscar a una clienta para revisar su
            // historial. No modifica nada financiero.
            self::ENCARGADA => [
                'encargada.panel',
                'clientas.consultar',
                'corte.dia',
            ],
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
            self::PRINCIPAL => 'Admin / Capturista. Captura, corrige, cierra semanas y ve toda la operación.',
            self::SUPERVISOR => 'Da seguimiento a sus grupos: recoge el dinero y registra entregas y diferencias.',
            self::CAPTURISTA => 'Da de alta clientas, créditos y renovaciones, y marca los abonos del sábado.',
            self::ENCARGADA => 'Ve sus clientas, su abono y su semana; puede consultar historial.',
        ];
    }

    /** Pantalla de inicio según el rol. */
    public static function rutaInicio(string $rol): string
    {
        return match ($rol) {
            self::ENCARGADA => '/mis-clientas',
            self::SUPERVISOR => '/entregas',
            self::CAPTURISTA => '/cobranza',
            default => '/panel',
        };
    }
}
