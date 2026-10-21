import { Avatar, Style } from '@dicebear/core';
import style3 from '../../styles/ikonym-3.json';
import style5 from '../../styles/ikonym-5.json';
import style7 from '../../styles/ikonym-7.json';
import style9 from '../../styles/ikonym-9.json';
import style12 from '../../styles/ikonym-12.json';

export type IkonymDensity = 3 | 5 | 7 | 9 | 12;
export const paletteRoles = ['navy', 'blue', 'cyan', 'pink', 'orange', 'yellow', 'mint', 'cream'] as const;
export type IkonymPaletteRole = typeof paletteRoles[number];

export interface IkonymOptions {
  size?: number;
  /** Number of motif tiles per side. Defaults to 7 × 7. */
  density?: IkonymDensity;
  /** @deprecated Use density. */
  waveCount?: IkonymDensity;
  /** @deprecated Use density. */
  pieceCount?: IkonymDensity;
  /** @deprecated Use density. Maps 8→5, 16→7 and 24→9 tiles per side. */
  gridSize?: 8 | 16 | 24;
  /** Supply a custom set of vivid tile colors. */
  paletteColors?: string[];
  /** Roundness from 0 (square) to 50 (circle). */
  radius?: number;
  /** Accessible SVG title. */
  title?: string;
  /** Randomize internal SVG IDs when inlining multiple SVGs in one document. */
  idRandomization?: boolean;
}

export interface IkonymPalette {
  colors: Record<IkonymPaletteRole, string>;
  pattern: string;
}

const definitions = { 3: style3, 5: style5, 7: style7, 9: style9, 12: style12 } as const;

/** Return the portable DiceBear definition for a 3×3, 5×5, 7×7, 9×9, or 12×12 mosaic. */
export function getStyleDefinition(density: IkonymDensity = 7) {
  return definitions[density];
}

function resolveDensity(options: IkonymOptions): IkonymDensity {
  if (options.density === 3 || options.density === 5 || options.density === 7 || options.density === 9 || options.density === 12) return options.density;
  if (options.waveCount === 3 || options.waveCount === 5 || options.waveCount === 7 || options.waveCount === 9 || options.waveCount === 12) return options.waveCount;
  if (options.pieceCount === 3 || options.pieceCount === 5 || options.pieceCount === 7 || options.pieceCount === 9 || options.pieceCount === 12) return options.pieceCount;
  if (options.gridSize === 8) return 5;
  if (options.gridSize === 24) return 9;
  return 7;
}

function resolvePalette(seed: string, density: IkonymDensity): IkonymPalette {
  const style = definitions[density];
  const avatar = new Avatar(new Style(style), { seed: String(seed) });
  const resolved = avatar.toJSON().options as Record<string, string[] | string | undefined>;
  const colors = Object.fromEntries(paletteRoles.map((role) => {
    const resolvedColor = resolved[`${role}Color`];
    const fallback = style.colors?.[role]?.values?.[0] ?? '#ffffff';
    return [role, Array.isArray(resolvedColor) ? (resolvedColor[0] ?? fallback) : fallback];
  })) as Record<IkonymPaletteRole, string>;
  return {
    colors,
    pattern: typeof resolved.compositionVariant === 'string' ? resolved.compositionVariant : 'tilePattern1',
  };
}

/** Get the seed-selected solid palette and tile arrangement. */
export function getPaletteForSeed(seed: string, density: IkonymDensity = 7): IkonymPalette {
  return resolvePalette(seed, density);
}

function makeAvatar(seed: string, options: IkonymOptions = {}) {
  const density = resolveDensity(options);
  const style = new Style(definitions[density]);
  const palette = resolvePalette(seed, density);
  const customColors = options.paletteColors?.filter((color) => /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(color));
  const optionsForDiceBear: Record<string, unknown> = {
    seed: String(seed),
    size: Math.max(24, Math.min(1024, Math.round(options.size ?? 160))),
    borderRadius: Math.max(0, Math.min(50, options.radius ?? 0)),
    idRandomization: options.idRandomization ?? false,
  };
  if (options.title) optionsForDiceBear.title = options.title;

  for (const role of paletteRoles) {
    const color = customColors?.length ? customColors[paletteRoles.indexOf(role) % customColors.length] : palette.colors[role];
    optionsForDiceBear[`${role}Color`] = [color];
    optionsForDiceBear[`${role}ColorOrder`] = 'fixed';
  }

  return new Avatar(style, optionsForDiceBear);
}

/** Create a deterministic, edge-to-edge tiled SVG avatar. */
export function createAvatar(seed: string, options: IkonymOptions = {}): string {
  return makeAvatar(seed, options).toString();
}

/** Create a data URI suitable for an img src. */
export function createAvatarDataUri(seed: string, options?: IkonymOptions): string {
  return makeAvatar(seed, options).toDataUri();
}

/** Return the compact FNV-1a 32-bit hash used by DiceBear's seed PRNG. */
export function hash(seed: string): number {
  let value = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    value ^= seed.charCodeAt(i);
    value = Math.imul(value, 0x01000193);
  }
  return value >>> 0;
}
