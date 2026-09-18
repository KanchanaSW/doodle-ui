"use client";

import { useEffect, useState } from "react";
import { useOptionalSketchSeed } from "../context/SketchSeedContext";
import { DEFAULT_SEED, randomSeed } from "../utils";

export { DEFAULT_SEED };

/**
 * Resolves the seed used to draw a sketch.
 *
 * Priority: explicit `seed` prop → {@link SketchSeedProvider} → stable mount random.
 *
 * Uncontrolled seeds (no prop, no provider) use {@link DEFAULT_SEED} on the
 * server and during the client's first render, then switch to a random seed
 * after hydration so SSR markup matches.
 *
 * @param seed - Optional locked seed from a component prop
 * @returns Integer seed for rough.js
 *
 * @example
 * const resolved = useResolvedSeed(props.seed);
 */
export function useResolvedSeed(seed?: number): number {
  const ctx = useOptionalSketchSeed();
  const hasProvider = ctx != null;
  const [clientSeed, setClientSeed] = useState<number | null>(null);

  useEffect(() => {
    if (seed != null || hasProvider) return;
    setClientSeed(randomSeed());
  }, [seed, hasProvider]);

  if (seed != null) return seed;
  if (ctx) return ctx.seed;
  return clientSeed ?? DEFAULT_SEED;
}
