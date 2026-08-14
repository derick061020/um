<?php

namespace App\Models;

use App\Support\Documentos;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes';

    protected $fillable = [
        'folio', 'nombre', 'telefono', 'domicilio', 'colonia', 'ciudad', 'curp',
        'aval_nombre', 'aval_telefono', 'aval_parentesco',
        'aval_domicilio', 'aval_colonia', 'aval_ciudad',
        'grupo_id', 'activo', 'notas', 'capturado_por_id',
    ];

    protected function casts(): array
    {
        return ['activo' => 'boolean'];
    }

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class, 'grupo_id');
    }

    public function creditos(): HasMany
    {
        return $this->hasMany(Credito::class, 'cliente_id');
    }

    public function documentos(): HasMany
    {
        return $this->hasMany(Documento::class, 'cliente_id');
    }

    public function capturadoPor(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'capturado_por_id');
    }

    public function folioFormateado(): string
    {
        return str_pad((string) $this->folio, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Documentos obligatorios que todavía faltan en el expediente.
     *
     * @return array<int, string>
     */
    public function documentosFaltantes(): array
    {
        $tiene = $this->documentos->pluck('tipo')->all();

        return array_values(array_diff(Documentos::OBLIGATORIOS, $tiene));
    }
}
