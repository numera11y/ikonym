"""Generate deterministic geometric SVG avatars from stable identifiers."""

from __future__ import annotations

import json
import re
from importlib.resources import files
from typing import Any, Literal, Sequence

IkonymDensity = Literal[3, 5, 7, 9, 12]
STYLE_DENSITIES = (3, 5, 7, 9, 12)
PALETTE_ROLES = ("navy", "blue", "cyan", "pink", "orange", "yellow", "mint", "cream")
_HEX_COLOR = re.compile(r"^#(?:[\da-f]{3}|[\da-f]{6})$", re.IGNORECASE)


def _validate_density(density: int) -> None:
    if type(density) is not int or density not in STYLE_DENSITIES:
        raise ValueError("Ikonym density must be 3, 5, 7, 9, or 12.")


def get_style_definition(density: IkonymDensity = 7) -> dict[str, Any]:
    """Load the portable DiceBear JSON definition for the requested grid density."""
    _validate_density(density)
    path = files("ikonym").joinpath("styles", f"ikonym-{density}.json")
    return json.loads(path.read_text(encoding="utf-8"))


def _avatar(
    identifier: str,
    *,
    density: IkonymDensity = 7,
    size: int = 160,
    radius: int = 0,
    title: str | None = None,
    palette_colors: Sequence[str] | None = None,
):
    try:
        from dicebear import Avatar, Style
    except ImportError as error:
        raise ImportError(
            "Rendering Ikonym avatars requires DiceBear Core. Install it with "
            "`pip install 'ikonym[dicebear]'`. You can use get_style_definition() without this extra."
        ) from error

    definition = get_style_definition(density)
    options: dict[str, Any] = {
        "seed": str(identifier),
        "size": max(24, min(1024, round(size))),
        "borderRadius": max(0, min(50, round(radius))),
    }
    if title:
        options["title"] = title

    custom_colors = [color for color in (palette_colors or ()) if _HEX_COLOR.fullmatch(color)]
    if custom_colors:
        for index, role in enumerate(PALETTE_ROLES):
            options[f"{role}Color"] = [custom_colors[index % len(custom_colors)]]
            options[f"{role}ColorOrder"] = "fixed"

    return Avatar(Style(definition), options)


def create_avatar(
    identifier: str,
    *,
    density: IkonymDensity = 7,
    size: int = 160,
    radius: int = 0,
    title: str | None = None,
    palette_colors: Sequence[str] | None = None,
) -> str:
    """Return a deterministic SVG avatar for a username, ID, or other identifier."""
    return _avatar(
        identifier,
        density=density,
        size=size,
        radius=radius,
        title=title,
        palette_colors=palette_colors,
    ).to_string()


def create_avatar_data_uri(
    identifier: str,
    *,
    density: IkonymDensity = 7,
    size: int = 160,
    radius: int = 0,
    title: str | None = None,
    palette_colors: Sequence[str] | None = None,
) -> str:
    """Return a data URI for an HTML image element."""
    return _avatar(
        identifier,
        density=density,
        size=size,
        radius=radius,
        title=title,
        palette_colors=palette_colors,
    ).to_data_uri()


__all__ = [
    "IkonymDensity",
    "PALETTE_ROLES",
    "STYLE_DENSITIES",
    "create_avatar",
    "create_avatar_data_uri",
    "get_style_definition",
]
