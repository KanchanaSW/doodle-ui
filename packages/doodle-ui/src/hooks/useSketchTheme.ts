"use client";

import { useEffect, useState } from "react";
import { useDoodleUI } from "../animations/DoodleUIProvider";
import {
  DARK_SKETCH_COLORS,
  DEFAULT_DARK_CARD_BG,
  DEFAULT_DARK_INK,
  DEFAULT_DARK_PAPER,
  DEFAULT_INK,
  DEFAULT_PAPER,
  SKETCH_COLORS,
} from "../types";

export interface ResolvedSketchTheme {
  isDark: boolean;
  ink: string;
  paper: string;
  cardBg: string;
  shadow: string;
  accent: string;
  /** High-contrast accent for text on accentFill (light mode). */
  accentInk: string;
  accentFill: string;
  secondaryFill: string;
  info: string;
  warning: string;
  error: string;
  success: string;
}

export type SketchTheme = ResolvedSketchTheme;

function checkIsDark(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  const root = document.documentElement;
  if (root.classList.contains("light")) return false;
  const dataTheme = root.getAttribute("data-theme");
  if (dataTheme === "light") return false;
  if (root.classList.contains("dark")) return true;
  if (dataTheme === "dark") return true;
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return true;
  }
  return false;
}

function cssColor(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function paletteFromCss(isDark: boolean) {
  const js = isDark ? DARK_SKETCH_COLORS : SKETCH_COLORS;
  const paperFallback = isDark ? DEFAULT_DARK_PAPER : DEFAULT_PAPER;
  const cardFallback = isDark ? DEFAULT_DARK_CARD_BG : DEFAULT_PAPER;
  const inkFallback = isDark ? DEFAULT_DARK_INK : DEFAULT_INK;

  return {
    stroke: cssColor("--doodle-ui-stroke-color", inkFallback),
    paper: cssColor("--doodle-ui-bg-color", paperFallback),
    cardBg: cssColor("--doodle-ui-bg-color", cardFallback),
    info: cssColor("--doodle-ui-color-info", js.info),
    warning: cssColor("--doodle-ui-color-warning", js.warning),
    error: cssColor("--doodle-ui-color-error", js.error),
    success: cssColor("--doodle-ui-color-success", js.success),
    accent: js.accent,
    accentInk: js.accentInk,
    accentFill: js.accentFill,
    secondaryFill: js.secondaryFill,
    shadow: isDark ? "rgba(0, 0, 0, 0.45)" : inkFallback,
  };
}

/**
 * Resolves ink, paper, accent, and status colors from {@link DoodleUIProvider}
 * theme mode and optional stroke override.
 *
 * @param sketchColorOverride - Same as component `sketchColor` prop
 * @returns Palette tokens for the current light/dark mode
 *
 * @example
 * const { ink, paper, accent } = useSketchTheme(sketchColor);
 */
export function useSketchTheme(sketchColorOverride?: string): ResolvedSketchTheme {
  const doodleContext = useDoodleUI();
  const contextTheme = doodleContext?.theme;

  const [isClientDark, setIsClientDark] = useState<boolean>(() => {
    if (contextTheme === "dark") return true;
    if (contextTheme === "light") return false;
    // Deterministic first render (SSR + hydration). Prefer-color-scheme /
    // DOM class detection runs in useEffect after mount.
    return false;
  });

  useEffect(() => {
    if (contextTheme === "dark") {
      setIsClientDark(true);
      return;
    }
    if (contextTheme === "light") {
      setIsClientDark(false);
      return;
    }

    const update = () => {
      setIsClientDark(checkIsDark());
    };
    update();

    const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
    mediaQuery?.addEventListener?.("change", update);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "class" || m.attributeName === "data-theme") {
          update();
          break;
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => {
      mediaQuery?.removeEventListener?.("change", update);
      observer.disconnect();
    };
  }, [contextTheme]);

  const isDark = contextTheme === "dark" ? true : contextTheme === "light" ? false : isClientDark;

  const palette = paletteFromCss(isDark);
  const themedInk = isDark ? DEFAULT_DARK_INK : DEFAULT_INK;
  // Guard against light pages keeping dark-mode SSR/#f3f4f6 ink (or the reverse)
  // when prefers-color-scheme and provider theme disagree. Custom stroke colors still win.
  let stroke = palette.stroke;
  if (
    (contextTheme === "light" && stroke === DEFAULT_DARK_INK) ||
    (contextTheme === "dark" && stroke === DEFAULT_INK)
  ) {
    stroke = themedInk;
  }
  const ink = sketchColorOverride ?? stroke;

  return {
    isDark,
    ink,
    paper: palette.paper,
    cardBg: palette.cardBg,
    shadow: isDark ? palette.shadow : sketchColorOverride ?? ink,
    accent: palette.accent,
    accentInk: palette.accentInk,
    accentFill: palette.accentFill,
    secondaryFill: palette.secondaryFill,
    info: palette.info,
    warning: palette.warning,
    error: palette.error,
    success: palette.success,
  };
}
