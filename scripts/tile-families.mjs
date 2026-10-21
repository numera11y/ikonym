function randomFrom(seed) {
  let state = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    state ^= seed.charCodeAt(index);
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

/** Assign shell motif families so no horizontal or vertical neighbors match. */
export function createTileFamilyGrid(density, variant) {
  const random = randomFrom(`ikonym-neighbor-rule:${density}:${variant}`);
  const families = Array.from({ length: density }, () => Array(density));

  for (let row = 0; row < density; row += 1) {
    for (let column = 0; column < density; column += 1) {
      const forbidden = new Set([
        row > 0 ? families[row - 1][column] : -1,
        column > 0 ? families[row][column - 1] : -1,
      ]);
      const available = [0, 1, 2, 3].filter((family) => !forbidden.has(family));
      families[row][column] = available[Math.floor(random() * available.length)];
    }
  }

  return families;
}
