"use client";

import { useContext, useMemo } from "react";
import { DoodleUIContext } from "../animations/DoodleUIProvider";
import {
  DEFAULT_BOWING,
  DEFAULT_INK,
  DEFAULT_ROUGHNESS,
  DEFAULT_STROKE_WIDTH,
  type FillStyle,
  type SketchProps,
} from "../types";

/** Resolved global sketch defaults from {@link DoodleUIProvider} (explicit props only). */
export interface SketchDefaults {
  roughness: number;
  bowing: number;
  strokeWidth: number;
  sketchColor?: string;
  fillStyle?: FillStyle;
}

const FALLBACK: SketchDefaults = {
  roughness: DEFAULT_ROUGHNESS,
  bowing: DEFAULT_BOWING,
  strokeWidth: DEFAULT_STROKE_WIDTH,
};

/**
 * Returns sketch defaults from the nearest {@link DoodleUIProvider}, or library
 * constants when no provider sketch props are set.
 */
/**
 * Global sketch numeric defaults from {@link DoodleUIProvider} (falls back to constants).
 */
export function useSketchDefaults(): SketchDefaults {
  const ctx = useContext(DoodleUIContext);
  return useMemo(
    () => ({
      roughness: ctx?.roughness ?? FALLBACK.roughness,
      bowing: ctx?.bowing ?? FALLBACK.bowing,
      strokeWidth: ctx?.strokeWidth ?? FALLBACK.strokeWidth,
      sketchColor: ctx?.sketchColor,
      fillStyle: ctx?.fillStyle,
    }),
    [ctx?.roughness, ctx?.bowing, ctx?.strokeWidth, ctx?.sketchColor, ctx?.fillStyle],
  );
}

/**
 * Merges per-instance sketch props with provider defaults and optional CSS variables
 * read from a DOM element (for `--doodle-ui-*` theming without a provider).
 */
export function mergeSketchProps(
  props: SketchProps,
  defaults: SketchDefaults,
  css?: Partial<SketchProps>,
): SketchProps & { roughness: number; bowing: number; strokeWidth: number } {
  const roughness =
    props.roughness ??
    defaults.roughness ??
    parseCssNumber(css?.roughness, DEFAULT_ROUGHNESS);
  const bowing =
    props.bowing ?? defaults.bowing ?? parseCssNumber(css?.bowing, DEFAULT_BOWING);
  const strokeWidth =
    props.strokeWidth ??
    defaults.strokeWidth ??
    parseCssNumber(css?.strokeWidth, DEFAULT_STROKE_WIDTH);
  const sketchColor =
    props.sketchColor ?? defaults.sketchColor ?? css?.sketchColor ?? undefined;
  const fillStyle = props.fillStyle ?? defaults.fillStyle ?? css?.fillStyle;

  return {
    ...props,
    roughness,
    bowing,
    strokeWidth,
    sketchColor,
    fillStyle,
  };
}

function parseCssNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const n = parseFloat(value);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

/** Reads `--doodle-ui-*` sketch variables from an element's computed style. */
export function readSketchCssVars(element: Element | null): Partial<SketchProps> {
  if (!element || typeof window === "undefined") return {};
  const style = getComputedStyle(element);
  const roughness = style.getPropertyValue("--doodle-ui-roughness").trim();
  const bowing = style.getPropertyValue("--doodle-ui-bowing").trim();
  const strokeWidth = style.getPropertyValue("--doodle-ui-stroke-width").trim();
  const sketchColor = style.getPropertyValue("--doodle-ui-stroke-color").trim();
  const fillStyle = style.getPropertyValue("--doodle-ui-fill-style").trim() as FillStyle;

  return {
    roughness: roughness ? parseFloat(roughness) : undefined,
    bowing: bowing ? parseFloat(bowing) : undefined,
    strokeWidth: strokeWidth ? parseFloat(strokeWidth) : undefined,
    sketchColor: sketchColor || undefined,
    fillStyle: fillStyle || undefined,
  };
}

export { DEFAULT_INK };
