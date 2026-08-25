<?php

use App\Http\Controllers\AccesoController;
use App\Http\Controllers\BitacoraController;
use App\Http\Controllers\ClientaController;
use App\Http\Controllers\CobranzaController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\CorteController;
use App\Http\Controllers\CreditoController;
use App\Http\Controllers\DocumentoController;
use App\Http\Controllers\EncargadaController;
use App\Http\Controllers\EntregaController;
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\PanelController;
use App\Http\Controllers\TarjetonController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// --- Acceso -----------------------------------------------------------------

Route::get('/entrar', [AccesoController::class, 'formulario'])->name('entrar');
Route::post('/entrar', [AccesoController::class, 'entrar'])->middleware('throttle:10,1');
Route::post('/salir', [AccesoController::class, 'salir'])->name('salir');

Route::get('/', function () {
    return Auth::check()
        ? redirect(Auth::user()->rutaInicio())
        : redirect('/entrar');
});

// --- Sistema ----------------------------------------------------------------

Route::middleware('auth')->group(function () {

    Route::get('/panel', [PanelController::class, 'index'])
        ->middleware('puede:reportes.ver')->name('panel');

    Route::get('/corte', [CorteController::class, 'index'])
        ->middleware('puede:corte.dia')->name('corte');

    // Pantalla de la encargada: sus clientas del sábado
    Route::get('/mis-clientas', [EncargadaController::class, 'index'])
        ->middleware('puede:encargada.panel')->name('encargada');

    // Consulta de clientas de solo lectura (encargada / supervisor)
    Route::get('/consulta', [ConsultaController::class, 'index'])
        ->middleware('puede:clientas.consultar')->name('consulta');
    Route::get('/consulta/{cliente}', [ConsultaController::class, 'ver'])
        ->middleware('puede:clientas.consultar')->name('consulta.ver');

    // Entregas semanales del supervisor + cierre del admin
    Route::get('/entregas', [EntregaController::class, 'index'])
        ->middleware('puede:entregas.ver')->name('entregas');
    Route::get('/entregas/pdf', [EntregaController::class, 'pdf'])
        ->middleware('puede:entregas.ver')->name('entregas.pdf');
    Route::post('/entregas/{grupo}/capturar', [EntregaController::class, 'capturar'])
        ->middleware('puede:entregas.capturar')->name('entregas.capturar');
    Route::post('/entregas/{entrega}/cerrar', [EntregaController::class, 'cerrar'])
        ->middleware('puede:cierre.cerrar')->name('entregas.cerrar');
    Route::post('/entregas/{entrega}/reabrir', [EntregaController::class, 'reabrir'])
        ->middleware('puede:cierre.cerrar')->name('entregas.reabrir');

    // Clientas
    Route::get('/clientas', [ClientaController::class, 'index'])
        ->middleware('puede:clientas.ver')->name('clientas');
    Route::get('/clientas/nueva', [ClientaController::class, 'crear'])
        ->middleware('puede:clientas.crear')->name('clientas.nueva');
    Route::post('/clientas', [ClientaController::class, 'guardar'])
        ->middleware('puede:clientas.crear')->name('clientas.guardar');
    Route::get('/clientas/{cliente}', [ClientaController::class, 'ficha'])
        ->middleware('puede:clientas.ver')->name('clientas.ficha');
    Route::post('/clientas/{cliente}/editar', [ClientaController::class, 'actualizar'])
        ->middleware('puede:clientas.editar')->name('clientas.actualizar');

    // Documentos del expediente
    Route::post('/clientas/{cliente}/documentos', [DocumentoController::class, 'subir'])
        ->middleware('puede:documentos.subir')->name('documentos.subir');
    Route::get('/documentos/{documento}', [DocumentoController::class, 'ver'])
        ->middleware('puede:documentos.ver')->name('documentos.ver');
    Route::delete('/documentos/{documento}', [DocumentoController::class, 'borrar'])
        ->middleware('puede:documentos.subir')->name('documentos.borrar');

    // Créditos
    Route::get('/creditos', [CreditoController::class, 'index'])
        ->middleware('puede:creditos.ver')->name('creditos');
    Route::get('/creditos/nuevo', [CreditoController::class, 'crear'])
        ->middleware('puede:creditos.crear')->name('creditos.nuevo');
    Route::post('/creditos/calendario', [CreditoController::class, 'calendario'])
        ->middleware('puede:creditos.crear')->name('creditos.calendario');
    Route::post('/creditos', [CreditoController::class, 'guardar'])
        ->middleware('puede:creditos.crear')->name('creditos.guardar');
    Route::get('/creditos/{credito}', [CreditoController::class, 'ficha'])
        ->middleware('puede:creditos.ver')->name('creditos.ficha');
    Route::get('/creditos/{credito}/tarjeton', [TarjetonController::class, 'pdf'])
        ->middleware('puede:creditos.tarjeton')->name('creditos.tarjeton');

    // Renovación de crédito
    Route::get('/creditos/{credito}/renovar', [CreditoController::class, 'renovarForm'])
        ->middleware('puede:renovaciones.procesar')->name('creditos.renovar');
    Route::post('/creditos/{credito}/renovar', [CreditoController::class, 'renovar'])
        ->middleware('puede:renovaciones.procesar')->name('creditos.renovar.guardar');

    // Corrección del admin (semanas, montos, deuda) con bitácora
    Route::post('/creditos/{credito}/corregir', [CreditoController::class, 'corregir'])
        ->middleware('puede:correcciones.aplicar')->name('creditos.corregir');

    // Cobranza del sábado
    Route::get('/cobranza', [CobranzaController::class, 'index'])
        ->middleware('puede:cobranza.ver')->name('cobranza');
    Route::post('/cobranza/{abono}/marcar', [CobranzaController::class, 'marcar'])
        ->middleware('puede:cobranza.marcar')->name('cobranza.marcar');
    Route::post('/cobranza/{abono}/abonar', [CobranzaController::class, 'abonar'])
        ->middleware('puede:cobranza.marcar')->name('cobranza.abonar');
    Route::post('/cobranza/{abono}/anular', [CobranzaController::class, 'anular'])
        ->middleware('puede:cobranza.anular')->name('cobranza.anular');

    // Grupos
    Route::get('/grupos', [GrupoController::class, 'index'])
        ->middleware('puede:grupos.ver')->name('grupos');
    Route::post('/grupos', [GrupoController::class, 'guardar'])
        ->middleware('puede:grupos.crear')->name('grupos.guardar');
    Route::post('/grupos/{grupo}/editar', [GrupoController::class, 'actualizar'])
        ->middleware('puede:grupos.editar')->name('grupos.actualizar');

    // Usuarios
    Route::get('/usuarios', [UsuarioController::class, 'index'])
        ->middleware('puede:usuarios.ver')->name('usuarios');
    Route::post('/usuarios', [UsuarioController::class, 'guardar'])
        ->middleware('puede:usuarios.crear')->name('usuarios.guardar');
    Route::post('/usuarios/{usuario}/editar', [UsuarioController::class, 'actualizar'])
        ->middleware('puede:usuarios.editar')->name('usuarios.actualizar');
    Route::post('/usuarios/{usuario}/contrasena', [UsuarioController::class, 'contrasena'])
        ->middleware('puede:usuarios.editar')->name('usuarios.contrasena');

    // Bitácora
    Route::get('/bitacora', [BitacoraController::class, 'index'])
        ->middleware('puede:auditoria.ver')->name('bitacora');
});
