<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Esquema del CRM de Mujeres Unidas.
 *
 * Todos los importes se guardan en CENTAVOS (enteros) para evitar errores de
 * redondeo. Las fechas de calendario (entrega, abonos, pagos) son `date`, sin
 * hora, para que la zona del servidor nunca corra un día.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('usuario')->unique();   // login corto, sin correo
            $table->string('password_hash');
            $table->string('rol');                 // PRINCIPAL | SUPERVISOR | CAPTURISTA | ENCARGADA
            $table->boolean('activo')->default(true);
            $table->string('telefono')->nullable();
            $table->foreignId('creado_por_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->rememberToken();
            $table->timestamps();

            $table->index(['rol', 'activo']);
        });

        Schema::create('grupos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();    // "VIRI 1", "CHIHUAHUA 1"
            $table->string('plaza')->nullable();   // ciudad / zona
            $table->boolean('activo')->default(true);
            $table->text('notas')->nullable();
            $table->foreignId('supervisor_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->foreignId('encargada_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->foreignId('creado_por_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->timestamps();

            $table->index('activo');
        });

        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('folio')->unique();
            $table->string('nombre');

            $table->string('telefono')->nullable();
            $table->string('domicilio')->nullable();
            $table->string('colonia')->nullable();
            $table->string('ciudad')->nullable();
            $table->string('curp')->nullable();

            // Aval — dato obligatorio en la operación de Mujeres Unidas
            $table->string('aval_nombre')->nullable();
            $table->string('aval_telefono')->nullable();
            $table->string('aval_parentesco')->nullable();
            $table->string('aval_domicilio')->nullable();
            $table->string('aval_colonia')->nullable();
            $table->string('aval_ciudad')->nullable();

            $table->foreignId('grupo_id')->nullable()->constrained('grupos')->nullOnDelete();
            $table->boolean('activo')->default(true);
            $table->text('notas')->nullable();
            $table->foreignId('capturado_por_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->timestamps();

            $table->index(['grupo_id', 'activo']);
            $table->index('nombre');
        });

        Schema::create('creditos', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('folio')->unique();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->foreignId('grupo_id')->nullable()->constrained('grupos')->nullOnDelete();

            // Importes en centavos
            $table->integer('monto_prestado');
            $table->integer('monto_total');        // capital + interés
            $table->integer('abono_semanal');
            $table->unsignedInteger('num_semanas')->default(12);

            // Se captura el LUNES de entrega; el sistema genera los sábados
            $table->date('fecha_entrega');
            $table->date('fecha_primer_abono');
            $table->date('fecha_vencimiento');

            $table->string('estado')->default('ACTIVO'); // ACTIVO | LIQUIDADO | VENCIDO | CANCELADO
            $table->timestamp('liquidado_en')->nullable();
            $table->text('notas')->nullable();
            $table->foreignId('capturado_por_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->timestamps();

            $table->index(['grupo_id', 'estado']);
            $table->index('cliente_id');
            $table->index(['estado', 'fecha_vencimiento']);
        });

        Schema::create('abonos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('credito_id')->constrained('creditos')->cascadeOnDelete();
            $table->unsignedInteger('semana');          // 1..12
            $table->date('fecha_programada');           // siempre sábado
            $table->integer('monto_esperado');
            $table->integer('monto_pagado')->default(0);
            $table->string('estado')->default('PENDIENTE'); // PENDIENTE | PARCIAL | PAGADO
            $table->timestamp('pagado_en')->nullable();

            $table->unique(['credito_id', 'semana']);
            $table->index(['fecha_programada', 'estado']);
        });

        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('credito_id')->constrained('creditos')->cascadeOnDelete();
            $table->foreignId('abono_id')->nullable()->constrained('abonos')->nullOnDelete();
            $table->integer('monto');
            $table->date('fecha');
            $table->text('nota')->nullable();
            $table->boolean('anulado')->default(false);
            $table->foreignId('registrado_por_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->timestamps();

            $table->index(['fecha', 'anulado']);
            $table->index('credito_id');
        });

        Schema::create('documentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->string('tipo')->default('OTRO');
            $table->string('descripcion')->nullable();
            $table->string('archivo');             // ruta relativa dentro del almacén
            $table->string('mime');
            $table->unsignedInteger('bytes');
            $table->unsignedInteger('ancho')->nullable();
            $table->unsignedInteger('alto')->nullable();
            $table->foreignId('subido_por_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->timestamps();

            $table->index(['cliente_id', 'tipo']);
        });

        Schema::create('auditorias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->string('accion');              // "credito.crear", "abono.marcar", ...
            $table->string('entidad');
            $table->string('entidad_id')->nullable();
            $table->text('detalle')->nullable();   // JSON serializado
            $table->string('ip')->nullable();
            $table->timestamps();

            $table->index('created_at');
            $table->index(['entidad', 'entidad_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auditorias');
        Schema::dropIfExists('documentos');
        Schema::dropIfExists('pagos');
        Schema::dropIfExists('abonos');
        Schema::dropIfExists('creditos');
        Schema::dropIfExists('clientes');
        Schema::dropIfExists('grupos');
        Schema::dropIfExists('usuarios');
    }
};
