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
        'folio', 'cliente_id', 'grupo_id', 'renovado_de_id', 'es_renovacion',
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
