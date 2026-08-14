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
}
