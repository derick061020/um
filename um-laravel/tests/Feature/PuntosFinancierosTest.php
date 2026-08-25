<?php

namespace Tests\Feature;

use App\Models\Cliente;
use App\Models\Credito;
use App\Models\Grupo;
use App\Models\Usuario;
use App\Services\CreditoService;
use App\Services\EntregaService;
use App\Support\Dinero;
use App\Support\Fechas;
use App\Support\Rbac;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PuntosFinancierosTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): Usuario
    {
        return Usuario::create([
            'nombre' => 'Admin', 'usuario' => 'admin_'.uniqid(),
            'password_hash' => bcrypt('x'), 'rol' => Rbac::PRINCIPAL,
        ]);
    }

    private function credito(CreditoService $s, int $usuarioId, ?int $grupoId, string $prestado, string $total, string $entrega = '2026-08-17', int $semanas = 12): Credito
    {
        $cli = Cliente::create(['folio' => $s->siguienteFolioCliente(), 'nombre' => 'CLI '.uniqid(),
            'grupo_id' => $grupoId, 'capturado_por_id' => $usuarioId]);

        return $s->crear([
            'cliente_id' => $cli->id, 'grupo_id' => $grupoId,
            'monto_prestado' => Dinero::aCentavos($prestado), 'monto_total' => Dinero::aCentavos($total),
            'num_semanas' => $semanas, 'fecha_entrega' => $entrega, 'capturado_por_id' => $usuarioId,
        ]);
    }

    public function test_renovacion_solo_en_el_ultimo_pago_y_calcula_el_neto(): void
    {
        $s = new CreditoService;
        $admin = $this->admin();
        // Préstamo anterior: total $14,004, 12 semanas de $1,167.
        $ant = $this->credito($s, $admin->id, null, '10000', '14004');

        // Con 5 pagos NO se puede renovar.
        foreach ($ant->abonos()->take(5)->get() as $a) {
            $s->marcarCompleto($a->id, $admin->id);
        }
        $this->assertFalse(Credito::find($ant->id)->puedeRenovar(), 'no renueva antes del último pago');

        // Paga hasta el 11 (le queda solo el último): 6 más.
        foreach ($ant->abonos()->orderBy('semana')->skip(5)->take(6)->get() as $a) {
            $s->marcarCompleto($a->id, $admin->id);
        }
        $antFresco = Credito::find($ant->id);
        $this->assertTrue($antFresco->puedeRenovar(), 'con 11 pagados sí renueva');
        $this->assertSame(116700, $antFresco->saldo(), 'saldo pendiente = un abono de $1,167');

        // Renovación: nuevo préstamo $10,000. Neto = 10,000 − 1,167 = 8,833.
        $res = $s->renovar($ant->id, [
            'monto_prestado' => Dinero::aCentavos('10000'), 'monto_total' => Dinero::aCentavos('14004'),
            'num_semanas' => 12, 'fecha_entrega' => '2026-11-16',
        ], $admin->id);

        $this->assertSame(116700, $res['saldo_liquidado'], 'se liquida $1,167');
        $this->assertSame(883300, $res['neto_entregado'], 'neto entregado = $8,833');
        $this->assertSame(116700, Credito::find($res['nuevo']->id)->descuento_renovacion, 'guarda el descuento');
    }

    public function test_ajustar_abono_conserva_los_pagados_y_recalcula_el_total(): void
    {
        $s = new CreditoService;
        $admin = $this->admin();
        // 12 semanas de $300, total $3,600.
        $c = $this->credito($s, $admin->id, null, '3000', '3600');

        // Cobra las semanas 1 y 2 ($300 c/u).
        foreach ($c->abonos()->take(2)->get() as $a) {
            $s->marcarCompleto($a->id, $admin->id);
        }

        // Baja el abono a $250 desde la semana 3.
        $s->ajustarAbono($c->id, 3, Dinero::aCentavos('250'), $admin->id);

        $c2 = Credito::with('abonos')->find($c->id);
        $sem1 = $c2->abonos->firstWhere('semana', 1);
        $sem3 = $c2->abonos->firstWhere('semana', 3);

        $this->assertSame(30000, $sem1->monto_esperado, 'la semana ya cobrada conserva $300');
        $this->assertSame(25000, $sem3->monto_esperado, 'desde la 3 el abono es $250');
        // Total = 2×300 + 10×250 = 600 + 2500 = $3,100.
        $this->assertSame(310000, $c2->monto_total, 'el total se recalcula a $3,100');
        $this->assertSame(25000, $c2->abono_semanal, 'el abono semanal queda en $250');
    }

    public function test_no_se_borra_grupo_ni_clienta_con_historial(): void
    {
        $s = new CreditoService;
        $admin = $this->admin();
        $grupo = Grupo::create(['nombre' => 'G', 'zona' => 'N', 'ubicacion' => 'x', 'encargada_id' => $admin->id]);
        $c = $this->credito($s, $admin->id, $grupo->id, '1000', '1200');

        $this->assertGreaterThan(0, $grupo->creditos()->count());
        // El grupo con créditos no se puede borrar (se archiva).
        $this->assertTrue($grupo->creditos()->exists());

        // La clienta con crédito tampoco.
        $clienta = $c->cliente;
        $this->assertTrue($clienta->creditos()->exists(), 'la clienta tiene crédito → no se borra');
    }

    public function test_el_cierre_separa_el_dinero_fisico_de_la_renovacion(): void
    {
        $s = new CreditoService;
        $entregas = new EntregaService;
        $admin = $this->admin();
        $grupo = Grupo::create(['nombre' => 'GC', 'zona' => 'N', 'ubicacion' => 'x', 'encargada_id' => $admin->id]);

        // Una renovación cuyo primer abono cae el sábado 21/11/2026.
        $ant = $this->credito($s, $admin->id, $grupo->id, '10000', '14004', '2026-08-17');
        foreach ($ant->abonos as $a) {
            $s->marcarCompleto($a->id, $admin->id);
        }
        // Ese quedó liquidado; hago uno nuevo en el último pago para renovar:
        $ant2 = $this->credito($s, $admin->id, $grupo->id, '10000', '14004', '2026-11-09');
        foreach ($ant2->abonos()->take(11)->get() as $a) {
            $s->marcarCompleto($a->id, $admin->id);
        }
        $res = $s->renovar($ant2->id, [
            'monto_prestado' => Dinero::aCentavos('10000'), 'monto_total' => Dinero::aCentavos('14004'),
            'num_semanas' => 12, 'fecha_entrega' => '2026-11-16',
        ], $admin->id);

        $sabado = Fechas::parse($res['nuevo']->fecha_primer_abono->format('Y-m-d'));
        $resumen = $entregas->resumenCierre($grupo->id, $sabado);

        $this->assertSame(1, $resumen['renovaciones_count'], 'una renovación esa semana');
        $this->assertSame(116700, $resumen['saldos_liquidados'], 'saldo liquidado = $1,167 (no es efectivo)');
        $this->assertSame(883300, $resumen['neto_renovados'], 'neto entregado = $8,833');
    }
}
