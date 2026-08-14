<?php

namespace App\Models;

use App\Support\Rbac;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'nombre', 'usuario', 'password_hash', 'rol', 'activo', 'telefono', 'creado_por_id',
    ];

    protected $hidden = ['password_hash', 'remember_token'];

    protected function casts(): array
    {
        return ['activo' => 'boolean'];
    }

    /** Laravel busca `password`; aquí la columna se llama `password_hash`. */
    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }

    // --- Permisos -----------------------------------------------------------

    public function puede(string $permiso): bool
    {
        return $this->activo && Rbac::puede($this->rol, $permiso);
    }

    /** @param array<int, string> $permisos */
    public function puedeAlguno(array $permisos): bool
    {
        return $this->activo && Rbac::puedeAlguno($this->rol, $permisos);
    }

    public function etiquetaRol(): string
    {
        return Rbac::etiqueta($this->rol);
    }

    public function rutaInicio(): string
    {
        return Rbac::rutaInicio($this->rol);
    }

    // --- Relaciones ---------------------------------------------------------

    public function gruposSupervisados(): HasMany
    {
        return $this->hasMany(Grupo::class, 'supervisor_id');
    }

    public function gruposEncargados(): HasMany
    {
        return $this->hasMany(Grupo::class, 'encargada_id');
    }

    public function movimientos(): HasMany
    {
        return $this->hasMany(Auditoria::class, 'usuario_id');
    }
}
