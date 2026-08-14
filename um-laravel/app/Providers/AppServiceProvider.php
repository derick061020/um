<?php

namespace App\Providers;

use App\Models\Usuario;
use App\Support\Rbac;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Cada permiso de la matriz se registra como Gate, para poder
        // preguntar @can('creditos.crear') en las vistas y $this->authorize()
        // en los controladores. Nunca se pregunta por el rol.
        foreach (Rbac::PERMISOS as $permiso) {
            Gate::define($permiso, fn (Usuario $usuario) => $usuario->puede($permiso));
        }

        // El sistema va detrás de HTTPS: sin él los navegadores no abren la
        // cámara del escáner. Se puede apagar con FORCE_HTTPS=false mientras
        // el certificado del dominio todavía no está activo.
        if ($this->app->environment('production') && env('FORCE_HTTPS', true)) {
            URL::forceScheme('https');
        }
    }
}
