<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Guarda, en cada crédito de renovación, cuánto se descontó para liquidar el
 * préstamo anterior. Con eso el cierre del supervisor puede separar el dinero
 * físico de los saldos liquidados por renovación (que NO son efectivo).
 *
 * Aditiva: solo agrega una columna.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('creditos', function (Blueprint $table) {
            $table->integer('descuento_renovacion')->default(0)->after('es_renovacion');
        });
    }

    public function down(): void
    {
        Schema::table('creditos', function (Blueprint $table) {
            $table->dropColumn('descuento_renovacion');
        });
    }
};
