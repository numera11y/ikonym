const paper = '#f5f2e9';
const ink = '#20242a';

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((part) => parseInt(part, 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function ratio(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function mix(first, second, firstWeight) {
  const a = first.slice(1).match(/../g).map((part) => parseInt(part, 16));
  const b = second.slice(1).match(/../g).map((part) => parseInt(part, 16));
  return `#${a.map((channel, index) => Math.round(channel * firstWeight + b[index] * (1 - firstWeight)).toString(16).padStart(2, '0')).join('')}`;
}

function brightness(hex, factor) {
  return `#${hex.slice(1).match(/../g).map((part) => Math.min(255, Math.round(parseInt(part, 16) * factor)).toString(16).padStart(2, '0')).join('')}`;
}

const installSurface = mix(paper, ink, 0.92);
const textPairs = [
  ['main text', ink, paper],
  ['raspberry accent', '#c91d57', paper],
  ['navigation', '#484b4c', paper],
  ['body and help text', '#4f524d', paper],
  ['integration description', '#64665f', paper],
  ['small code labels', '#444843', paper],
  ['slider track labels', '#4f524d', paper],
  ['install command', ink, installSurface],
  ['code sample', paper, ink],
  ['button hover', paper, brightness(ink, 0.84)],
];
const graphicPairs = [
  ['avatar frame', ink, paper],
  ['focus outline', ink, paper],
  ['status indicator', ink, paper],
  ['palette swatch outline', ink, paper],
  ['range slider track', '#4f524d', paper],
  ['control boundary', ink, paper],
];
for (const [name, foreground, background] of textPairs) {
  const value = ratio(foreground, background);
  if (value < 4.5) throw new Error(`${name} contrast is ${value.toFixed(2)}:1; needs 4.5:1`);
  console.log(`${name}: ${value.toFixed(2)}:1`);
}

for (const [name, foreground, background] of graphicPairs) {
  const value = ratio(foreground, background);
  if (value < 3) throw new Error(`${name} contrast is ${value.toFixed(2)}:1; needs 3:1`);
  console.log(`${name}: ${value.toFixed(2)}:1`);
}
