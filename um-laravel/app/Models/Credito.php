<?php

namespace App\Models;

use App\Support\Dinero;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Credito extends Model
{
    use HasFactory;

    protected $table = 'creditos';

    protected $fillable = [
        'folio', 'cliente_id', 'grupo_id', 'renovado_de_id', 'es_renovacion', 'descuento_renovacion',
        'monto_prestado', 'monto_total', 'abono_semanal', 'num_semanas',
        'fecha_entrega', 'fecha_primer_abono', 'fecha_vencimiento',
        'estado', 'liquidado_en', 'notas', 'capturado_por_id',
    ];

    protected function casts(): array
    {
        return [
            'fecha_entrega' => 'date',
            'fecha_primer_abono' => 'date',
            'fecha_vencimiento' => 'date',
            'liquidado_en' => 'datetime',
            'es_renovacion' => 'boolean',
        ];
    }

    /** Total pagado del crédito, en centavos. */
    public function pagado(): int
    {
        // Usa el agregado 'pagado' si viene precargado; si no, lo calcula.
        if (array_key_exists('pagado', $this->attributes)) {
            return (int) $this->attributes['pagado'];
        }

        return (int) ($this->relationLoaded('abonos')
            ? $this->abonos->sum('monto_pagado')
            : $this->abonos()->sum('monto_pagado'));
    }

    public function saldo(): int
    {
        return max(0, $this->monto_total - $this->pagado());
    }

    /** Semana en la que va: el primer abono no pagado (o la última si ya cerró). */
    public function semanaActual(): int
    {
        $abonos = $this->relationLoaded('abonos') ? $this->abonos : $this->abonos()->get();
        $pendiente = $abonos->firstWhere('estado', '!=', 'PAGADO');

        return $pendiente?->semana ?? $this->num_semanas;
    }

    public function abonosPagados(): int
    {
        $abonos = $this->relationLoaded('abonos') ? $this->abonos : $this->abonos()->get();

        return $abonos->where('estado', 'PAGADO')->count();
    }

    /** Cuántos abonos faltan por cubrir por completo. */
    public function pendientes(): int
    {
        return $this->num_semanas - $this->abonosPagados();
    }

    /**
     * Solo se puede renovar cuando la clienta va en su ÚLTIMO pago: le queda a
     * lo sumo un abono por cubrir y el crédito sigue abierto.
     */
    public function puedeRenovar(): bool
    {
        return $this->estaAbierto() && $this->pendientes() <= 1;
    }

    /** El crédito anterior del que salió esta renovación. */
    public function renovadoDe(): BelongsTo
    {
        return $this->belongsTo(Credito::class, 'renovado_de_id');
    }

    /** La renovación que reemplazó a este crédito, si la hubo. */
    public function renovacion(): HasMany
    {
        return $this->hasMany(Credito::class, 'renovado_de_id');
    }

    public function estaAbierto(): bool
    {
        return in_array($this->estado, ['ACTIVO', 'VENCIDO'], true);
    }

    /** Cantidad neta que recibió la clienta: el préstamo menos el descuento por renovación. */
    public function netoEntregado(): int
    {
        return $this->monto_prestado - ($this->descuento_renovacion ?? 0);
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class, 'grupo_id');
    }

    public function abonos(): HasMany
    {
        return $this->hasMany(Abono::class, 'credito_id')->orderBy('semana');
    }

    public function pagos(): HasMany
    {
        return $this->hasMany(Pago::class, 'credito_id');
    }

    public function capturadoPor(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'capturado_por_id');
    }

    public function folioFormateado(): string
    {
        return str_pad((string) $this->folio, 4, '0', STR_PAD_LEFT);
    }

    public function totalFormateado(): string
    {
        return Dinero::pesos($this->monto_total);
    }
}
