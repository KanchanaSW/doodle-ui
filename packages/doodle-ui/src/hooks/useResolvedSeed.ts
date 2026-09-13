"use client";

import { useState } from "react";
import { useOptionalSketchSeed } from "../context/SketchSeedContext";
import { randomSeed } from "../utils";

/**
 * Resolves the seed used to draw a sketch:
 * 1. explicit `seed` prop (locked, ignores Shuffle)
 * 2. SketchSeedProvider seed (redraws on Shuffle)
 * 3. a stable random seed generated on mount
 */
export function useResolvedSeed(seed?: number): number {
  const ctx = useOptionalSketchSeed();
  const [fallback] = useState(randomSeed);
  if (seed != null) return seed;
  if (ctx) return ctx.seed;
  return fallback;
}
