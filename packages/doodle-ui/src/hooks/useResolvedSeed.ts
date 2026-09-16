"use client";

import { useState } from "react";
import { useOptionalSketchSeed } from "../context/SketchSeedContext";
import { randomSeed } from "../utils";

/**
 * Resolves the seed used to draw a sketch.
 *
 * Priority: explicit `seed` prop → {@link SketchSeedProvider} → stable mount random.
 *
 * @param seed - Optional locked seed from a component prop
 * @returns Integer seed for rough.js
 *
 * @example
 * const resolved = useResolvedSeed(props.seed);
 */
export function useResolvedSeed(seed?: number): number {
  const ctx = useOptionalSketchSeed();
  const [fallback] = useState(randomSeed);
  if (seed != null) return seed;
  if (ctx) return ctx.seed;
  return fallback;
}
