<?php

namespace Tests\Feature;

use App\Models\Cliente;
use App\Models\Credito;
use App\Models\Usuario;
use App\Services\CreditoService;
use App\Support\Dinero;
use App\Support\Fechas;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Pruebas de las reglas de negocio críticas — las mismas 30 comprobaciones
 * que traía el sistema anterior, portadas una a una.
 *
 *   php artisan test
 */
class ReglasDeNegocioTest extends TestCase
{
    use RefreshDatabase;

    // --- Calendario de abonos ----------------------------------------------

    public function test_el_calendario_genera_doce_sabados_consecutivos(): void
    {
        // Lunes 17 de agosto de 2026.
        $lunes = Fechas::parse('2026-08-17');
        $cal = Fechas::generarCalendario($lunes, 12);

        $this->assertCount(12, $cal, 'genera 12 semanas');

        foreach ($cal as $fila) {
            $this->assertTrue(Fechas::esSabado($fila['fecha']), 'todas las fechas caen en sábado');
        }

        $this->assertSame('2026-08-22', $cal[0]['iso'], 'el primer abono es el sábado siguiente al lunes');
        $this->assertSame(5, Fechas::diasEntre($lunes, $cal[0]['fecha']), 'hay 5 días entre la entrega y el primer abono');

        for ($i = 1; $i < count($cal); $i++) {
            $this->assertSame(7, Fechas::diasEntre($cal[$i - 1]['fecha'], $cal[$i]['fecha']), 'los abonos van de 7 en 7 días');
        }

        $this->assertSame(
            $cal[11]['iso'],
            Fechas::iso(Fechas::fechaVencimiento($lunes, 12)),
            'el sábado 12 es el vencimiento',
        );

        $this->assertSame(
            '2026-11-07',
            Fechas::iso(Fechas::fechaVencimiento($lunes, 12)),
            'vence el 7 de noviembre de 2026',
        );
    }

    public function test_si_se_entrega_en_sabado_el_primer_abono_es_a_los_siete_dias(): void
    {
        $this->assertSame(
            '2026-08-29',
            Fechas::iso(Fechas::primerSabado(Fechas::parse('2026-08-22'))),
            'entrega en sábado ⇒ primer abono a los 7 días',
        );
    }

    public function test_el_horario_de_verano_no_corre_las_fechas(): void
    {
        $octubre = Fechas::generarCalendario(Fechas::parse('2026-10-19'), 12);

        foreach ($octubre as $fila) {
            $this->assertTrue(Fechas::esSabado($fila['fecha']), 'el horario de verano no corre las fechas');
        }
    }

    // --- Importes -----------------------------------------------------------

    public function test_los_importes_se_manejan_en_centavos(): void
    {
        $this->assertSame(300_000, Dinero::aCentavos('3000'), '$3,000 son 300000 centavos');
        $this->assertSame(360_050, Dinero::aCentavos('$3,600.50'), 'acepta separadores y símbolo');
    }

    public function test_el_total_se_reparte_en_abonos_parejos(): void
    {
        $parejo = Dinero::repartirAbonos(360_000, 12);

        $this->assertSame(30_000, $parejo[0], '12 abonos parejos de $300');
        $this->assertSame(360_000, array_sum($parejo), 'la suma cuadra con el total');
    }

    public function test_el_redondeo_se_carga_al_ultimo_abono(): void
    {
        $disparejo = Dinero::repartirAbonos(100_000, 12);

        $this->assertSame(100_000, array_sum($disparejo), 'el redondeo se carga al último abono');
        $this->assertGreaterThan($disparejo[0], $disparejo[11], 'el último abono absorbe el sobrante');
    }

    public function test_el_formato_de_pesos_es_mexicano(): void
    {
        $this->assertSame('$1,000.00', Dinero::pesos(100_000), 'formato mexicano');
    }

    // --- Ciclo de vida del crédito -----------------------------------------

    public function test_ciclo_de_vida_completo_del_credito(): void
    {
        $servicio = new CreditoService;

        $usuario = Usuario::create([
            'nombre' => 'Capturista de prueba',
            'usuario' => 'prueba_capturista',
            'password_hash' => bcrypt('Cambiar123'),
            'rol' => 'CAPTURISTA',
        ]);

        $clienta = Cliente::create([
            'folio' => $servicio->siguienteFolioCliente(),
            'nombre' => 'CLIENTA DE PRUEBA',
            'capturado_por_id' => $usuario->id,
        ]);

        $credito = $servicio->crear([
            'cliente_id' => $clienta->id,
            'monto_prestado' => Dinero::aCentavos('3000'),
            'monto_total' => Dinero::aCentavos('3600'),
            'num_semanas' => 12,
            'fecha_entrega' => '2026-08-17',
            'capturado_por_id' => $usuario->id,
        ]);

        $abonos = $credito->abonos()->get();

        $this->assertCount(12, $abonos, 'se crearon 12 abonos');
        $this->assertSame(30_000, $credito->abono_semanal, 'el abono semanal es $300');
        $this->assertSame('2026-08-22', $abonos[0]->fecha_programada->format('Y-m-d'), 'el primer abono queda el 22/08/2026');
        $this->assertSame('2026-11-07', $credito->fecha_vencimiento->format('Y-m-d'), 'el vencimiento queda el 07/11/2026');
        $this->assertSame($credito->monto_total, (int) $abonos->sum('monto_esperado'), 'la suma de los abonos es el total');

        // Abono parcial
        $servicio->registrarPago($abonos[0]->id, Dinero::aCentavos('150'), $usuario->id);
        $this->assertSame('PARCIAL', $abonos[0]->fresh()->estado, 'un abono incompleto queda PARCIAL');

        // Se completa el mismo abono
        $servicio->marcarCompleto($abonos[0]->id, $usuario->id);
        $completo = $abonos[0]->fresh();
        $this->assertSame('PAGADO', $completo->estado, 'al cubrirlo queda PAGADO');
        $this->assertSame($completo->monto_esperado, $completo->monto_pagado, 'no se cobra de más');

        // Atraso a la fecha de la semana 3
        $resumenParcial = CreditoService::resumir(
            $credito->fresh(),
            $credito->abonos()->get(),
            Fechas::parse('2026-09-05'),
        );
        $this->assertSame(2, $resumenParcial['semanas_atrasadas'], 'marca 2 semanas de atraso');
        $this->assertSame(60_000, $resumenParcial['atraso_centavos'], 'el atraso son $600');

        // Se liquida el resto
        foreach ($abonos->slice(1) as $a) {
            $servicio->marcarCompleto($a->id, $usuario->id);
        }

        $liquidado = Credito::find($credito->id);
        $this->assertSame('LIQUIDADO', $liquidado->estado, 'al cubrir todo queda LIQUIDADO');

        $resumenFinal = CreditoService::resumir(
            $liquidado,
            $liquidado->abonos()->get(),
            Fechas::parse('2026-11-07'),
        );
        $this->assertSame(0, $resumenFinal['saldo'], 'el saldo queda en cero');
        $this->assertSame(0, $resumenFinal['atraso_centavos'], 'no queda atraso');
        $this->assertSame(360_000, $resumenFinal['total_pagado'], 'el total pagado es $3,600');
    }
}
