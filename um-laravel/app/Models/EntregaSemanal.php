<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Entrega semanal de un grupo: la hoja física que llena el supervisor cada
 * sábado. "Debe entregar" lo calcula el sistema; el supervisor captura lo que
 * realmente entregó, faltantes y adelantos. El admin la cierra al final.
 */
class EntregaSemanal extends Model
{
    use HasFactory;

    protected $table = 'entregas_semanales';

    protected $fillable = [
        'grupo_id', 'fecha', 'debe_entregar', 'prestamo', 'entrego',
        'faltante', 'adelantado', 'comision', 'saldo', 'notas',
        'estado', 'capturado_por_id', 'cerrado_por_id', 'cerrado_en',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'cerrado_en' => 'datetime',
        ];
    }

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class, 'grupo_id');
    }

    public function capturadoPor(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'capturado_por_id');
    }

    public function cerradoPor(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'cerrado_por_id');
    }

    public function estaCerrada(): bool
    {
        return $this->estado === 'CERRADA';
    }

    /** Diferencia entre lo que entregó y lo que debía: + adelanto, − faltante. */
    public function diferencia(): int
    {
        return $this->entrego - $this->debe_entregar;
    }
}
