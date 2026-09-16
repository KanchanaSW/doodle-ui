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
  if (root.classList.contains("dark")) return true;
  const dataTheme = root.getAttribute("data-theme");
  if (dataTheme === "dark") return true;
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return true;
  }
  return false;
}

export function useSketchTheme(sketchColorOverride?: string): ResolvedSketchTheme {
  const doodleContext = useDoodleUI();
  const contextTheme = doodleContext?.theme;

  const [isClientDark, setIsClientDark] = useState<boolean>(() => {
    if (contextTheme === "dark") return true;
    if (contextTheme === "light") return false;
    return checkIsDark();
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

    // "system" / "auto" mode: detect from DOM and media query
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

  const baseInk = isDark ? DEFAULT_DARK_INK : DEFAULT_INK;
  const ink = sketchColorOverride ?? baseInk;

  if (isDark) {
    return {
      isDark: true,
      ink,
      paper: DEFAULT_DARK_PAPER,
      cardBg: DEFAULT_DARK_CARD_BG,
      shadow: "rgba(0, 0, 0, 0.45)",
      accent: DARK_SKETCH_COLORS.accent,
      accentFill: DARK_SKETCH_COLORS.accentFill,
      secondaryFill: DARK_SKETCH_COLORS.secondaryFill,
      info: DARK_SKETCH_COLORS.info,
      warning: DARK_SKETCH_COLORS.warning,
      error: DARK_SKETCH_COLORS.error,
      success: DARK_SKETCH_COLORS.success,
    };
  }

  return {
    isDark: false,
    ink,
    paper: DEFAULT_PAPER,
    cardBg: DEFAULT_PAPER,
    shadow: sketchColorOverride ?? DEFAULT_INK,
    accent: SKETCH_COLORS.accent,
    accentFill: SKETCH_COLORS.accentFill,
    secondaryFill: SKETCH_COLORS.secondaryFill,
    info: SKETCH_COLORS.info,
    warning: SKETCH_COLORS.warning,
    error: SKETCH_COLORS.error,
    success: SKETCH_COLORS.success,
  };
}
