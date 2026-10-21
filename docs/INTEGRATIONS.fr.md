# Installer et utiliser Ikonym dans 7 langages

Ikonym fournit des définitions DiceBear portables en JSON. Les bibliothèques DiceBear officielles les lisent dans JavaScript, PHP, Python, Rust, Go, Dart et C#. Les fichiers `ikonym-3.json`, `-5.json`, `-7.json`, `-9.json` et `-12.json` fixent des grilles de même taille; la valeur passée à `seed` (pseudo, nom ou ID utilisateur) produit le même motif mosaïque dans chaque langage.

## Disponibilité actuelle

Le paquet `ikonym` est publié sur npm et le package `numera11y/ikonym` est disponible sur Packagist. Le package Composer inclut un helper PHP et les définitions JSON portables. Le site propose aussi le tarball npm et le téléchargement direct des styles. Le [dépôt GitHub public](https://github.com/numera11y/ikonym) héberge le code source et le suivi des problèmes.

Télécharge le fichier de style depuis le site ou récupère-le dans `styles/` après avoir cloné le dépôt. Choisis une grille de 3×3, 5×5, 7×7, 9×9 ou 12×12 selon la densité voulue. Après publication, le style devra être proposé dans les collections DiceBear pour être installable directement depuis chaque registre.

Une fois le style accepté dans le catalogue DiceBear, les intégrations pourront aussi le charger depuis leur paquet `dicebear-styles` respectif.

| Langage | Version minimale du moteur DiceBear |
| --- | --- |
| JavaScript | Node.js 22+ |
| PHP | PHP 8.2+ |
| Python | Python 3.10+ |
| Rust | Rust 1.80+ |
| Go | Go 1.23+ |
| Dart | Dart 3.4+ |
| C# | .NET 8+ |

## JavaScript

Prérequis : Node.js 22+.

```sh
npm install ikonym
```

```js
import { createAvatar } from 'ikonym';

const svg = createAvatar('nacre-lunaire', {
  density: 7,
  size: 128,
  radius: 0,
});
```

Pour utiliser directement le moteur DiceBear, installe `@dicebear/core` et choisis la définition correspondant à la densité désirée.

```sh
npm install @dicebear/core
```

```js
import { Avatar, Style } from '@dicebear/core';
import definition from 'ikonym/styles/ikonym-7.json' with { type: 'json' };

const svg = new Avatar(new Style(definition), {
  seed: 'nacre-lunaire',
  size: 128,
  borderRadius: 0,
}).toString();
```

## PHP

Prérequis : PHP 8.2+.

```sh
composer require dicebear/core numera11y/ikonym
```

```php
<?php

use DiceBear\Avatar;
use DiceBear\Style;
use Numera11y\Ikonym\StyleDefinition;

$style = Style::fromJson(StyleDefinition::json(7));
$avatar = new Avatar($style, [
    'seed' => 'nacre-lunaire',
    'size' => 128,
    'borderRadius' => 0,
    'title' => 'Avatar d’Alice',
]);

$svg = (string) $avatar;
```

## Python

Prérequis : Python 3.10+.

```sh
pip install dicebear-core
```

```python
from pathlib import Path
from dicebear import Avatar, Style

style = Style.from_json(Path('styles/ikonym-7.json').read_text('utf-8'))
avatar = Avatar(style, {
    'seed': 'nacre-lunaire',
    'size': 128,
    'borderRadius': 0,
    'title': 'Avatar d’Alice',
})

svg = avatar.to_string()
```

## Rust

Prérequis : Rust 1.80+.

```sh
cargo add dicebear-core serde_json
```

```rust
use dicebear_core::{Avatar, Style};
use serde_json::json;
use std::fs;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let definition = fs::read_to_string("styles/ikonym-7.json")?;
    let style = Style::from_str(&definition)?;
    let avatar = Avatar::new(&style, json!({
        "seed": "nacre-lunaire",
        "size": 128,
        "borderRadius": 0,
        "title": "Avatar d’Alice"
    }))?;

    let svg = avatar.to_svg();
    Ok(())
}
```

## Go

Prérequis : Go 1.23+.

```sh
go get github.com/dicebear/dicebear-go/v10
```

```go
package main

import (
	"os"

	dicebear "github.com/dicebear/dicebear-go/v10"
)

func main() {
  definition, err := os.ReadFile("styles/ikonym-7.json")
	if err != nil { panic(err) }
	style, err := dicebear.NewStyle(definition)
	if err != nil { panic(err) }
	avatar, err := dicebear.NewAvatar(style, map[string]any{
		"seed": "nacre-lunaire",
		"size": 128,
		"borderRadius": 0,
		"title": "Avatar d’Alice",
	})
	if err != nil { panic(err) }

	svg := avatar.SVG()
	_ = svg
}
```

## Dart

Prérequis : Dart 3.4+.

```sh
dart pub add dicebear_core
```

```dart
import 'dart:io';
import 'package:dicebear_core/dicebear_core.dart';

void main() {
  final definition = File('styles/ikonym-7.json').readAsStringSync();
  final style = Style.parse(definition);
  final avatar = Avatar(style, {
    'seed': 'nacre-lunaire',
    'size': 128,
    'borderRadius': 0,
    'title': 'Avatar d’Alice',
  });

  final svg = avatar.svg;
}
```

## C#

Prérequis : .NET 8+.

```sh
dotnet add package DiceBear.Core
```

```csharp
using System.IO;
using System.Text.Json.Nodes;
using DiceBear;

var definition = File.ReadAllText("styles/ikonym-7.json");
var style = Style.Parse(definition);
var avatar = new Avatar(style, new JsonObject
{
    ["seed"] = "nacre-lunaire",
    ["size"] = 128,
    ["borderRadius"] = 0,
    ["title"] = "Avatar d’Alice",
});

var svg = avatar.ToSvg();
```

## Options utiles

- `seed` : identifiant stable (pseudo, nom ou ID utilisateur); la même valeur avec la même définition donne le même SVG dans tous les langages.
- `size` : taille intrinsèque du SVG, par exemple `128`.
- `borderRadius` : arrondi de `0` (carré) à `50` (cercle).
- `density` dans Ikonym : grille de 3 × 3, 5 × 5, 7 × 7, 9 × 9 ou 12 × 12 carreaux; dans les autres langages, choisis le fichier JSON correspondant.
- Chaque définition contient une palette vive de couleurs unies et une mise en page de carreaux; le seed choisit l’arrangement et les couleurs.
- `paletteColors` dans Ikonym : palette personnalisée facultative.
- `title` : libellé accessible dans le SVG lorsque l’avatar transmet une information à lui seul.
- Fichier de style : `ikonym-3.json`, `ikonym-5.json`, `ikonym-7.json`, `ikonym-9.json` ou `ikonym-12.json`.

Chaque motif est dessiné en carreaux adjacents qui couvrent le carré sans espace. Deux carreaux voisins par un côté n’ont jamais la même famille de motifs, même si leur couleur diffère. La palette de l’avatar est vive; le thème du site et le contraste de son interface restent inchangés.

## Enregistrer les fichiers de style

Les définitions sont versionnées dans `styles/` et peuvent être régénérées puis vérifiées :

```sh
npm run styles:build
npm run styles:validate
npm run build:lib
npm run package:download
```

Le validateur construit les cinq densités avec DiceBear Core, vérifie le raccord bord à bord, la règle d’alternance des motifs, la diversité des arrangements et des couleurs, et l’équivalence du wrapper Ikonym.
