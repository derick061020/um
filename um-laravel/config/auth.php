<?php

use App\Models\Usuario;

return [

    /*
    |--------------------------------------------------------------------------
    | Configuración de acceso
    |--------------------------------------------------------------------------
    |
    | El sistema no usa correo: cada persona entra con un nombre de usuario
    | corto (direccion, viridiana, capturista, encargada) y su contraseña.
    | Por eso no hay proveedor de restablecimiento por correo.
    |
    */

    'defaults' => [
        'guard' => 'web',
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'usuarios',
        ],
    ],

    'providers' => [
        'usuarios' => [
            'driver' => 'eloquent',
            'model' => env('AUTH_MODEL', Usuario::class),
        ],
    ],

    /*
    | Minutos antes de volver a pedir la contraseña para acciones sensibles.
    */
    'password_timeout' => 10800,

];
