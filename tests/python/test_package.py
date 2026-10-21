import unittest

from ikonym import STYLE_DENSITIES, create_avatar, create_avatar_data_uri, get_style_definition


class StyleDefinitionTests(unittest.TestCase):
    def test_all_density_definitions_are_packaged(self):
        for density in STYLE_DENSITIES:
            with self.subTest(density=density):
                definition = get_style_definition(density)
                self.assertEqual(definition["canvas"]["width"], 100)
                self.assertEqual(definition["canvas"]["height"], 100)

    def test_default_density_is_seven(self):
        self.assertEqual(get_style_definition(), get_style_definition(7))

    def test_unsupported_density_is_rejected(self):
        with self.assertRaises(ValueError):
            get_style_definition(4)  # type: ignore[arg-type]

    def test_dicebear_extra_renders_svg_and_data_uri(self):
        try:
            import dicebear  # noqa: F401
        except ImportError:
            self.skipTest("Install the optional 'dicebear' extra to run renderer smoke tests.")
        svg = create_avatar("ikon-satin", density=7, size=128)
        data_uri = create_avatar_data_uri("ikon-satin", density=3)
        self.assertTrue(svg.startswith("<svg"))
        self.assertTrue(data_uri.startswith("data:image/svg+xml"))


if __name__ == "__main__":
    unittest.main()
