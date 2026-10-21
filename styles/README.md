# DiceBear style definitions

The JSON files in this directory are portable saturated-mosaic definitions for the official DiceBear Core libraries. They can be loaded from JavaScript, PHP, Python, Rust, Go, Dart, and C#. The npm package exports `ikonym/styles/ikonym-3.json`, `ikonym/styles/ikonym-5.json`, `ikonym/styles/ikonym-7.json`, `ikonym/styles/ikonym-9.json`, and `ikonym/styles/ikonym-12.json`. The Composer package also includes the five JSON definitions.

Regenerate the 3×3, 5×5, 7×7, 9×9 and 12×12 definitions with `npm run styles:build`, then validate them against DiceBear Core with `npm run styles:validate`.

Each identifier selects one of 16 seamless tile arrangements and a set of bold solid colors. Within each avatar, individual tiles mix shell fans, concentric arcs, curved growth bands, and faceted plates. Orthogonally adjacent tiles never use the same motif family, even if their colors differ. The motifs fill their tile areas without detached dots or specks. Choose `ikonym-3.json`, `ikonym-5.json`, `ikonym-7.json`, `ikonym-9.json`, or `ikonym-12.json` for the desired tile density. No gradient options are required: the JSON is a complete, repeatable pattern for all seven SDKs.
