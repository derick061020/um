<?php

namespace App\Support;

/**
 * Logotipo de Mujeres Unidas para los PDF. Se incrusta como data-URI para que
 * dompdf no dependa de rutas del servidor (funciona igual en el hosting por
 * FTP, donde public/ vive en otra carpeta).
 */
class Marca
{
    /** @var array<string, string|null> */
    private static array $cache = [];

    private const ARCHIVOS = [
        'principal' => 'brand/um-principal.png',
        'invertido' => 'brand/um-invertido.png',
        'monocromatico' => 'brand/um-monocromatico.png',
    ];

    /**
     * Data-URI del logotipo, o null si no se puede usar. Devuelve null cuando
     * no hay extensión GD (dompdf la necesita para dibujar el PNG); en ese caso
     * el PDF cae al texto y nunca se rompe.
     */
    public static function logoDataUri(string $variante = 'principal'): ?string
    {
        if (array_key_exists($variante, self::$cache)) {
            return self::$cache[$variante];
        }

        // Sin GD, dompdf falla al incrustar imágenes: mejor usar el texto.
        if (! function_exists('imagecreatefrompng')) {
            return self::$cache[$variante] = null;
        }

        $rel = self::ARCHIVOS[$variante] ?? self::ARCHIVOS['principal'];
        $ruta = public_path($rel);

        $uri = is_file($ruta)
            ? 'data:image/png;base64,'.base64_encode((string) file_get_contents($ruta))
            : null;

        return self::$cache[$variante] = $uri;
    }
}
