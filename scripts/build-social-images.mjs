import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { createAvatar } from '../dist/index.js';

const publicDirectory = new URL('../public/', import.meta.url);
const brandMark = (await readFile(new URL('../public/ikonym-mark.svg', import.meta.url), 'utf8'))
  .replace(/^<svg\b[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '');
const avatarMark = createAvatar('ikon-satin', { density: 7, size: 100, radius: 0 })
  .replace(/^<svg\b[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '');

const copy = {
  en: {
    headlines: [{ text: 'Geometric avatars', y: 238 }],
    headlineSize: 62,
    subhead: 'Generated from an identifier.',
    subheadY: 310,
    subheadSize: 42,
    detail: 'Deterministic SVG · Open source · MIT',
    detailY: 390,
    alt: 'Geometric Ikonym mosaic avatar',
  },
  fr: {
    headlines: [{ text: 'Des avatars', y: 218 }, { text: 'géométriques', y: 276 }],
    headlineSize: 56,
    subhead: 'Générés à partir d’un identifiant.',
    subheadY: 344,
    subheadSize: 34,
    detail: 'SVG déterministe · Open source · MIT',
    detailY: 414,
    alt: 'Avatar en mosaïque géométrique Ikonym',
  },
};

function escapeXml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

for (const locale of ['en', 'fr']) {
  const localized = copy[locale];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f5f2e9"/>
  <path d="M0 0h16v630H0z" fill="#c91d57"/>
  <g transform="translate(76 72)">${brandMark}</g>
  <text x="122" y="106" fill="#20242a" font-family="Arial,sans-serif" font-size="31" font-weight="700">Ikonym</text>
  ${localized.headlines.map(({ text, y }) => `<text x="76" y="${y}" fill="#20242a" font-family="Arial,sans-serif" font-size="${localized.headlineSize}" font-weight="800" letter-spacing="-2">${escapeXml(text)}</text>`).join('')}
  <text x="76" y="${localized.subheadY}" fill="#20242a" font-family="Arial,sans-serif" font-size="${localized.subheadSize}" font-weight="500">${escapeXml(localized.subhead)}</text>
  <text x="76" y="${localized.detailY}" fill="#4f524d" font-family="Arial,sans-serif" font-size="25">${escapeXml(localized.detail)}</text>
  <rect x="778" y="105" width="330" height="330" fill="#fff0d8" stroke="#20242a" stroke-width="2"/>
  <svg x="793" y="120" width="300" height="300" viewBox="0 0 100 100">${avatarMark}</svg>
  <path d="M76 510h1032" stroke="#dedbd1" stroke-width="2"/>
  <text x="76" y="560" fill="#c91d57" font-family="Arial,sans-serif" font-size="22" font-weight="700">ikonym.numera11y.fr</text>
</svg>`;
  const svgPath = new URL(`ikonym-social-${locale}.svg`, publicDirectory);
  const pngPath = new URL(`ikonym-social-${locale}.png`, publicDirectory);
  await writeFile(svgPath, svg, 'utf8');
  const raster = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  await writeFile(pngPath, raster);
  await rm(svgPath, { force: true });
  console.log(`Generated ${localized.alt}: ${fileURLToPath(pngPath)}`);
}
