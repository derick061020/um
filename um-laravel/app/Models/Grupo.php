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
        'nombre', 'plaza', 'activo', 'notas', 'supervisor_id', 'encargada_id', 'creado_por_id',
    ];

    protected function casts(): array
    {
        return ['activo' => 'boolean'];
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
