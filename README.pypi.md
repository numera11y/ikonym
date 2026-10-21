# Ikonym for Python

Ikonym generates deterministic geometric SVG avatars from a username, account ID, or other stable identifier. It includes five portable DiceBear JSON style definitions, with grids from 3×3 to 12×12.

```sh
pip install ikonym[dicebear]
```

```python
from ikonym import create_avatar

svg = create_avatar("user-4821", density=7, size=128)
```

To load a style without installing the optional rendering engine:

```python
from ikonym import get_style_definition

definition = get_style_definition(12)
```

Available densities are `3`, `5`, `7`, `9`, and `12`. The same identifier, density, and options always produce the same avatar. Generation runs locally; the identifier is not sent to a server.

Ikonym is open source under the MIT License. Redistributing the software, including modified versions, requires retaining the copyright notice and license text.

- [Documentation](https://ikonym.numera11y.fr/en/)
- [Source code and issues](https://github.com/numera11y/ikonym)
