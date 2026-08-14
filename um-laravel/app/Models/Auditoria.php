<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Auditoria extends Model
{
    use HasFactory;

    protected $table = 'auditorias';

    protected $fillable = ['usuario_id', 'accion', 'entidad', 'entidad_id', 'detalle', 'ip'];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    /** El detalle se guarda como JSON en texto (SQLite no tiene tipo JSON). */
    public function detalleLegible(): string
    {
        if (! $this->detalle) {
            return '';
        }

        $datos = json_decode($this->detalle, true);
        if (! is_array($datos)) {
            return (string) $this->detalle;
        }

        $partes = [];
        foreach ($datos as $clave => $valor) {
            $partes[] = $clave.': '.(is_scalar($valor) ? $valor : json_encode($valor, JSON_UNESCAPED_UNICODE));
        }

        return implode(' · ', $partes);
    }
}
