import 'dart:convert';
import 'dart:io';

Future<void> main() async {
  final densities = [3, 5, 7, 9, 12];
  final entries = <String>[];
  for (final density in densities) {
    final json = await File('styles/ikonym-$density.json').readAsString();
    entries.add('  $density: \'${base64Encode(utf8.encode(json))}\',');
  }

  final output = File('dart/lib/src/style_data.dart');
  await output.writeAsString(
      '''// GENERATED FILE. Regenerate with `dart run dart/tool/generate_styles.dart`.
const encodedStyles = <int, String>{
${entries.join('\n')}
};
''');
}
