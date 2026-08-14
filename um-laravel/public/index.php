<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
 * Dónde vive la aplicación.
 *
 * En una instalación normal está en la carpeta de arriba. En un hosting
 * compartido, esta carpeta ES public_html (la raíz web) y la aplicación queda
 * al lado, en um-crm/, fuera del alcance de internet.
 *
 * Y si el despliegue por SSH dejó la aplicación en otro sitio, el script
 * escribe la ruta en ruta-app.php y aquí se respeta.
 *
 * Se resuelve solo en los tres casos, así que este archivo no se edita nunca.
 */
$raiz = null;

if (is_file(__DIR__.'/ruta-app.php')) {
    $raiz = require __DIR__.'/ruta-app.php';
}

if (! $raiz) {
    $raiz = is_dir(__DIR__.'/../vendor')
        ? __DIR__.'/..'
        : __DIR__.'/../um-crm';
}

if (! is_dir($raiz.'/vendor')) {
    http_response_code(500);
    exit('No se encontró la aplicación. Revisa que la carpeta um-crm esté al lado de public_html.');
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = $raiz.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require $raiz.'/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once $raiz.'/bootstrap/app.php';

$app->handleRequest(Request::capture());
