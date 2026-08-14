<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pago extends Model
{
    use HasFactory;

    protected $table = 'pagos';

    protected $fillable = [
        'credito_id', 'abono_id', 'monto', 'fecha', 'nota', 'anulado', 'registrado_por_id',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'anulado' => 'boolean',
        ];
    }

    public function credito(): BelongsTo
    {
        return $this->belongsTo(Credito::class, 'credito_id');
    }

    public function abono(): BelongsTo
    {
        return $this->belongsTo(Abono::class, 'abono_id');
    }

    public function registradoPor(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'registrado_por_id');
    }
}
