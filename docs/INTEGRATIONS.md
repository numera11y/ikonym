# Install and use Ikonym in seven languages

Ikonym provides portable DiceBear JSON style definitions. Official DiceBear engines can read them in JavaScript, PHP, Python, Rust, Go, Dart, and C#. The files `ikonym-3.json`, `-5.json`, `-7.json`, `-9.json`, and `-12.json` select the same grid densities in every language. The `seed` value (a username, account ID, or other stable identifier) produces the same mosaic.

## Current availability

The `ikonym` package is not yet published to npm, Composer, PyPI, crates.io, pkg.go.dev, pub.dev, or NuGet. This site offers a prebuilt npm tarball and the JSON style definitions. Source code and issue tracking are available in the [public GitHub repository](https://github.com/numera11y/ikonym). For JavaScript, install the downloaded `.tgz` file; for other languages, put the matching `ikonym-3.json`, `-5.json`, `-7.json`, `-9.json`, or `-12.json` file in your `styles/` directory.

Choose a 3×3, 5×5, 7×7, 9×9, or 12×12 grid for the desired density. After release, the style will still need to be proposed to the DiceBear collections before it can be installed from their registries.

| Language | Minimum DiceBear engine version |
| --- | --- |
| JavaScript | Node.js 22+ |
| PHP | PHP 8.2+ |
| Python | Python 3.10+ |
| Rust | Rust 1.80+ |
| Go | Go 1.23+ |
| Dart | Dart 3.4+ |
| C# | .NET 8+ |

## JavaScript

Requirements: Node.js 22+.

```sh
npm install ./ikonym-0.1.0.tgz
```

```js
import { createAvatar } from 'ikonym';

const svg = createAvatar('ikon-satin', {
  density: 7,
  size: 128,
  radius: 0,
});
```

To use DiceBear Core directly, install `@dicebear/core` and select the JSON definition for the desired density.

```sh
npm install @dicebear/core
```

```js
import { Avatar, Style } from '@dicebear/core';
import definition from 'ikonym/styles/ikonym-7.json' with { type: 'json' };

const svg = new Avatar(new Style(definition), {
  seed: 'ikon-satin',
  size: 128,
  borderRadius: 0,
}).toString();
```

## PHP

Requirements: PHP 8.2+.

```sh
composer require dicebear/core
```

```php
<?php

use DiceBear\Avatar;
use DiceBear\Style;

$style = Style::fromJson(file_get_contents(__DIR__ . '/styles/ikonym-7.json'));
$avatar = new Avatar($style, [
    'seed' => 'ikon-satin',
    'size' => 128,
    'borderRadius' => 0,
    'title' => 'Alice’s avatar',
]);

$svg = (string) $avatar;
```

## Python

Requirements: Python 3.10+.

```sh
pip install dicebear-core
```

```python
from pathlib import Path
from dicebear import Avatar, Style

style = Style.from_json(Path('styles/ikonym-7.json').read_text('utf-8'))
avatar = Avatar(style, {
    'seed': 'ikon-satin',
    'size': 128,
    'borderRadius': 0,
    'title': 'Alice’s avatar',
})

svg = avatar.to_string()
```

## Rust

Requirements: Rust 1.80+.

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
        "seed": "ikon-satin",
        "size": 128,
        "borderRadius": 0,
        "title": "Alice’s avatar"
    }))?;

    let svg = avatar.to_svg();
    Ok(())
}
```

## Go

Requirements: Go 1.23+.

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
        "seed": "ikon-satin",
        "size": 128,
        "borderRadius": 0,
        "title": "Alice’s avatar",
    })
    if err != nil { panic(err) }

    svg := avatar.SVG()
    _ = svg
}
```

## Dart

Requirements: Dart 3.4+.

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
    'seed': 'ikon-satin',
    'size': 128,
    'borderRadius': 0,
    'title': 'Alice’s avatar',
  });

  final svg = avatar.svg;
}
```

## C#

Requirements: .NET 8+.

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
    ["seed"] = "ikon-satin",
    ["size"] = 128,
    ["borderRadius"] = 0,
    ["title"] = "Alice’s avatar",
});

var svg = avatar.ToSvg();
```

## Useful options

- `seed`: stable identifier (username, name, or user ID); the same value and definition produce the same SVG in every language.
- `size`: intrinsic SVG size in pixels, for example `128`.
- `borderRadius`: corner roundness from `0` (square) to `50` (circle).
- `density` in Ikonym: 3×3, 5×5, 7×7, 9×9, or 12×12 tiles. In other languages, select the matching JSON file.
- `paletteColors` in Ikonym: optional custom palette.
- `title`: accessible SVG label when the avatar conveys information on its own.
- Style files: `ikonym-3.json`, `ikonym-5.json`, `ikonym-7.json`, `ikonym-9.json`, and `ikonym-12.json`.

Every tile touches its neighbors, and orthogonal neighbors always use different motif families. Avatar colors are vivid; the site theme and interface contrast remain independent.

## Regenerate the style files

```sh
npm run styles:build
npm run styles:validate
npm run build:lib
npm run package:download
```

The validator builds all five densities with DiceBear Core and checks edge-to-edge coverage, the non-repeating neighbor rule, layout and color diversity, and Ikonym wrapper parity.

For French, see [`INTEGRATIONS.fr.md`](INTEGRATIONS.fr.md).
