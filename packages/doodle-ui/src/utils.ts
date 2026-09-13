export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

/** Follows SketchSeedProvider --doodle-ui-font. Unset = inherit the page default. */
export const doodleUiFontFamily = "var(--doodle-ui-font, inherit)";

/** When a handwriting face is active the provider sets --doodle-ui-font-weight to 400. */
export function doodleUiFontWeight(fallback: number): string {
  return `var(--doodle-ui-font-weight, ${fallback})`;
}

export function nextFontIndex(current: number, count: number): number {
  if (count <= 1) return 0;
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * count);
  }
  return next;
}

export function cn(
  ...parts: Array<string | undefined | false | null>
): string | undefined {
  const value = parts.filter(Boolean).join(" ");
  return value.length > 0 ? value : undefined;
}
