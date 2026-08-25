<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Amplía la operación según el resumen funcional:
 *  - grupos con ubicación, zona, municipio, estado, colonia y código;
 *  - renovación de crédito (enlace al crédito anterior, sin borrar historial);
 *  - entregas semanales del supervisor por grupo y sábado, con cierre del admin.
 *
 * Es aditiva: solo agrega columnas y tablas, nunca toca ni borra lo existente,
 * así el servidor la aplica sobre la base que ya está en producción.
 *
 * Nota SQLite: al agregar columnas a una tabla que ya existe NO se ponen claves
 * foráneas a nivel de base (SQLite no lo permite por ALTER). Las relaciones se
 * resuelven en Eloquent; solo se indexan las columnas.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('grupos', function (Blueprint $table) {
            $table->string('codigo')->nullable()->unique()->after('id');
            $table->string('estado')->nullable()->after('plaza');
            $table->string('municipio')->nullable()->after('estado');
            $table->string('zona')->nullable()->after('municipio');
            $table->string('colonia')->nullable()->after('zona');
            $table->string('ubicacion')->nullable()->after('colonia');
        });

        Schema::table('creditos', function (Blueprint $table) {
            // Crédito del que proviene esta renovación (el anterior, ya liquidado).
            $table->unsignedBigInteger('renovado_de_id')->nullable()->after('grupo_id');
            $table->boolean('es_renovacion')->default(false)->after('renovado_de_id');
            $table->index('renovado_de_id');
        });

        Schema::create('entregas_semanales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grupo_id')->constrained('grupos')->cascadeOnDelete();
            $table->date('fecha');                 // el sábado de cobro

            // "Debe entregar" lo calcula el sistema (suma de abonos del sábado).
            // Se guarda como foto del momento en que se captura/cierra.
            $table->integer('debe_entregar')->default(0);

            // Lo que captura el supervisor:
            $table->integer('prestamo')->default(0);     // préstamos entregados esa semana
            $table->integer('entrego')->default(0);      // dinero que realmente entregó
            $table->integer('faltante')->default(0);
            $table->integer('adelantado')->default(0);
            $table->integer('comision')->default(0);
            $table->integer('saldo')->default(0);
            $table->text('notas')->nullable();

            $table->string('estado')->default('ABIERTA'); // ABIERTA | CERRADA
            $table->foreignId('capturado_por_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->foreignId('cerrado_por_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->timestamp('cerrado_en')->nullable();
            $table->timestamps();

            $table->unique(['grupo_id', 'fecha']);
            $table->index(['fecha', 'estado']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entregas_semanales');

        Schema::table('creditos', function (Blueprint $table) {
            $table->dropColumn(['renovado_de_id', 'es_renovacion']);
        });

        Schema::table('grupos', function (Blueprint $table) {
            $table->dropColumn(['codigo', 'estado', 'municipio', 'zona', 'colonia', 'ubicacion']);
        });
    }
};
