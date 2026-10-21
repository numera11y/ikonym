---
name: Ikonym
description: Hash-generated saturated mosaics with perfectly joined geometric tiles.
colors:
  paper: "#f5f2e9"
  ink: "#20242a"
  muted-ink: "#4f524d"
  secondary-ink: "#77786f"
  rule: "#dedbd1"
  mosaic-navy: "#211b78"
  mosaic-blue: "#293ab8"
  mosaic-cyan: "#28acd7"
  mosaic-pink: "#e82371"
  accent-raspberry: "#c91d57"
  mosaic-orange: "#f2612d"
  mosaic-yellow: "#e9b91b"
  mosaic-mint: "#159b75"
  mosaic-cream: "#fff0d8"
typography:
  display:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(52px, 5.1vw, 72px)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.085em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.75
  label:
    fontFamily: "DM Mono, monospace"
    fontSize: "9px"
    fontWeight: 500
    lineHeight: 1.6
  content-heading:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(24px, 3vw, 40px)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.055em"
  content-subheading:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.3
  italic-accent:
    fontFamily: "Georgia, serif"
rounded:
  tile: "3px"
  avatar-square: "0%"
  avatar-round: "50%"
spacing:
  tight: "7px"
  small: "8px"
  medium: "16px"
  section: "49px"
components:
  avatar-frame:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "2px"
  palette-chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "50%"
    size: "18px"
---

# Design System: Ikonym

## Overview

**Creative North Star: “Identity in Tiles”**

Ikonym pairs a steady paper-toned interface with bold geometric avatars. Each avatar is an edge-to-edge mosaic of saturated color blocks, combining shell-inspired fans, concentric arcs, curved growth bands and faceted plates. A hash derived from the supplied identifier chooses each tile's motif, orientation, color, and grid density; all tile boundaries meet exactly so the complete avatar reads as one composed pattern.

The interface itself remains composed and legible: Manrope carries the reading hierarchy, DM Mono labels technical controls, and the existing warm-paper and dark-ink palette stays fixed. A vivid raspberry accent marks the wordmark detail, logo motifs, and interactive highlights; the supplied image informs the avatar colors without recoloring the page.

**Key Characteristics:**
- Bold cobalt, cyan, hot-pink, orange, yellow, mint, and cream tiles.
- Edge-to-edge 3×3, 5×5, 7×7, 9×9, or 12×12 cells; no gaps between tiles.
- Hash-selected mixtures of shell fans, concentric arcs, growth bands, and faceted plates, varied tile by tile.
- No detached decorative dots or specks; every color mark belongs to a substantial tile motif.
- Orthogonally adjacent cells always use different motif families, regardless of color or orientation.
- A raspberry accent gives the fixed interface a distinct identity without introducing orange.
- Stable interface colors, typography, controls, and page layout.

## Colors

The page retains its fixed paper-and-ink palette; the avatar uses a separate saturated mosaic palette of solid color roles.

### Primary
- **Deep Ink** (`{colors.ink}`): Headings, controls, avatar frames, and the main text hierarchy.

### Secondary
- **Muted Ink** (`{colors.muted-ink}`): Body copy and supporting interface labels.
- **Cobalt Navy** (`{colors.mosaic-navy}`): Anchor color for dense tile fields.
- **Electric Blue** (`{colors.mosaic-blue}`): Strong cool geometry.
- **Lagoon Cyan** (`{colors.mosaic-cyan}`): Bright high-value color block.
- **Hibiscus Pink** (`{colors.mosaic-pink}`): Warm motif accent.
- **Coral Orange** (`{colors.mosaic-orange}`): Saturated counterpoint.
- **Sun Yellow** (`{colors.mosaic-yellow}`): Bright tile accent.
- **Reef Mint** (`{colors.mosaic-mint}`): Secondary green block.
- **Shell Cream** (`{colors.mosaic-cream}`): Light accent pieces within dense patterns.

### Neutral
- **Shell Paper** (`{colors.paper}`): Fixed page ground and the avatar frame's outer surround; the avatar tile mosaic fills its own square edge-to-edge.
- **Quiet Rule** (`{colors.rule}`): Thin dividers between page regions.
- **Secondary Ink** (`{colors.secondary-ink}`): Muted utility text.

### Named Rules
**The Seamless Tile Rule.** Every cell meets its neighbor exactly; no blank gutters, borders, or mismatched edges interrupt the tessellation.

## Typography

**Display Font:** Manrope (with Arial, sans-serif fallback)
**Body Font:** Manrope (with Arial, sans-serif fallback)
**Label/Mono Font:** DM Mono (with monospace fallback)

**Character:** Compact, confident sans-serif headlines are softened by one restrained italic emphasis. Monospaced labels make controls and measurements easy to scan without turning the whole page into a technical costume.

### Hierarchy
- **Display** (800, `clamp(52px, 5.1vw, 72px)`, `0.94` line-height): Hero heading; mobile uses a viewport-responsive 52–68px range.
- **Title** (700–800, 25–48px): Studio, gallery, and documentation section headings.
- **Body** (500, 13px, `1.75` line-height): Introductory copy and explanatory text.
- **Label** (500, 8–11px, DM Mono): Controls, specimen captions, palette details, and technical metadata.

### Named Rules
**The Quiet Interface Rule.** Keep the page's typography and color independent of the avatar's vivid tile palette.

## Layout

The site centers a wide, editorial column (maximum width 1280px) with paired hero and workbench columns at desktop widths. At 600px and below, the hero, workbench, gallery, and integration area stack vertically; the specimen sheet and three-column avatar gallery retain their compact visual rhythm. Desktop page gutters are 44px, reducing to 18px on narrow screens. Existing navigation, control order, and section hierarchy remain stable.

## Elevation & Depth

The page is predominantly flat. Thin rules divide regions; the specimen artwork uses a restrained soft drop shadow (`0 9px 9px #252b3318`) to lift the examples from the paper ground. Do not add ambient glow or layered card shadows to the control interface.

## Shapes

Controls remain mostly square-cornered and outlined. The avatar frame has a fine 1.5px ink border with 2px paper padding; the avatar's outer radius remains user-controlled from square to circle (0–50%). Inside, square cells combine shell fans, concentric arcs, curved growth bands, and faceted plates; every motif stays inside its cell and the tile grid fills the square edge-to-edge.

## Components

### Buttons
- **Shape:** Compact outlined controls with square corners.
- **Primary:** Dark ink fill with paper text for the download action.
- **Hover / Focus:** Preserve the existing high-contrast focus outline and simple state changes.

### Cards / Containers
- **Corner Style:** Minimal; small specimen tiles use 3px, while avatar corners follow the generator's radius control.
- **Background:** Paper throughout the interface and avatar ground.
- **Border:** Thin ink or warm-gray rule; the avatar frame remains visible around each preview.

### Inputs / Fields
- **Style:** Open paper ground with a clear lower rule and compact technical label.
- **Focus:** Visible ink outline with offset; retain the existing keyboard treatment.

### Navigation
- **Style:** A compact wordmark and restrained horizontal links at desktop; navigation stays out of the narrow mobile header while the wordmark and primary action remain visible.

### Avatar Specimen
- **Density:** Three-by-three, five-by-five, seven-by-seven, nine-by-nine, or twelve-by-twelve contiguous tile grid.
- **Color:** Solid saturated palette roles selected and permuted by the seed.
- **Pattern:** Multiple shell-inspired tile archetypes mix within each avatar; each tile remains solidly backed, has no detached specks, and meets its neighbors flush.

### Brand Mark
- **Form:** Three consecutive miniature motifs—a faceted shell, a rounded shell, and a fan—replace the former dark bars.
- **Color:** Raspberry, reef mint, and sun yellow, with the raspberry echoed by the wordmark punctuation and interactive accents.

## Do's and Don'ts

### Do:
- **Do** keep the interface theme stable while varying tile archetype and color assignment by seed.
- **Do** fill the entire avatar with flush tile cells.
- **Do** mix motif orientation and shell-inspired tile grammars to make each seed's composition distinct.
- **Do** keep copy, controls, and UI boundaries legible independently of the vivid avatar palette.

### Don't:
- **Don't** return to the fluid wash and wave-line treatment.
- **Don't** leave paper gaps or borders between tile cells.
- **Don't** add detached dots or pinpoints; every colored detail must be part of a substantial shell-like tile form.
- **Don't** use avatar colors as the source of text contrast in the interface.
- **Don't** present the generated tile motifs as a traditional cultural design.
