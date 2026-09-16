import type { ForwardedRef, MutableRefObject } from "react";

export function assignRef<T>(ref: ForwardedRef<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") ref(value);
  else (ref as MutableRefObject<T | null>).current = value;
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

/** Follows SketchSeedProvider --doodle-ui-font, then styles.css --doodle-ui-font-family. */
export const doodleUiFontFamily =
  "var(--doodle-ui-font, var(--doodle-ui-font-family, inherit))";

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

/**
 * Offset a resolved sketch seed by a stable hash of `key`.
 * Items in a list keep distinct wobbles that still redraw together on Shuffle.
 */
export function deriveSeed(base: number, key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return (base + (hash >>> 0)) % 2 ** 31;
}
