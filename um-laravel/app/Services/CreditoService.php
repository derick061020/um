<?php

namespace App\Services;

use App\Models\Abono;
use App\Models\Cliente;
use App\Models\Credito;
use App\Models\Pago;
use App\Support\Dinero;
use App\Support\Fechas;
use DateTimeImmutable;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CreditoService
{
    /**
     * Da de alta el crédito y su calendario completo en una sola transacción.
     * El calendario se deriva de la fecha de entrega: 12 sábados consecutivos,
     * el primero cinco días después del lunes de entrega.
     *
     * @param  array{cliente_id:int, grupo_id?:int|null, monto_prestado:int, monto_total:int,
     *              num_semanas:int, fecha_entrega:string, notas?:string|null, capturado_por_id:int}  $datos
     */
    public function crear(array $datos): Credito
    {
        $entrega = Fechas::parse($datos['fecha_entrega']);
        $semanas = $datos['num_semanas'];
        $calendario = Fechas::generarCalendario($entrega, $semanas);
        $montos = Dinero::repartirAbonos($datos['monto_total'], $semanas);

        return DB::transaction(function () use ($datos, $entrega, $calendario, $montos, $semanas) {
            $credito = Credito::create([
                'folio' => $this->siguienteFolio(Credito::class),
                'cliente_id' => $datos['cliente_id'],
                'grupo_id' => $datos['grupo_id'] ?? null,
                'monto_prestado' => $datos['monto_prestado'],
                'monto_total' => $datos['monto_total'],
                'abono_semanal' => $montos[0],
                'num_semanas' => $semanas,
                'fecha_entrega' => $entrega->format('Y-m-d'),
                'fecha_primer_abono' => $calendario[0]['iso'],
                'fecha_vencimiento' => $calendario[count($calendario) - 1]['iso'],
                'estado' => 'ACTIVO',
                'notas' => $datos['notas'] ?? null,
                'capturado_por_id' => $datos['capturado_por_id'],
            ]);

            $filas = [];
            foreach ($calendario as $i => $fila) {
                $filas[] = [
                    'credito_id' => $credito->id,
                    'semana' => $fila['semana'],
                    'fecha_programada' => $fila['iso'],
                    'monto_esperado' => $montos[$i],
                    'monto_pagado' => 0,
                    'estado' => 'PENDIENTE',
                ];
            }
            Abono::insert($filas);

            return $credito;
        });
    }

    /**
     * SQLite solo permite autoincremento en la llave primaria, así que el folio
     * visible se asigna aquí, dentro de la transacción.
     *
     * @param  class-string<\Illuminate\Database\Eloquent\Model>  $modelo
     */
    public function siguienteFolio(string $modelo): int
    {
        return ((int) $modelo::max('folio')) + 1;
    }

    /**
     * Registra un pago contra un abono concreto y deja el abono y el crédito
     * con el estado que corresponde. Devuelve el abono actualizado.
     */
    public function registrarPago(
        int $abonoId,
        int $monto,
        int $registradoPorId,
        ?string $fechaISO = null,
        ?string $nota = null,
    ): Abono {
        if ($monto <= 0) {
            throw new RuntimeException('El monto del abono debe ser mayor a cero.');
        }

        $fecha = $fechaISO ? Fechas::parse($fechaISO) : Fechas::hoy();

        return DB::transaction(function () use ($abonoId, $monto, $registradoPorId, $fecha, $nota) {
            $abono = Abono::lockForUpdate()->find($abonoId);
            if (! $abono) {
                throw new RuntimeException('No se encontró el abono.');
            }

            Pago::create([
                'credito_id' => $abono->credito_id,
                'abono_id' => $abono->id,
                'monto' => $monto,
                'fecha' => $fecha->format('Y-m-d'),
                'nota' => $nota,
                'registrado_por_id' => $registradoPorId,
            ]);

            $pagado = $abono->monto_pagado + $monto;
            $abono->monto_pagado = $pagado;
            $abono->estado = self::estadoDeAbono($pagado, $abono->monto_esperado);
            $abono->pagado_en = $pagado >= $abono->monto_esperado ? now() : $abono->pagado_en;
            $abono->save();

            $this->refrescarCredito($abono->credito_id);

            return $abono;
        });
    }

    /** Deja el abono exactamente en "pagado completo" (botón de un toque del sábado). */
    public function marcarCompleto(int $abonoId, int $registradoPorId, ?string $fechaISO = null): Abono
    {
        $abono = Abono::find($abonoId);
        if (! $abono) {
            throw new RuntimeException('No se encontró el abono.');
        }

        $falta = $abono->monto_esperado - $abono->monto_pagado;
        if ($falta <= 0) {
            return $abono;
        }

        return $this->registrarPago($abonoId, $falta, $registradoPorId, $fechaISO, 'Abono completo');
    }

    /** Cancela el último movimiento de un abono (corrección de captura). */
    public function anularUltimoPago(int $abonoId, int $registradoPorId): Abono
    {
        return DB::transaction(function () use ($abonoId) {
            $abono = Abono::lockForUpdate()->find($abonoId);
            if (! $abono) {
                throw new RuntimeException('No se encontró el abono.');
            }

            $ultimo = Pago::where('abono_id', $abono->id)
                ->where('anulado', false)
                ->orderByDesc('created_at')
                ->orderByDesc('id')
                ->first();

            if (! $ultimo) {
                throw new RuntimeException('Este abono no tiene movimientos que anular.');
            }

            $ultimo->anulado = true;
            $ultimo->nota = trim(($ultimo->nota ?? '').' (anulado)');
            $ultimo->save();

            $pagado = max(0, $abono->monto_pagado - $ultimo->monto);
            $abono->monto_pagado = $pagado;
            $abono->estado = self::estadoDeAbono($pagado, $abono->monto_esperado);
            $abono->pagado_en = $pagado >= $abono->monto_esperado ? $abono->pagado_en : null;
            $abono->save();

            $this->refrescarCredito($abono->credito_id);

            return $abono;
        });
    }

    public static function estadoDeAbono(int $pagado, int $esperado): string
    {
        if ($pagado <= 0) {
            return 'PENDIENTE';
        }

        if ($pagado >= $esperado) {
            return 'PAGADO';
        }

        return 'PARCIAL';
    }

    /** Recalcula si el crédito quedó liquidado o vencido tras un movimiento. */
    public function refrescarCredito(int $creditoId): void
    {
        $credito = Credito::with('abonos:id,credito_id,monto_pagado')->find($creditoId);
        if (! $credito || $credito->estado === 'CANCELADO') {
            return;
        }

        $pagado = $credito->abonos->sum('monto_pagado');
        $liquidado = $pagado >= $credito->monto_total;
        $vencido = ! $liquidado && $credito->fecha_vencimiento->format('Y-m-d') < Fechas::hoy()->format('Y-m-d');

        $estado = $liquidado ? 'LIQUIDADO' : ($vencido ? 'VENCIDO' : 'ACTIVO');

        if ($estado !== $credito->estado) {
            $credito->estado = $estado;
            $credito->liquidado_en = $liquidado ? now() : null;
            $credito->save();
        }
    }

    /**
     * Resumen de un crédito a una fecha de referencia.
     *
     * @param  \Illuminate\Support\Collection<int, Abono>  $abonos
     * @return array{total_pagado:int, saldo:int, abonos_pagados:int, abonos_pendientes:int,
     *               atraso_centavos:int, semanas_atrasadas:int}
     */
    public static function resumir(Credito $credito, $abonos, ?DateTimeImmutable $referencia = null): array
    {
        $referencia ??= Fechas::hoy();
        $ref = $referencia->format('Y-m-d');

        $totalPagado = 0;
        $esperadoALaFecha = 0;
        $pagadoDeVencidos = 0;
        $abonosPagados = 0;
        $abonosPendientes = 0;
        $semanasAtrasadas = 0;

        foreach ($abonos as $a) {
            $totalPagado += $a->monto_pagado;

            if ($a->estado === 'PAGADO') {
                $abonosPagados++;
            } else {
                $abonosPendientes++;
            }

            if ($a->fecha_programada->format('Y-m-d') <= $ref) {
                $esperadoALaFecha += $a->monto_esperado;
                $pagadoDeVencidos += $a->monto_pagado;

                if ($a->estado !== 'PAGADO') {
                    $semanasAtrasadas++;
                }
            }
        }

        return [
            'total_pagado' => $totalPagado,
            'saldo' => max(0, $credito->monto_total - $totalPagado),
            'abonos_pagados' => $abonosPagados,
            'abonos_pendientes' => $abonosPendientes,
            'atraso_centavos' => max(0, $esperadoALaFecha - $pagadoDeVencidos),
            'semanas_atrasadas' => $semanasAtrasadas,
        ];
    }

    /**
     * Marca como VENCIDOS los créditos que pasaron su fecha de vencimiento
     * sin liquidar. Se ejecuta al abrir el panel, no requiere tarea programada.
     */
    public function actualizarVencidos(): int
    {
        return Credito::where('estado', 'ACTIVO')
            ->whereDate('fecha_vencimiento', '<', Fechas::hoy()->format('Y-m-d'))
            ->update(['estado' => 'VENCIDO']);
    }

    /** Siguiente folio para una clienta nueva. */
    public function siguienteFolioCliente(): int
    {
        return $this->siguienteFolio(Cliente::class);
    }

    /**
     * Cambia el abono semanal a partir de una semana. Los abonos YA COBRADOS
     * conservan su monto original; el nuevo monto se aplica desde la semana
     * seleccionada en adelante (solo a los que no están pagados). El total de
     * la tarjeta se recalcula automáticamente.
     *
     * @return array{antes: array<string,mixed>, despues: array<string,mixed>}
     */
    public function ajustarAbono(int $creditoId, int $desdeSemana, int $nuevoAbono, int $usuarioId): array
    {
        if ($nuevoAbono <= 0) {
            throw new RuntimeException('El nuevo abono debe ser mayor a cero.');
        }

        return DB::transaction(function () use ($creditoId, $desdeSemana, $nuevoAbono) {
            $credito = Credito::with('abonos')->lockForUpdate()->find($creditoId);
            if (! $credito) {
                throw new RuntimeException('No se encontró el crédito.');
            }

            $antes = ['abono_semanal' => $credito->abono_semanal, 'monto_total' => $credito->monto_total];

            foreach ($credito->abonos as $abono) {
                // Los ya cobrados no se tocan: conservan su monto original.
                if ($abono->semana < $desdeSemana || $abono->estado === 'PAGADO') {
                    continue;
                }

                $abono->monto_esperado = $nuevoAbono;
                $abono->estado = self::estadoDeAbono($abono->monto_pagado, $nuevoAbono);
                $abono->pagado_en = $abono->monto_pagado >= $nuevoAbono ? ($abono->pagado_en ?? now()) : null;
                $abono->save();
            }

            // El total de la tarjeta = suma de todos los abonos (viejos + nuevos).
            $credito->monto_total = (int) $credito->abonos()->sum('monto_esperado');
            $credito->abono_semanal = $nuevoAbono;
            $credito->save();

            $this->refrescarCredito($credito->id);

            $fresco = $credito->fresh();

            return [
                'antes' => $antes,
                'despues' => ['abono_semanal' => $nuevoAbono, 'monto_total' => $fresco->monto_total],
            ];
        });
    }

    /** Saldo pendiente de un crédito, en centavos (nunca negativo). */
    public function saldoPendiente(Credito $credito): int
    {
        $pagado = (int) $credito->abonos()->sum('monto_pagado');

        return max(0, $credito->monto_total - $pagado);
    }

    /**
     * Renovación: una clienta liquida su crédito y arranca otro desde la
     * semana 1. El crédito anterior NO se borra: queda marcado como RENOVADO,
     * con su historial completo, y el nuevo queda enlazado a él.
     *
     * @param  array{grupo_id?:int|null, monto_prestado:int, monto_total:int,
     *              num_semanas:int, fecha_entrega:string, notas?:string|null}  $datosNuevo
     * @return array{anterior: Credito, nuevo: Credito, saldo_liquidado: int}
     */
    public function renovar(int $creditoAnteriorId, array $datosNuevo, int $usuarioId): array
    {
        return DB::transaction(function () use ($creditoAnteriorId, $datosNuevo, $usuarioId) {
            $anterior = Credito::with('abonos')->lockForUpdate()->find($creditoAnteriorId);
            if (! $anterior) {
                throw new RuntimeException('No se encontró el crédito anterior.');
            }
            if (! $anterior->estaAbierto()) {
                throw new RuntimeException('Ese crédito ya no está abierto; no se puede renovar.');
            }
            // Solo en el último pago: le queda a lo sumo un abono por cubrir.
            if (! $anterior->puedeRenovar()) {
                throw new RuntimeException(
                    'La renovación solo se activa en el último pago. A esta clienta le faltan '
                    .$anterior->pendientes().' pagos por cubrir.'
                );
            }

            $saldo = $this->saldoPendiente($anterior);

            // El anterior queda liquidado por renovación, sin perder su historial.
            $anterior->estado = 'RENOVADO';
            $anterior->liquidado_en = now();
            $anterior->notas = trim(($anterior->notas ?? '')
                ."\nLiquidado por renovación el ".Fechas::hoy()->format('d/m/Y')
                .'. Saldo liquidado: '.Dinero::pesos($saldo).'.');
            $anterior->save();

            // Nuevo crédito, semana 1, enlazado al anterior. El descuento por
            // renovación se guarda para poder calcular el neto y cuadrar el cierre.
            $nuevo = $this->crear([
                'cliente_id' => $anterior->cliente_id,
                'grupo_id' => $datosNuevo['grupo_id'] ?? $anterior->grupo_id,
                'monto_prestado' => $datosNuevo['monto_prestado'],
                'monto_total' => $datosNuevo['monto_total'],
                'num_semanas' => $datosNuevo['num_semanas'],
                'fecha_entrega' => $datosNuevo['fecha_entrega'],
                'notas' => $datosNuevo['notas'] ?? null,
                'capturado_por_id' => $usuarioId,
            ]);

            $nuevo->renovado_de_id = $anterior->id;
            $nuevo->es_renovacion = true;
            $nuevo->descuento_renovacion = $saldo;
            $nuevo->save();

            return [
                'anterior' => $anterior,
                'nuevo' => $nuevo,
                'saldo_liquidado' => $saldo,
                'neto_entregado' => $nuevo->netoEntregado(),
            ];
        });
    }

    /**
     * Corrección del admin: reconstruye el calendario del crédito (semanas,
     * montos, fecha) conservando el total ya pagado, que se reparte de nuevo
     * sobre los abonos nuevos. Devuelve el antes/después para la bitácora.
     *
     * @param  array{monto_prestado?:int, monto_total?:int, num_semanas?:int,
     *              fecha_entrega?:string, estado?:string, notas?:string|null}  $cambios
     * @return array{antes: array<string,mixed>, despues: array<string,mixed>}
     */
    public function corregir(int $creditoId, array $cambios, int $usuarioId): array
    {
        return DB::transaction(function () use ($creditoId, $cambios) {
            $credito = Credito::with('abonos')->lockForUpdate()->find($creditoId);
            if (! $credito) {
                throw new RuntimeException('No se encontró el crédito.');
            }

            $antes = [
                'monto_prestado' => $credito->monto_prestado,
                'monto_total' => $credito->monto_total,
                'num_semanas' => $credito->num_semanas,
                'fecha_entrega' => $credito->fecha_entrega->format('Y-m-d'),
                'estado' => $credito->estado,
            ];

            $totalPagado = (int) $credito->abonos->sum('monto_pagado');

            $credito->monto_prestado = $cambios['monto_prestado'] ?? $credito->monto_prestado;
            $credito->monto_total = $cambios['monto_total'] ?? $credito->monto_total;
            $credito->num_semanas = $cambios['num_semanas'] ?? $credito->num_semanas;
            if (isset($cambios['estado'])) {
                $credito->estado = $cambios['estado'];
            }
            if (array_key_exists('notas', $cambios)) {
                $credito->notas = $cambios['notas'];
            }

            $entrega = isset($cambios['fecha_entrega'])
                ? Fechas::parse($cambios['fecha_entrega'])
                : Fechas::parse($credito->fecha_entrega->format('Y-m-d'));

            $calendario = Fechas::generarCalendario($entrega, $credito->num_semanas);
            $montos = Dinero::repartirAbonos($credito->monto_total, $credito->num_semanas);

            $credito->fecha_entrega = $entrega->format('Y-m-d');
            $credito->fecha_primer_abono = $calendario[0]['iso'];
            $credito->fecha_vencimiento = $calendario[count($calendario) - 1]['iso'];
            $credito->abono_semanal = $montos[0];
            $credito->save();

            // Se rehace el calendario. Los pagos históricos se conservan (su
            // abono_id queda en nulo al borrarse el abono); el total pagado se
            // reparte de nuevo sobre los abonos nuevos, en orden.
            Abono::where('credito_id', $credito->id)->delete();

            $pool = $totalPagado;
            $filas = [];
            foreach ($calendario as $i => $fila) {
                $aplica = min($pool, $montos[$i]);
                $pool -= $aplica;
                $filas[] = [
                    'credito_id' => $credito->id,
                    'semana' => $fila['semana'],
                    'fecha_programada' => $fila['iso'],
                    'monto_esperado' => $montos[$i],
                    'monto_pagado' => $aplica,
                    'estado' => self::estadoDeAbono($aplica, $montos[$i]),
                    'pagado_en' => $aplica >= $montos[$i] ? now() : null,
                ];
            }
            Abono::insert($filas);

            $this->refrescarCredito($credito->id);

            $despues = [
                'monto_prestado' => $credito->monto_prestado,
                'monto_total' => $credito->monto_total,
                'num_semanas' => $credito->num_semanas,
                'fecha_entrega' => $credito->fecha_entrega->format('Y-m-d'),
                'estado' => $credito->fresh()->estado,
            ];

            return ['antes' => $antes, 'despues' => $despues];
        });
    }
}
