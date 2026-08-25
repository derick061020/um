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

/**
 * Pruebas de la operación ampliada: renovación, corrección del admin, entregas
 * semanales con "debe entregar" automático y alcance por rol.
 */
class OperacionAmpliadaTest extends TestCase
{
    use RefreshDatabase;

    private function usuario(string $rol): Usuario
    {
        return Usuario::create([
            'nombre' => "Prueba $rol",
            'usuario' => strtolower($rol).'_'.uniqid(),
            'password_hash' => bcrypt('Cambiar123'),
            'rol' => $rol,
        ]);
    }

    private function creditoDe(Cliente $c, CreditoService $s, string $entrega = '2026-08-17'): Credito
    {
        return $s->crear([
            'cliente_id' => $c->id,
            'grupo_id' => $c->grupo_id,
            'monto_prestado' => Dinero::aCentavos('3000'),
            'monto_total' => Dinero::aCentavos('3600'),
            'num_semanas' => 12,
            'fecha_entrega' => $entrega,
            'capturado_por_id' => $c->capturado_por_id,
        ]);
    }

    public function test_la_renovacion_liquida_el_anterior_y_arranca_en_semana_uno(): void
    {
        $s = new CreditoService;
        $admin = $this->usuario(Rbac::PRINCIPAL);
        $cli = Cliente::create(['folio' => $s->siguienteFolioCliente(), 'nombre' => 'RENUEVA', 'capturado_por_id' => $admin->id]);

        $anterior = $this->creditoDe($cli, $s);
        // Paga 8 de 12 semanas.
        foreach ($anterior->abonos()->take(8)->get() as $a) {
            $s->marcarCompleto($a->id, $admin->id);
        }

        $res = $s->renovar($anterior->id, [
            'grupo_id' => null,
            'monto_prestado' => Dinero::aCentavos('4000'),
            'monto_total' => Dinero::aCentavos('4800'),
            'num_semanas' => 12,
            'fecha_entrega' => '2026-11-16',
        ], $admin->id);

        $anteriorFresco = Credito::find($anterior->id);
        $this->assertSame('RENOVADO', $anteriorFresco->estado, 'el anterior queda RENOVADO');
        $this->assertNotNull($anteriorFresco->liquidado_en, 'con fecha de liquidación');
        $this->assertSame(8, $anteriorFresco->abonos()->where('estado', 'PAGADO')->count(), 'conserva sus 8 semanas pagadas');

        $nuevo = $res['nuevo'];
        $this->assertTrue($nuevo->es_renovacion, 'el nuevo está marcado como renovación');
        $this->assertSame($anterior->id, $nuevo->renovado_de_id, 'enlazado al anterior');
        $this->assertSame('ACTIVO', $nuevo->estado, 'el nuevo arranca activo');
        $this->assertSame(12, $nuevo->abonos()->count(), 'con su calendario completo');
        $this->assertSame(0, (int) $nuevo->abonos()->sum('monto_pagado'), 'el nuevo empieza sin pagos (semana 1)');

        // El saldo liquidado son las 4 semanas que faltaban: 4 × $300 = $1,200.
        $this->assertSame(120_000, $res['saldo_liquidado'], 'el saldo liquidado es el pendiente del anterior');
    }

    public function test_no_se_renueva_un_credito_ya_cerrado(): void
    {
        $s = new CreditoService;
        $admin = $this->usuario(Rbac::PRINCIPAL);
        $cli = Cliente::create(['folio' => $s->siguienteFolioCliente(), 'nombre' => 'CERRADO', 'capturado_por_id' => $admin->id]);
        $c = $this->creditoDe($cli, $s);
        foreach ($c->abonos as $a) {
            $s->marcarCompleto($a->id, $admin->id);
        }

        $this->assertSame('LIQUIDADO', Credito::find($c->id)->estado);
        $this->expectException(\RuntimeException::class);
        $s->renovar($c->id, [
            'monto_prestado' => Dinero::aCentavos('1000'), 'monto_total' => Dinero::aCentavos('1200'),
            'num_semanas' => 12, 'fecha_entrega' => '2026-11-16',
        ], $admin->id);
    }

    public function test_la_correccion_rehace_el_calendario_y_conserva_el_total_pagado(): void
    {
        $s = new CreditoService;
        $admin = $this->usuario(Rbac::PRINCIPAL);
        $cli = Cliente::create(['folio' => $s->siguienteFolioCliente(), 'nombre' => 'CORRIGE', 'capturado_por_id' => $admin->id]);

        // Se captura por error a 13 semanas.
        $c = $s->crear([
            'cliente_id' => $cli->id, 'monto_prestado' => Dinero::aCentavos('3000'),
            'monto_total' => Dinero::aCentavos('3900'), 'num_semanas' => 13,
            'fecha_entrega' => '2026-08-17', 'capturado_por_id' => $admin->id,
        ]);
        $s->marcarCompleto($c->abonos()->first()->id, $admin->id); // paga 1 semana ($300)
        $pagadoAntes = (int) $c->abonos()->sum('monto_pagado');

        $res = $s->corregir($c->id, [
            'monto_total' => Dinero::aCentavos('3600'),
            'num_semanas' => 12,
            'fecha_entrega' => '2026-08-17',
        ], $admin->id);

        $c2 = Credito::find($c->id);
        $this->assertSame(12, $c2->num_semanas, 'quedó en 12 semanas');
        $this->assertSame(12, $c2->abonos()->count(), 'el calendario se rehizo a 12 abonos');
        $this->assertSame($pagadoAntes, (int) $c2->abonos()->sum('monto_pagado'), 'se conserva el total pagado');
        $this->assertSame(13, $res['antes']['num_semanas'], 'la bitácora guarda el antes');
        $this->assertSame(12, $res['despues']['num_semanas'], 'y el después');
    }

    public function test_debe_entregar_es_la_suma_de_los_abonos_del_sabado(): void
    {
        $s = new CreditoService;
        $entregas = new EntregaService;
        $admin = $this->usuario(Rbac::PRINCIPAL);
        $enc = $this->usuario(Rbac::ENCARGADA);
        $grupo = Grupo::create(['nombre' => 'G-PRUEBA', 'zona' => 'N', 'ubicacion' => 'x', 'encargada_id' => $enc->id]);

        // Dos clientas del grupo, cada una $300 el primer sábado (22/08/2026).
        foreach (['A', 'B'] as $n) {
            $cli = Cliente::create(['folio' => $s->siguienteFolioCliente(), 'nombre' => "CLI $n",
                'grupo_id' => $grupo->id, 'capturado_por_id' => $admin->id]);
            $this->creditoDe($cli, $s);
        }

        $sabado = Fechas::parse('2026-08-22');
        $this->assertSame(60_000, $entregas->debeEntregar($grupo->id, $sabado), 'dos abonos de $300 = $600');

        $entrega = $entregas->obtenerOAbrir($grupo, $sabado, $admin->id);
        $entregas->capturar($entrega, ['entrego' => 61_000], $admin->id);
        $this->assertSame(1_000, $entrega->diferencia(), 'entregó $610, debía $600 → adelanto de $10');
    }

    public function test_los_grupos_visibles_se_acotan_por_rol(): void
    {
        $sup1 = $this->usuario(Rbac::SUPERVISOR);
        $sup2 = $this->usuario(Rbac::SUPERVISOR);
        $enc = $this->usuario(Rbac::ENCARGADA);

        Grupo::create(['nombre' => 'DEL SUP1', 'zona' => 'N', 'ubicacion' => 'x', 'supervisor_id' => $sup1->id, 'encargada_id' => $enc->id]);
        Grupo::create(['nombre' => 'DEL SUP2', 'zona' => 'N', 'ubicacion' => 'x', 'supervisor_id' => $sup2->id, 'encargada_id' => $enc->id]);

        $this->assertSame(1, Grupo::visiblesPara($sup1)->count(), 'el supervisor solo ve el suyo');
        $this->assertSame(2, Grupo::visiblesPara($enc)->count(), 'la encargada ve los dos que lleva');
        $this->assertSame(2, Grupo::visiblesPara($this->usuario(Rbac::PRINCIPAL))->count(), 'el admin ve todos');
    }

    public function test_el_id_publico_de_la_clienta_tiene_formato_cl(): void
    {
        $c = new Cliente(['folio' => 123]);
        $this->assertSame('CL-000123', $c->idPublico());
    }
}
