# Ikonym for Dart

Deterministic geometric SVG avatars generated from a stable identifier. The package bundles all five Ikonym definitions and renders them with DiceBear Core.

```sh
dart pub add ikonym
```

```dart
import 'package:ikonym/ikonym.dart';

void main() {
  final svg = createAvatar(
    'account-4821',
    density: 7,
    size: 128,
    title: 'Account avatar',
  );
  print(svg);
}
```

Use `createAvatarDataUri` for an SVG data URI or `styleJson(density)` to access the portable DiceBear definition. Supported densities are 3, 5, 7, 9, and 12. See the [integration guide](https://github.com/numera11y/ikonym/blob/main/docs/INTEGRATIONS.md#dart).

Regenerate the bundled style data from the repository root with:

```sh
dart run dart/tool/generate_styles.dart
```
