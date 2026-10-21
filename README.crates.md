# Ikonym for Rust

Ikonym generates deterministic geometric SVG avatars from a username, account ID, or other stable identifier. It bundles five portable DiceBear JSON styles with grid densities of 3×3, 5×5, 7×7, 9×9, and 12×12.

```toml
[dependencies]
ikonym = "0.1.0"
```

```rust
use ikonym::create_avatar;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let svg = create_avatar("user-4821", 7, 128, 0, None)?;
    println!("{svg}");
    Ok(())
}
```

Load the portable definition directly when using DiceBear Core APIs:

```toml
[dependencies]
dicebear-core = "10.7"
ikonym = "0.1.0"
serde_json = "1"
```

```rust
use dicebear_core::{Avatar, Style};
use ikonym::style_json;
use serde_json::json;

let style = Style::from_str(style_json(7)?)?;
let avatar = Avatar::new(&style, json!({ "seed": "user-4821", "size": 128 }))?;
let svg = avatar.to_svg();
```

Ikonym is open source under the MIT License. Any redistribution, including modified versions, must retain the copyright notice and license.

- [Documentation](https://ikonym.numera11y.fr/en/)
- [Source code and issues](https://github.com/numera11y/ikonym)
