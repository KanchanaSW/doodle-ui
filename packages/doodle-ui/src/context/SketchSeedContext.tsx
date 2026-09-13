"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { randomSeed } from "../utils";

export interface SketchSeedContextValue {
  seed: number;
  shuffle: () => void;
  setSeed: (seed: number) => void;
}

const SketchSeedContext = createContext<SketchSeedContextValue | null>(null);

export interface SketchSeedProviderProps {
  children: ReactNode;
  initialSeed?: number;
}

export function SketchSeedProvider({
  children,
  initialSeed,
}: SketchSeedProviderProps) {
  const [seed, setSeed] = useState(() => initialSeed ?? randomSeed());

  const shuffle = useCallback(() => {
    setSeed(randomSeed());
  }, []);

  const value = useMemo(
    () => ({ seed, shuffle, setSeed }),
    [seed, shuffle],
  );

  return (
    <SketchSeedContext.Provider value={value}>
      {children}
    </SketchSeedContext.Provider>
  );
}

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
