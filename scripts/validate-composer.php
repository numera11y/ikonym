<?php

declare(strict_types=1);

require __DIR__ . '/../php/src/StyleDefinition.php';

use Numera11y\Ikonym\StyleDefinition;

$manifest = json_decode(file_get_contents(__DIR__ . '/../composer.json'), true, flags: JSON_THROW_ON_ERROR);
if (($manifest['name'] ?? null) !== 'numera11y/ikonym') {
    throw new RuntimeException('Composer package name must be numera11y/ikonym.');
}

foreach (StyleDefinition::DENSITIES as $density) {
    $definition = json_decode(StyleDefinition::json($density), true, flags: JSON_THROW_ON_ERROR);
    if (($definition['canvas']['width'] ?? null) !== 100) {
        throw new RuntimeException("Ikonym {$density}×{$density} definition is invalid.");
    }
    echo "ikonym-{$density}.json: readable from the Composer package\n";
}

try {
    StyleDefinition::path(4);
    throw new RuntimeException('Invalid density was unexpectedly accepted.');
} catch (InvalidArgumentException) {
    echo "Invalid density: rejected\n";
}
