<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\Grupo;
use App\Models\Usuario;
use App\Services\CreditoService;
use App\Support\Dinero;
use App\Support\Fechas;
use App\Support\Rbac;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Datos de arranque.
 *
 *   php artisan db:seed                       -> cuentas + datos de ejemplo
 *   php artisan db:seed --class=DatabaseSeeder con APP_ENV=production
 *                                             -> SOLO las cuatro cuentas
 *
 * En producción nunca se siembran clientas de ejemplo, salvo que se pida
 * explícitamente con SEED_DEMO=1.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command?->info('Sembrando datos de arranque…');

        $hash = Hash::make('Cambiar123');

        $principal = Usuario::firstOrCreate(
            ['usuario' => 'direccion'],
            ['nombre' => 'Dirección Mujeres Unidas', 'password_hash' => $hash, 'rol' => Rbac::PRINCIPAL],
        );

        $supervisor = Usuario::firstOrCreate(
            ['usuario' => 'viridiana'],
            ['nombre' => 'Viridiana', 'password_hash' => $hash, 'rol' => Rbac::SUPERVISOR,
             'creado_por_id' => $principal->id],
        );

        $capturista = Usuario::firstOrCreate(
            ['usuario' => 'capturista'],
            ['nombre' => 'Capturista', 'password_hash' => $hash, 'rol' => Rbac::CAPTURISTA,
             'creado_por_id' => $principal->id],
        );

        $encargada = Usuario::firstOrCreate(
            ['usuario' => 'encargada'],
            ['nombre' => 'Encargada', 'password_hash' => $hash, 'rol' => Rbac::ENCARGADA,
             'creado_por_id' => $principal->id],
        );

        // En el servidor solo se crean las cuatro cuentas de rol. Los grupos y
        // las clientas de ejemplo son para probar y no deben ensuciar la base
        // real. Para forzarlos: SEED_DEMO=1 php artisan db:seed
        if (app()->environment('production') && env('SEED_DEMO') !== '1') {
            $this->command?->info('✓ Cuentas de rol creadas (sin datos de ejemplo).');
            $this->command?->warn("  Entra con 'direccion' / 'Cambiar123' y cambia la contraseña.");

            return;
        }

        $viri = Grupo::firstOrCreate(
            ['nombre' => 'VIRI 1'],
            ['codigo' => 'GR-000001', 'plaza' => 'Mazatlán', 'estado' => 'Sinaloa',
             'municipio' => 'Mazatlán', 'zona' => 'Norte', 'colonia' => 'Santa Fe',
             'ubicacion' => 'Casa de la encargada, esquina Santa Fe y 5 de Mayo',
             'supervisor_id' => $supervisor->id, 'encargada_id' => $encargada->id,
             'creado_por_id' => $supervisor->id],
        );

        $chihuahua = Grupo::firstOrCreate(
            ['nombre' => 'CHIHUAHUA 1'],
            ['codigo' => 'GR-000002', 'plaza' => 'Chihuahua', 'estado' => 'Chihuahua',
             'municipio' => 'Chihuahua', 'zona' => 'Centro', 'colonia' => 'Centro',
             'ubicacion' => 'Local de reunión, calle Libertad 120',
             'supervisor_id' => $supervisor->id, 'encargada_id' => $encargada->id,
             'creado_por_id' => $supervisor->id],
        );

        if (Cliente::count() > 0) {
            $this->command?->info('✓ Ya había datos de ejemplo, no se duplican.');

            return;
        }

        $muestra = [
            ['nombre' => 'María Guadalupe Torres Ochoa', 'grupo' => $viri, 'prestado' => '3000', 'total' => '3600', 'aval' => 'José Luis Torres'],
            ['nombre' => 'Alejandra Núñez Beltrán', 'grupo' => $viri, 'prestado' => '5000', 'total' => '6000', 'aval' => 'Marisol Núñez'],
            ['nombre' => 'Claudia Elena Vega Ruiz', 'grupo' => $viri, 'prestado' => '2000', 'total' => '2400', 'aval' => 'Ramón Vega'],
            ['nombre' => 'Silvia Patricia Ramos León', 'grupo' => $chihuahua, 'prestado' => '4000', 'total' => '4800', 'aval' => 'Elba Ramos'],
            ['nombre' => 'Norma Angélica Duarte Gil', 'grupo' => $chihuahua, 'prestado' => '6000', 'total' => '7200', 'aval' => 'Sergio Duarte'],
        ];

        // Créditos entregados hace 3 semanas: ya tienen sábados vencidos.
        $entrega = $this->lunesReciente(3);
        $servicio = new CreditoService;

        foreach ($muestra as $i => $m) {
            $clienta = Cliente::create([
                'folio' => $servicio->siguienteFolioCliente(),
                'nombre' => $m['nombre'],
                'telefono' => '66912345'.str_pad((string) $i, 2, '0', STR_PAD_LEFT),
                'domicilio' => 'Calle '.(10 + $i).' #'.(100 + $i * 7),
                'colonia' => 'Centro',
                'ciudad' => $m['grupo']->plaza,
                'grupo_id' => $m['grupo']->id,
                'aval_nombre' => $m['aval'],
                'aval_telefono' => '66998765'.str_pad((string) $i, 2, '0', STR_PAD_LEFT),
                'aval_domicilio' => 'Calle '.(20 + $i).' #'.(200 + $i * 5),
                'capturado_por_id' => $capturista->id,
            ]);

            $credito = $servicio->crear([
                'cliente_id' => $clienta->id,
                'grupo_id' => $m['grupo']->id,
                'monto_prestado' => Dinero::aCentavos($m['prestado']),
                'monto_total' => Dinero::aCentavos($m['total']),
                'num_semanas' => 12,
                'fecha_entrega' => $entrega,
                'capturado_por_id' => $capturista->id,
            ]);

            // Las primeras dos o tres semanas ya cobradas, para que el panel
            // y la cobranza tengan movimiento que mirar.
            $porPagar = 2 + ($i % 2);
            foreach ($credito->abonos()->take($porPagar)->get() as $abono) {
                $servicio->marcarCompleto($abono->id, $capturista->id);
            }
        }

        $this->command?->info('✓ Datos de ejemplo listos: 2 grupos y 5 clientas con crédito.');
    }

    /** Lunes más reciente, retrocediendo `$semanas` semanas. */
    private function lunesReciente(int $semanas): string
    {
        $hoy = Fechas::hoy();
        $retroceso = (Fechas::diaSemana($hoy) - 1 + 7) % 7;

        return Fechas::sumarDias($hoy, -$retroceso - $semanas * 7)->format('Y-m-d');
    }
}
