import { readFile } from 'node:fs/promises';
import { Avatar, Style } from '@dicebear/core';
import { createAvatar } from '../dist/index.js';
import { createTileFamilyGrid } from './tile-families.mjs';

const palette = {
  navy: ['#211b78', '#28217f', '#302681'],
  blue: ['#293ab8', '#3450df', '#405be4'],
  cyan: ['#28acd7', '#37c7e3', '#5bd4e8'],
  pink: ['#e82371', '#f2337d', '#f34b8b'],
  orange: ['#f2612d', '#ff7838', '#f98d45'],
  yellow: ['#e9b91b', '#ffd02c', '#f7db4d'],
  mint: ['#159b75', '#29b887', '#50c998'],
  cream: ['#fff0d8', '#fff8e9', '#f7f0e3'],
};
const roles = Object.keys(palette);

for (const density of [3, 5, 7, 9, 12]) {
  const definition = JSON.parse(await readFile(new URL(`../styles/ikonym-${density}.json`, import.meta.url), 'utf8'));
  for (const role of roles) {
    if (JSON.stringify(definition.colors[role]?.values) !== JSON.stringify(palette[role])) {
      throw new Error(`${density}×${density} mosaic has an unexpected ${role} palette`);
    }
  }
  const style = new Style(definition);
  const variants = Object.values(definition.components.composition.variants);
  if (variants.length !== 16) throw new Error(`${density}×${density} mosaic should expose 16 seed-selected arrangements`);
  for (const [index, variant] of variants.entries()) {
    const familyGrid = createTileFamilyGrid(density, index);
    const familiesInGrid = new Set(familyGrid.flat());
    if (familiesInGrid.size < 3) throw new Error(`${density}×${density} pattern ${index + 1} uses too few shell motif families`);
    for (let row = 0; row < density; row += 1) {
      for (let column = 0; column < density; column += 1) {
        if (row > 0 && familyGrid[row][column] === familyGrid[row - 1][column]) {
          throw new Error(`${density}×${density} pattern ${index + 1} repeats a motif vertically`);
        }
        if (column > 0 && familyGrid[row][column] === familyGrid[row][column - 1]) {
          throw new Error(`${density}×${density} pattern ${index + 1} repeats a motif horizontally`);
        }
      }
    }
    const tilePaths = variant.elements.filter((element) => element.attributes?.class === 'mosaic-cell');
    const tileCount = tilePaths.reduce((sum, element) => sum + (element.attributes.d.match(/\bM/g) ?? []).length, 0);
    if (tileCount !== density * density) throw new Error(`${density}×${density} pattern ${index + 1} leaves a tile gap`);
    const shellFamilies = new Set(variant.elements.flatMap((element) => {
      const match = element.attributes?.class?.match(/shell-family-(\d)/);
      return match ? [match[1]] : [];
    }));
    if (shellFamilies.size < 3) {
      throw new Error(`${density}×${density} pattern ${index + 1} does not combine enough shell tile motifs`);
    }
  }

  const seeds = ['alice@example.com', 'nacre-lunaire', 'camembert-astronaute', ...Array.from({ length: 18 }, (_, index) => `mosaic-seed-${index}`)];
  const layouts = new Set();
  const palettes = new Set();
  for (const seed of seeds) {
    const options = { seed, size: 128, borderRadius: 50, title: 'Ikonym mosaic validation' };
    const avatar = new Avatar(style, options);
    const first = avatar.toString();
    const second = new Avatar(style, options).toString();
    if (first !== second || !first.startsWith('<svg') || !first.includes('clipPath')) {
      throw new Error(`Invalid or non-deterministic ${density}×${density} mosaic for ${seed}`);
    }
    if (first.includes('<linearGradient') || first.includes('<radialGradient')) {
      throw new Error('The new geometric mosaic should use solid tile colors without liquid overlays');
    }
    const resolved = avatar.toJSON().options;
    layouts.add(resolved.compositionVariant);
    palettes.add(roles.map((role) => resolved[`${role}Color`]?.[0]).join('|'));
    if (createAvatar(seed, { density, size: 128, radius: 50, title: 'Ikonym mosaic validation' }) !== first) {
      throw new Error(`JavaScript wrapper differs from portable ${density}×${density} DiceBear output`);
    }

    const customPalette = ['#1b1b85', '#304ccc', '#2bb9d7', '#ec286d', '#ff762e', '#ffd12b', '#18a879', '#fff4df'];
    const custom = createAvatar(seed, { density, paletteColors: customPalette });
    const renderedColors = [...custom.matchAll(/fill="#([\da-f]{6})"/gi)].map((match) => `#${match[1].toLowerCase()}`);
    if (renderedColors.length === 0 || renderedColors.some((color) => !customPalette.includes(color))) {
      throw new Error('A mosaic color did not come from the requested custom palette');
    }
  }
  if (layouts.size < 10) throw new Error(`${density}×${density} seeds do not select enough distinct tile arrangements`);
  if (palettes.size < 8) throw new Error(`${density}×${density} seeds do not vary their resolved colors`);
  console.log(`ikonym-${density}.json: seamless ${density}×${density} tiles, mixed geometric motifs, 16 layouts, deterministic saturated palettes`);
}
