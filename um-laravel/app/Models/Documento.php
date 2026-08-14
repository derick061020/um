<?php

namespace App\Models;

use App\Support\Documentos as Cat;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Documento extends Model
{
    use HasFactory;

    protected $table = 'documentos';

    protected $fillable = [
        'cliente_id', 'tipo', 'descripcion', 'archivo', 'mime', 'bytes', 'ancho', 'alto', 'subido_por_id',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function subidoPor(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'subido_por_id');
    }

    public function etiquetaTipo(): string
    {
        return Cat::etiqueta($this->tipo);
    }

    public function pesoLegible(): string
    {
        return Cat::pesoLegible($this->bytes);
    }
}
