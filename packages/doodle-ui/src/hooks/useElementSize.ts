"use client";

import { useState, type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

function readSize(el: HTMLElement): { width: number; height: number } {
  return {
    width: Math.round(el.offsetWidth),
    height: Math.round(el.offsetHeight),
  };
}

/**
 * Tracks an element's border-box size via {@link ResizeObserver}.
 * Also observes the parent and re-checks after animation frames / font load
 * so absolutely positioned sketch overlays pick up late layout (provider
 * font CSS vars, grid placement, etc.).
 */
export function useElementSize(
  ref: RefObject<HTMLElement | null>,
): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const next = readSize(el);
      setSize((prev) =>
        prev.width === next.width && prev.height === next.height ? prev : next,
      );
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    const parent = el.parentElement;
    if (parent) observer.observe(parent);

    // Provider font tokens and grid layout often settle after the first pass.
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      update();
      raf2 = requestAnimationFrame(update);
    });

    let cancelled = false;
    const fontsReady = document.fonts?.ready;
    fontsReady?.then(() => {
      if (!cancelled) update();
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [ref]);

  return size;
}
