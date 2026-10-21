import { Avatar, Style, type StyleDefinition } from '@dicebear/core';
import type { IkonymDensity, IkonymPalette, IkonymPaletteRole } from './index';

export const browserPaletteRoles = ['navy', 'blue', 'cyan', 'pink', 'orange', 'yellow', 'mint', 'cream'] as const;

const styleLoaders: Record<IkonymDensity, () => Promise<StyleDefinition>> = {
  3: async () => (await import('../../styles/ikonym-3.json')).default as unknown as StyleDefinition,
  5: async () => (await import('../../styles/ikonym-5.json')).default as unknown as StyleDefinition,
  7: async () => (await import('../../styles/ikonym-7.json')).default as unknown as StyleDefinition,
  9: async () => (await import('../../styles/ikonym-9.json')).default as unknown as StyleDefinition,
  12: async () => (await import('../../styles/ikonym-12.json')).default as unknown as StyleDefinition,
};

const loaded = new Map<IkonymDensity, { definition: StyleDefinition; style: Style }>();

export async function loadDensity(density: IkonymDensity) {
  if (loaded.has(density)) return;
  const definition = await styleLoaders[density]();
  loaded.set(density, { definition, style: new Style(definition) });
}

function getLoaded(density: IkonymDensity) {
  const result = loaded.get(density);
  if (!result) throw new Error(`Ikonym ${density}×${density} style has not been loaded`);
  return result;
}

export function getLoadedStyleDefinition(density: IkonymDensity): StyleDefinition {
  return getLoaded(density).definition;
}

export function getLoadedPalette(seed: string, density: IkonymDensity): IkonymPalette {
  const { style } = getLoaded(density);
  const resolved = new Avatar(style, { seed: String(seed) }).toJSON().options as Record<string, string[] | string | undefined>;
  const colors = Object.fromEntries(browserPaletteRoles.map((role) => {
    const value = resolved[`${role}Color`];
    const fallback = style.definition().colors?.[role]?.values?.[0] ?? '#ffffff';
    return [role, Array.isArray(value) ? (value[0] ?? fallback) : fallback];
  })) as Record<IkonymPaletteRole, string>;
  return {
    colors,
    pattern: typeof resolved.compositionVariant === 'string' ? resolved.compositionVariant : 'tilePattern1',
  };
}

export function createLoadedAvatar(seed: string, options: {
  density: IkonymDensity;
  size: number;
  radius: number;
  idRandomization?: boolean;
  title?: string;
}): string {
  const { style } = getLoaded(options.density);
  const palette = getLoadedPalette(seed, options.density);
  const avatarOptions: Record<string, unknown> = {
    seed: String(seed),
    size: Math.max(24, Math.min(1024, Math.round(options.size))),
    borderRadius: Math.max(0, Math.min(50, options.radius)),
    idRandomization: options.idRandomization ?? false,
  };
  if (options.title) avatarOptions.title = options.title;
  for (const role of browserPaletteRoles) {
    avatarOptions[`${role}Color`] = [palette.colors[role]];
    avatarOptions[`${role}ColorOrder`] = 'fixed';
  }
  return new Avatar(style, avatarOptions).toString();
}
