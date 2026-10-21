<?php

declare(strict_types=1);

namespace Numera11y\Ikonym;

use InvalidArgumentException;
use RuntimeException;

/** Locate and read a bundled portable DiceBear JSON style definition. */
final class StyleDefinition
{
    /** @var list<int> */
    public const DENSITIES = [3, 5, 7, 9, 12];

    /** Return the absolute path to an Ikonym JSON definition. */
    public static function path(int $density = 7): string
    {
        if (!in_array($density, self::DENSITIES, true)) {
            throw new InvalidArgumentException('Ikonym density must be 3, 5, 7, 9, or 12.');
        }

        $path = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'styles' . DIRECTORY_SEPARATOR . "ikonym-{$density}.json";
        if (!is_file($path)) {
            throw new RuntimeException("Ikonym style definition is missing: {$path}");
        }

        return $path;
    }

    /** Return the JSON text for an Ikonym density. */
    public static function json(int $density = 7): string
    {
        $json = file_get_contents(self::path($density));
        if ($json === false) {
            throw new RuntimeException("Unable to read Ikonym density {$density} style definition.");
        }

        return $json;
    }
}
