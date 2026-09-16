"use client";

import {
  createContext,
  useContext,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { FillStyle } from "../types";

export type DoodleUITheme = "light" | "dark" | "system";

/**
 * Values exposed by {@link DoodleUIProvider} to hooks and descendant components.
 */
export interface DoodleUIContextValue {
  /**
   * Default for components that do not set their own `animate` prop.
   * @default true
   */
  animate: boolean;
  /**
   * When true, skip the prefers-reduced-motion disable.
   * @default false
   */
  forceAnimate: boolean;
  /**
   * Theme mode for {@link useSketchTheme} palette resolution.
   * @default "system"
   */
  theme?: DoodleUITheme;
  /**
   * Global default roughness for sketch chrome when a component omits `roughness`.
   * @default undefined (use CSS var or {@link DEFAULT_ROUGHNESS})
   */
  roughness?: number;
  /**
   * Global default stroke width when a component omits `strokeWidth`.
   * @default undefined (use CSS var or {@link DEFAULT_STROKE_WIDTH})
   */
  strokeWidth?: number;
  /**
   * Global default stroke color when a component omits `sketchColor`.
   * @default undefined (theme ink)
   */
  sketchColor?: string;
  /**
   * Global default fill pattern when a component has a fill but omits `fillStyle`.
   * @default undefined
   */
  fillStyle?: FillStyle;
  /**
   * Global default bowing when a component omits `bowing`.
   * @default undefined (use CSS var or {@link DEFAULT_BOWING})
   */
  bowing?: number;
}

const DoodleUIContext = createContext<DoodleUIContextValue | null>(null);

/**
 * Root provider for doodle-ui animation defaults, light/dark sketch palette, and
 * optional global sketch parameters (roughness, stroke, fill style, bowing).
 *
 * @example
 * <DoodleUIProvider roughness={2} strokeWidth={2} theme="light">
 *   <Button>Sketchy</Button>
 * </DoodleUIProvider>
 *
 * @see SketchSeedProvider
 */
export interface DoodleUIProviderProps {
  children: ReactNode;
  /**
   * Default animation setting for descendant doodle-ui components.
   * Per-component `animate` still wins when it is set.
   * @default true
   */
  animate?: boolean;
  /**
   * Play animations even when the user prefers reduced motion.
   * @default false
   */
  forceAnimate?: boolean;
  /**
   * Theme mode: `"light"`, `"dark"`, or `"system"` (follows document / OS).
   * @default "system"
   */
  theme?: DoodleUITheme;
  /**
   * Default sketch roughness for descendants. Also sets `--doodle-ui-roughness` on the provider scope.
   * @default undefined
   * @example
   * <DoodleUIProvider roughness={2.4} />
   */
  roughness?: number;
  /**
   * Default stroke width for descendants. Also sets `--doodle-ui-stroke-width`.
   * @default undefined
   */
  strokeWidth?: number;
  /**
   * Default stroke color for descendants. Also sets `--doodle-ui-stroke-color`.
   * @default undefined
   */
  sketchColor?: string;
  /**
   * Default fill style when shapes have a fill. Also sets `--doodle-ui-fill-style`.
   * @default undefined
   */
  fillStyle?: FillStyle;
  /**
   * Default line bowing for descendants. Also sets `--doodle-ui-bowing`.
   * @default undefined
   */
  bowing?: number;
}

export function DoodleUIProvider({
  children,
  animate = true,
  forceAnimate = false,
  theme = "system",
  roughness,
  strokeWidth,
  sketchColor,
  fillStyle,
  bowing,
}: DoodleUIProviderProps) {
  const value = useMemo(
    () => ({
      animate,
      forceAnimate,
      theme,
      roughness,
      strokeWidth,
      sketchColor,
      fillStyle,
      bowing,
    }),
    [
      animate,
      forceAnimate,
      theme,
      roughness,
      strokeWidth,
      sketchColor,
      fillStyle,
      bowing,
    ],
  );

  const scopeStyle = useMemo((): CSSProperties => {
    const vars: Record<string, string | number> = {};
    if (roughness !== undefined) vars["--doodle-ui-roughness"] = roughness;
    if (strokeWidth !== undefined) vars["--doodle-ui-stroke-width"] = strokeWidth;
    if (sketchColor !== undefined) vars["--doodle-ui-stroke-color"] = sketchColor;
    if (fillStyle !== undefined) vars["--doodle-ui-fill-style"] = fillStyle;
    if (bowing !== undefined) vars["--doodle-ui-bowing"] = bowing;
    if (Object.keys(vars).length === 0) return {};
    return vars as CSSProperties;
  }, [roughness, strokeWidth, sketchColor, fillStyle, bowing]);

  const hasScopeVars = Object.keys(scopeStyle).length > 0;

  return (
    <DoodleUIContext.Provider value={value}>
      {hasScopeVars ? (
        <div style={{ display: "contents", ...scopeStyle }}>{children}</div>
      ) : (
        children
      )}
    </DoodleUIContext.Provider>
  );
}

/**
 * Reads animation and sketch defaults from the nearest {@link DoodleUIProvider}.
 * Returns built-in defaults when no provider is mounted.
 *
 * @returns Provider context or `{ animate: true, forceAnimate: false, theme: "system" }`.
 *
 * @example
 * const { animate, roughness } = useDoodleUI();
 */
export function useDoodleUI(): DoodleUIContextValue {
  return (
    useContext(DoodleUIContext) ?? { animate: true, forceAnimate: false, theme: "system" }
  );
}

export { DoodleUIContext };
