<?php

namespace App\Services;

use App\Models\Abono;
use App\Models\EntregaSemanal;
use App\Models\Grupo;
use App\Support\Fechas;
use DateTimeImmutable;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * Entregas semanales del supervisor. "Debe entregar" siempre lo calcula el
 * sistema a partir de los abonos del sábado; el supervisor nunca lo escribe.
 */
class EntregaService
{
    /**
     * Lo que un grupo debe entregar en un sábado: la suma de los abonos
     * programados para esa fecha, de los créditos abiertos del grupo.
     */
    public function debeEntregar(int $grupoId, DateTimeImmutable $sabado): int
    {
        return (int) Abono::whereDate('fecha_programada', $sabado->format('Y-m-d'))
            ->whereHas('credito', fn ($q) => $q->where('grupo_id', $grupoId)
                ->whereIn('estado', ['ACTIVO', 'VENCIDO', 'LIQUIDADO', 'RENOVADO']))
            ->sum('monto_esperado');
    }

    /** Lo realmente cobrado a las clientas ese sábado (referencia). */
    public function cobradoDelSabado(int $grupoId, DateTimeImmutable $sabado): int
    {
        return (int) Abono::whereDate('fecha_programada', $sabado->format('Y-m-d'))
            ->whereHas('credito', fn ($q) => $q->where('grupo_id', $grupoId))
            ->sum('monto_pagado');
    }

    /**
     * Devuelve la entrega del grupo para ese sábado, creándola si no existe.
     * Recalcula "debe entregar" mientras la entrega siga abierta.
     */
    public function obtenerOAbrir(Grupo $grupo, DateTimeImmutable $sabado, int $usuarioId): EntregaSemanal
    {
        // Se busca por fecha de calendario (el cast `date` guarda hora 00:00:00,
        // así que hay que comparar con whereDate, no por igualdad de texto).
        $entrega = EntregaSemanal::where('grupo_id', $grupo->id)
            ->whereDate('fecha', $sabado->format('Y-m-d'))
            ->first();

        if (! $entrega) {
            $entrega = new EntregaSemanal([
                'grupo_id' => $grupo->id,
                'fecha' => $sabado->format('Y-m-d'),
            ]);
            $entrega->capturado_por_id = $usuarioId;
            $entrega->estado = 'ABIERTA';
        }

        // Mientras esté abierta, "debe entregar" se mantiene al día.
        if (! $entrega->estaCerrada()) {
            $entrega->debe_entregar = $this->debeEntregar($grupo->id, $sabado);
            $entrega->save();
        }

        return $entrega;
    }

    /**
     * Captura del supervisor: entregó, faltante, adelantado, préstamo, comisión.
     * No puede tocar "debe entregar" ni una entrega ya cerrada.
     *
     * @param  array{prestamo?:int, entrego?:int, faltante?:int, adelantado?:int,
     *              comision?:int, notas?:string|null}  $datos
     */
    public function capturar(EntregaSemanal $entrega, array $datos, int $usuarioId): EntregaSemanal
    {
        if ($entrega->estaCerrada()) {
            throw new RuntimeException('Esta semana ya está cerrada; solo el admin puede reabrirla.');
        }

        $entrega->prestamo = $datos['prestamo'] ?? 0;
        $entrega->entrego = $datos['entrego'] ?? 0;
        $entrega->faltante = $datos['faltante'] ?? 0;
        $entrega->adelantado = $datos['adelantado'] ?? 0;
        // La comisión no la captura el supervisor: se conserva si no viene.
        $entrega->comision = $datos['comision'] ?? $entrega->comision ?? 0;
        $entrega->notas = $datos['notas'] ?? $entrega->notas;
        $entrega->saldo = $entrega->entrego - $entrega->debe_entregar;
        $entrega->capturado_por_id = $entrega->capturado_por_id ?? $usuarioId;
        $entrega->save();

        return $entrega;
    }

    /**
     * Cierre de semana (solo admin): consolida y bloquea la entrega. "Debe
     * entregar" queda congelado con el valor del momento del cierre.
     */
    public function cerrar(EntregaSemanal $entrega, int $usuarioId): EntregaSemanal
    {
        return DB::transaction(function () use ($entrega, $usuarioId) {
            if ($entrega->estaCerrada()) {
                throw new RuntimeException('Esta semana ya estaba cerrada.');
            }

            $entrega->debe_entregar = $this->debeEntregar($entrega->grupo_id,
                Fechas::parse($entrega->fecha->format('Y-m-d')));
            $entrega->saldo = $entrega->entrego - $entrega->debe_entregar;
            $entrega->estado = 'CERRADA';
            $entrega->cerrado_por_id = $usuarioId;
            $entrega->cerrado_en = now();
            $entrega->save();

            return $entrega;
        });
    }

    /**
     * Renovaciones de un grupo cuyo primer abono cae en ese sábado, juntas
     * (punto 6: comparar las que renovaron la misma semana).
     *
     * @return \Illuminate\Support\Collection<int, \App\Models\Credito>
     */
    public function renovacionesDelSabado(int $grupoId, DateTimeImmutable $sabado)
    {
        return \App\Models\Credito::where('grupo_id', $grupoId)
            ->where('es_renovacion', true)
            ->whereDate('fecha_primer_abono', $sabado->format('Y-m-d'))
            ->with(['cliente:id,nombre,folio', 'renovadoDe:id,folio'])
            ->orderBy('folio')
            ->get();
    }

    /**
     * Resumen del cierre semanal de un grupo, con el dinero físico separado de
     * lo liquidado por renovación (punto 7). Así el cierre cuadra.
     *
     * @return array<string, mixed>
     */
    public function resumenCierre(int $grupoId, DateTimeImmutable $sabado): array
    {
        $entrega = EntregaSemanal::where('grupo_id', $grupoId)
            ->whereDate('fecha', $sabado->format('Y-m-d'))->first();

        $renovaciones = $this->renovacionesDelSabado($grupoId, $sabado);

        $debeCobrar = $this->debeEntregar($grupoId, $sabado);
        $cobradoNormal = $this->cobradoDelSabado($grupoId, $sabado);

        $saldosLiquidados = (int) $renovaciones->sum('descuento_renovacion');
        $netoRenovados = (int) $renovaciones->sum(fn ($c) => $c->netoEntregado());

        $entrego = (int) ($entrega->entrego ?? 0);
        $adelantos = (int) ($entrega->adelantado ?? 0);
        $faltantes = (int) ($entrega->faltante ?? 0);

        return [
            'debe_cobrar' => $debeCobrar,
            'cobrado_normal' => $cobradoNormal,
            'adelantos' => $adelantos,
            'renovaciones' => $renovaciones,          // colección para listarlas
            'renovaciones_count' => $renovaciones->count(),
            'saldos_liquidados' => $saldosLiquidados,  // NO es dinero físico
            'neto_renovados' => $netoRenovados,        // dinero que salió a la clienta
            'faltantes' => $faltantes,
            'entrego_fisico' => $entrego,
            'diferencia' => $entrego - $debeCobrar,
            'entrega' => $entrega,
        ];
    }

    /** Reabrir una semana cerrada (solo admin, deja rastro en bitácora aparte). */
    public function reabrir(EntregaSemanal $entrega): EntregaSemanal
    {
        $entrega->estado = 'ABIERTA';
        $entrega->cerrado_por_id = null;
        $entrega->cerrado_en = null;
        $entrega->save();

        return $entrega;
    }
}
