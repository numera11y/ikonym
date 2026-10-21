import 'dart:convert';

import 'package:ikonym/ikonym.dart';
import 'package:test/test.dart';

void main() {
  test('bundled definitions are available for every density', () {
    for (final density in densities) {
      expect(jsonDecode(styleJson(density))['canvas']['width'], 100);
      expect(createAvatar('ikonym-test', density: density), startsWith('<svg'));
    }
  });

  test('rejects unsupported densities', () {
    expect(() => styleJson(4), throwsArgumentError);
    expect(() => createAvatar('ikonym-test', density: 4), throwsArgumentError);
  });

  test('avatar output is deterministic', () {
    expect(
      createAvatar('same-seed', density: 7),
      createAvatar('same-seed', density: 7),
    );
  });

  test('data URI and accessible title are generated', () {
    final svg = createAvatar('ikonym-test', title: 'Test avatar');
    expect(svg, contains('<title>Test avatar</title>'));
    expect(
      createAvatarDataUri('ikonym-test'),
      startsWith('data:image/svg+xml;charset=utf-8,'),
    );
  });
}
