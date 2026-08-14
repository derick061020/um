<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Abono extends Model
{
    use HasFactory;

    protected $table = 'abonos';

    public $timestamps = false;

    protected $fillable = [
        'credito_id', 'semana', 'fecha_programada',
        'monto_esperado', 'monto_pagado', 'estado', 'pagado_en',
    ];

    protected function casts(): array
    {
        return [
            'fecha_programada' => 'date',
            'pagado_en' => 'datetime',
        ];
    }

    public function credito(): BelongsTo
    {
        return $this->belongsTo(Credito::class, 'credito_id');
    }

    public function pagos(): HasMany
    {
        return $this->hasMany(Pago::class, 'abono_id');
    }

    public function falta(): int
    {
        return max(0, $this->monto_esperado - $this->monto_pagado);
    }
}
