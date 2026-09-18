"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { DEFAULT_SEED, nextFontIndex, randomSeed } from "../utils";

/**
 * Seed and font shuffle state from {@link SketchSeedProvider}.
 */
export interface SketchSeedContextValue {
  /**
   * Current sketch seed shared by components without an explicit `seed` prop.
   * Changes when {@link SketchSeedContextValue.shuffle} runs.
   */
  seed: number;
  /**
   * Index into the provider `fonts` array. `0` means page default font.
   */
  fontIndex: number;
  /**
   * Picks a new random seed and advances the font palette index.
   */
  shuffle: () => void;
  /**
   * Sets the shared seed explicitly (e.g. for reproducible layouts).
   * @param seed - Integer seed for rough.js
   */
  setSeed: (seed: number) => void;
}

const SketchSeedContext = createContext<SketchSeedContextValue | null>(null);

/**
 * Props for {@link SketchSeedProvider}.
 */
export interface SketchSeedProviderProps {
  children: ReactNode;
  /**
   * Initial shared sketch seed. Random after mount when omitted.
   * Uses a deterministic default on the server / first client render so SSR
   * and hydration match; a random seed is applied in `useEffect` when unset.
   * @default undefined (deterministic then randomize after mount)
   */
  initialSeed?: number;
  /**
   * CSS `font-family` values cycled by Shuffle. Index `0` is the page default
   * (`--doodle-ui-font` left unset).
   * @default undefined
   * @example
   * <SketchSeedProvider fonts={['"Patrick Hand"', '"Kalam"']} />
   */
  fonts?: readonly string[];
  /**
   * Starting index into `fonts`.
   * @default 0
   */
  initialFontIndex?: number;
}

/**
 * Supplies a shared sketch seed and optional hand-font cycling for Shuffle.
 * Wrap your app next to {@link DoodleUIProvider}.
 *
 * @example
 * <SketchSeedProvider>
 *   <Button onClick={() => shuffle()}>Redraw</Button>
 * </SketchSeedProvider>
 *
 * @see useSketchSeed
 */
export function SketchSeedProvider({
  children,
  initialSeed,
  fonts,
  initialFontIndex = 0,
}: SketchSeedProviderProps) {
  const [seed, setSeed] = useState(() => initialSeed ?? DEFAULT_SEED);
  const [fontIndex, setFontIndex] = useState(initialFontIndex);
  const fontCount = fonts?.length ?? 0;

  useEffect(() => {
    if (initialSeed !== undefined) return;
    setSeed(randomSeed());
  }, [initialSeed]);

  const shuffle = useCallback(() => {
    setSeed(randomSeed());
    setFontIndex((current) => nextFontIndex(current, fontCount));
  }, [fontCount]);

  const activeFamily = fontIndex > 0 ? fonts?.[fontIndex] : undefined;

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    if (activeFamily) {
      root.style.setProperty("--doodle-ui-font", activeFamily);
      root.style.setProperty("--doodle-ui-font-weight", "400");
    } else {
      root.style.setProperty("--doodle-ui-font", "initial");
      root.style.setProperty("--doodle-ui-font-weight", "initial");
    }
    return () => {
      root.style.removeProperty("--doodle-ui-font");
      root.style.removeProperty("--doodle-ui-font-weight");
    };
  }, [activeFamily]);

  const value = useMemo(
    () => ({ seed, fontIndex, shuffle, setSeed }),
    [seed, fontIndex, shuffle],
  );

  return (
    <SketchSeedContext.Provider value={value}>
      {children}
    </SketchSeedContext.Provider>
  );
}

/**
 * Returns shared seed and shuffle helpers from {@link SketchSeedProvider}.
 *
 * @throws When used outside `<SketchSeedProvider>`.
 *
 * @example
 * const { seed, shuffle } = useSketchSeed();
 */
export function useSketchSeed(): SketchSeedContextValue {
  const ctx = useContext(SketchSeedContext);
  if (!ctx) {
    throw new Error(
      "useSketchSeed() must be used inside <SketchSeedProvider>. Wrap your tree so Shuffle can redraw every sketch.",
    );
  }
  return ctx;
}

export function useOptionalSketchSeed(): SketchSeedContextValue | null {
  return useContext(SketchSeedContext);
}

export { SketchSeedContext };
