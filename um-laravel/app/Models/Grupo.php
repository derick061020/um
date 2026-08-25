<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Grupo extends Model
{
    use HasFactory;

    protected $table = 'grupos';

    protected $fillable = [
        'codigo', 'nombre', 'plaza', 'estado', 'municipio', 'zona', 'colonia', 'ubicacion',
        'activo', 'notas', 'supervisor_id', 'encargada_id', 'creado_por_id',
    ];

    protected function casts(): array
    {
        return ['activo' => 'boolean'];
    }

    /** Código legible del grupo: GR-000004, o el que se haya capturado. */
    public function codigoFormateado(): string
    {
        return $this->codigo ?: 'GR-'.str_pad((string) $this->id, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Grupos que un usuario puede ver, según su rol:
     * dirección y capturista ven todos; el supervisor y la encargada,
     * únicamente los suyos.
     *
     * @return \Illuminate\Database\Eloquent\Builder<Grupo>
     */
    public static function visiblesPara(Usuario $usuario)
    {
        $q = static::query();

        return match ($usuario->rol) {
            \App\Support\Rbac::SUPERVISOR => $q->where('supervisor_id', $usuario->id),
            \App\Support\Rbac::ENCARGADA => $q->where('encargada_id', $usuario->id),
            default => $q,
        };
    }

    public function entregas(): HasMany
    {
        return $this->hasMany(EntregaSemanal::class, 'grupo_id');
    }

    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'supervisor_id');
    }

    public function encargada(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'encargada_id');
    }

    public function clientas(): HasMany
    {
        return $this->hasMany(Cliente::class, 'grupo_id');
    }

    public function creditos(): HasMany
    {
        return $this->hasMany(Credito::class, 'grupo_id');
    }
}
