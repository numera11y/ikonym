import 'dart:convert';

import 'package:dicebear_core/dicebear_core.dart';

import 'style_data.dart';

/// The grid densities supported by Ikonym.
const densities = <int>[3, 5, 7, 9, 12];

/// Return the bundled DiceBear JSON definition for [density].
String styleJson(int density) {
  final encoded = encodedStyles[density];
  if (encoded == null) {
    throw ArgumentError.value(density, 'density', 'Must be 3, 5, 7, 9, or 12');
  }
  return utf8.decode(base64Decode(encoded));
}

/// Generate an SVG avatar from a stable [identifier].
///
/// [density] selects a 3, 5, 7, 9, or 12 tile grid. [size] is clamped to
/// 24–1024 pixels, and [borderRadius] is clamped to 0–50 percent. When set,
/// [title] is added as the SVG's accessible title. A custom [paletteColors]
/// list may be supplied to override the bundled palette.
String createAvatar(
  String identifier, {
  int density = 7,
  int size = 160,
  int borderRadius = 0,
  String? title,
  List<String>? paletteColors,
}) {
  final style = Style.parse(styleJson(density));
  final options = <String, dynamic>{
    'seed': identifier,
    'size': size.clamp(24, 1024),
    'borderRadius': borderRadius.clamp(0, 50),
    if (title != null) 'title': title,
    if (paletteColors != null) 'paletteColors': paletteColors,
  };
  return Avatar(style, options).svg;
}

/// Generate a percent-encoded SVG data URI for an avatar.
String createAvatarDataUri(
  String identifier, {
  int density = 7,
  int size = 160,
  int borderRadius = 0,
  String? title,
  List<String>? paletteColors,
}) {
  final svg = createAvatar(
    identifier,
    density: density,
    size: size,
    borderRadius: borderRadius,
    title: title,
    paletteColors: paletteColors,
  );
  return 'data:image/svg+xml;charset=utf-8,${Uri.encodeComponent(svg)}';
}
