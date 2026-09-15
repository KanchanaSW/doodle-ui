"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

export interface DoodleUIContextValue {
  /** Default for components that do not set their own `animate` prop. */
  animate: boolean;
  /** When true, skip the prefers-reduced-motion disable. */
  forceAnimate: boolean;
}

const DoodleUIContext = createContext<DoodleUIContextValue | null>(null);

export interface DoodleUIProviderProps {
  children: ReactNode;
  /**
   * Default animation setting for descendant doodle-ui components.
   * Per-component `animate` still wins when it is set.
   */
  animate?: boolean;
  /**
   * Play animations even when the user prefers reduced motion.
   * Off by default — only set this as an explicit escape hatch.
   */
  forceAnimate?: boolean;
}

export function DoodleUIProvider({
  children,
  animate = true,
  forceAnimate = false,
}: DoodleUIProviderProps) {
  const value = useMemo(
    () => ({ animate, forceAnimate }),
    [animate, forceAnimate],
  );

  return (
    <DoodleUIContext.Provider value={value}>
      {children}
    </DoodleUIContext.Provider>
  );
}

export function useDoodleUI(): DoodleUIContextValue {
  return (
    useContext(DoodleUIContext) ?? { animate: true, forceAnimate: false }
  );
}

export { DoodleUIContext };
