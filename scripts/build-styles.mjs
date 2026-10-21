import { mkdir, rm, writeFile } from 'node:fs/promises';
import { createTileFamilyGrid } from './tile-families.mjs';

const outputDirectory = new URL('../styles/', import.meta.url);
const publicDirectory = new URL('../public/downloads/styles/', import.meta.url);
const pythonStylesDirectory = new URL('../python/ikonym/styles/', import.meta.url);
const densities = [3, 5, 7, 9, 12];
const variantCount = 16;
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
const paletteRoles = Object.keys(palette);

function randomFrom(seed) {
  let state = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    state ^= seed.charCodeAt(i);
    state = Math.imul(state, 16777619);
  }
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function fmt(value) {
  return Number(value.toFixed(3)).toString();
}

function emptyPathGroups() {
  return Object.fromEntries(paletteRoles.map((role) => [role, []]));
}

function append(paths, role, data) {
  paths[role].push(data);
}

function diamondCell(paths, role, x0, y0, x1, y1, inset = 0) {
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  append(paths, role, `M${fmt(cx)} ${fmt(y0 + inset)} L${fmt(x1 - inset)} ${fmt(cy)} L${fmt(cx)} ${fmt(y1 - inset)} L${fmt(x0 + inset)} ${fmt(cy)} Z`);
}

function semicircleCell(paths, role, x0, y0, x1, y1, orientation) {
  const width = x1 - x0;
  const height = y1 - y0;
  const radius = Math.min(width, height) / 2;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const start = orientation % 2 === 0 ? `M${fmt(x0)} ${fmt(cy)}` : `M${fmt(cx)} ${fmt(y0)}`;
  const end = orientation % 2 === 0 ? `${fmt(x1)} ${fmt(cy)}` : `${fmt(cx)} ${fmt(y1)}`;
  const sweep = orientation % 2 === 0 ? orientation === 0 ? 1 : 0 : orientation === 1 ? 1 : 0;
  append(paths, role, `${start} A${fmt(radius)} ${fmt(radius)} 0 0 ${sweep} ${end} L${start.slice(1)} Z`);
}

function appendTileMotif(groups, family, orientation, x0, y0, x1, y1, row, column, variant) {
  const width = x1 - x0;
  const height = y1 - y0;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const shift = variant * 5 + row * 3 + column * 7;
  const color = (offset) => paletteRoles[(shift + offset + paletteRoles.length) % paletteRoles.length];

  if (family === 0) {
    // A fan of four solid ribs opens from one tile edge to the opposite edge.
    const points = orientation % 2 === 0
      ? Array.from({ length: 4 }, (_, index) => `${fmt(x0 + width * index / 3)} ${orientation === 0 ? fmt(y1) : fmt(y0)}`)
      : Array.from({ length: 4 }, (_, index) => `${orientation === 1 ? fmt(x0) : fmt(x1)} ${fmt(y0 + height * index / 3)}`);
    const anchor = orientation === 0 ? `${fmt(cx)} ${fmt(y0)}`
      : orientation === 1 ? `${fmt(x1)} ${fmt(cy)}`
        : orientation === 2 ? `${fmt(cx)} ${fmt(y1)}` : `${fmt(x0)} ${fmt(cy)}`;
    for (let rib = 0; rib < 3; rib += 1) {
      append(groups, color(rib + 1), `M${anchor} L${points[rib]} L${points[rib + 1]} Z`);
    }
    return;
  }

  if (family === 1) {
    // Nested shell lips repeat the same closed arc at decreasing scales.
    for (let layer = 0; layer < 2; layer += 1) {
      const inset = Math.min(width, height) * layer * 0.18;
      semicircleCell(groups, color(layer + 2), x0 + inset, y0 + inset, x1 - inset, y1 - inset, orientation);
    }
    return;
  }

  if (family === 2) {
    // Three curved growth bands echo the widening ribs of a shell.
    const horizontal = orientation % 2 === 0;
    for (let band = 0; band < 2; band += 1) {
      const offset = (band + 1) / 3;
      const curve = orientation > 1 ? 1 - offset : offset;
      const role = color(band + 3);
      if (horizontal) {
        const y = y0 + height * curve;
        const thickness = height * 0.18;
        append(groups, role, `M${fmt(x0)} ${fmt(y - thickness / 2)} Q${fmt(cx)} ${fmt(y - thickness)} ${fmt(x1)} ${fmt(y - thickness / 2)} L${fmt(x1)} ${fmt(y + thickness / 2)} Q${fmt(cx)} ${fmt(y + thickness)} ${fmt(x0)} ${fmt(y + thickness / 2)} Z`);
      } else {
        const x = x0 + width * curve;
        const thickness = width * 0.18;
        append(groups, role, `M${fmt(x - thickness / 2)} ${fmt(y0)} Q${fmt(x - thickness)} ${fmt(cy)} ${fmt(x - thickness / 2)} ${fmt(y1)} L${fmt(x + thickness / 2)} ${fmt(y1)} Q${fmt(x + thickness)} ${fmt(cy)} ${fmt(x + thickness / 2)} ${fmt(y0)} Z`);
      }
    }
    return;
  }

  // Faceted shell plates keep the color blocky while varying tile orientation.
  const corners = [
    `M${fmt(x0)} ${fmt(y0)} L${fmt(x1)} ${fmt(y0)} L${fmt(cx)} ${fmt(cy)} Z`,
    `M${fmt(x1)} ${fmt(y0)} L${fmt(x1)} ${fmt(y1)} L${fmt(cx)} ${fmt(cy)} Z`,
    `M${fmt(x1)} ${fmt(y1)} L${fmt(x0)} ${fmt(y1)} L${fmt(cx)} ${fmt(cy)} Z`,
    `M${fmt(x0)} ${fmt(y1)} L${fmt(x0)} ${fmt(y0)} L${fmt(cx)} ${fmt(cy)} Z`,
  ];
  const start = orientation;
  append(groups, color(1), corners[start]);
  append(groups, color(2), corners[(start + 1) % 4]);
  append(groups, color(4), corners[(start + 3) % 4]);
}

function buildDefinition(density) {
  const variants = {};
  const tileEdges = Array.from({ length: density + 1 }, (_, index) => fmt(100 * index / density));

  for (let variant = 0; variant < variantCount; variant += 1) {
    const random = randomFrom(`shell-mosaic:${density}:${variant}`);
    const tileFamilies = createTileFamilyGrid(density, variant);
    const basePaths = emptyPathGroups();
    const motifPaths = Array.from({ length: 4 }, emptyPathGroups);

    for (let row = 0; row < density; row += 1) {
      for (let column = 0; column < density; column += 1) {
        const x0 = Number(tileEdges[column]);
        const y0 = Number(tileEdges[row]);
        const x1 = Number(tileEdges[column + 1]);
        const y1 = Number(tileEdges[row + 1]);
        const baseRole = paletteRoles[Math.floor(random() * paletteRoles.length)];
        append(basePaths, baseRole, `M${fmt(x0)} ${fmt(y0)} H${fmt(x1)} V${fmt(y1)} H${fmt(x0)} Z`);
        const family = tileFamilies[row][column];
        const orientation = Math.floor(random() * 4);
        appendTileMotif(motifPaths[family], family, orientation, x0, y0, x1, y1, row, column, variant);
      }
    }

    const elements = [
      ...paletteRoles.filter((role) => basePaths[role].length).map((role) => ({
        type: 'element',
        name: 'path',
        attributes: { d: basePaths[role].join(' '), fill: { type: 'color', name: role }, class: 'mosaic-cell' },
      })),
      ...motifPaths.flatMap((familyPaths, family) => paletteRoles.filter((role) => familyPaths[role].length).map((role) => ({
        type: 'element',
        name: 'path',
        attributes: { d: familyPaths[role].join(' '), fill: { type: 'color', name: role }, class: `mosaic-motif shell-family-${family}` },
      }))),
    ];
    variants[`tilePattern${variant + 1}`] = { elements };
  }

  return {
    $schema: 'https://cdn.hopjs.net/npm/@dicebear/schema@1.0.0/dist/definition.min.json',
    meta: {
      license: { name: 'MIT', url: 'https://opensource.org/license/mit/' },
      creator: { name: 'Ikonym' },
    },
    canvas: {
      width: 100,
      height: 100,
      elements: [{ type: 'component', name: 'composition' }],
    },
    components: {
      composition: { width: 100, height: 100, variants },
    },
    colors: Object.fromEntries(paletteRoles.map((role) => [role, { values: palette[role] }])),
  };
}

await mkdir(outputDirectory, { recursive: true });
await mkdir(publicDirectory, { recursive: true });
await mkdir(pythonStylesDirectory, { recursive: true });
for (const oldStyleName of ['duodoodles-5', 'duodoodles-7', 'duodoodles-9', 'duodoodles-8', 'duodoodles-16', 'duodoodles-24', 'nacreline-3', 'nacreline-5', 'nacreline-7', 'nacreline-9', 'nacreline-12']) {
  await rm(new URL(`${oldStyleName}.json`, outputDirectory), { force: true });
  await rm(new URL(`${oldStyleName}.json`, publicDirectory), { force: true });
  await rm(new URL(`${oldStyleName}.json`, pythonStylesDirectory), { force: true });
}
await rm(new URL('../public/downloads/duodoodles-0.1.0.tgz', import.meta.url), { force: true });
await rm(new URL('../public/downloads/nacreline-0.1.0.tgz', import.meta.url), { force: true });
await rm(new URL('../public/downloads/ikonym-0.1.0.tgz', import.meta.url), { force: true });
for (const density of densities) {
  const json = `${JSON.stringify(buildDefinition(density), null, 2)}\n`;
  await writeFile(new URL(`ikonym-${density}.json`, outputDirectory), json, 'utf8');
  await writeFile(new URL(`ikonym-${density}.json`, publicDirectory), json, 'utf8');
  await writeFile(new URL(`ikonym-${density}.json`, pythonStylesDirectory), json, 'utf8');
}
