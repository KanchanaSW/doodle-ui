"use client";

import { useLayoutEffect, type RefObject } from "react";

/** Default sketch-in duration. Ease-out over ~400ms. */
export const DRAW_IN_DURATION_MS = 400;
/** Alerts often appear dynamically — keep the sketch-in snappy. */
export const DRAW_IN_ALERT_MS = 200;
/** Tooltips are transient — draw in quickly. */
export const DRAW_IN_TOOLTIP_MS = 180;
/** Checkmarks, radio dots, and tab underlines. */
export const DRAW_IN_MARK_MS = 240;
/** Delay between table row rules. */
export const TABLE_STAGGER_MS = 40;

const DRAW_IN_EASING = "ease-out";

const running = new WeakMap<Element, Animation[]>();

/**
 * Rough.js puts fill (hachure) first and the outline last inside each `<g>`.
 * Animate the outline path so the border sketches in, not the wash.
 */
function collectStrokePaths(root: Element): SVGPathElement[] {
  const groups = root.querySelectorAll("g");
  if (groups.length > 0) {
    const paths: SVGPathElement[] = [];
    groups.forEach((group) => {
      const children = group.querySelectorAll(":scope > path");
      if (children.length === 0) return;
      paths.push(children[children.length - 1] as SVGPathElement);
    });
    return paths;
  }
  return Array.from(root.querySelectorAll("path"));
}

export function getStrokePaths(target: Element): SVGPathElement[] {
  if (target instanceof SVGPathElement) return [target];
  if (target instanceof SVGSVGElement) return collectStrokePaths(target);

  const svgs = target.querySelectorAll("svg");
  if (svgs.length > 0) {
    return Array.from(svgs).flatMap((svg) => collectStrokePaths(svg));
  }
  return collectStrokePaths(target);
}

function clearDash(path: SVGPathElement) {
  path.style.strokeDasharray = "";
  path.style.strokeDashoffset = "";
}

export function cancelDrawIn(target: Element | null): void {
  if (!target) return;
  const animations = running.get(target);
  animations?.forEach((animation) => animation.cancel());
  running.delete(target);
  getStrokePaths(target).forEach(clearDash);
}

export function drawIn(
  target: Element,
  duration: number = DRAW_IN_DURATION_MS,
  delay: number = 0,
): void {
  cancelDrawIn(target);
  const paths = getStrokePaths(target);
  const animations: Animation[] = [];

  for (const path of paths) {
    let length = 0;
    try {
      length = path.getTotalLength();
    } catch {
      continue;
    }
    if (length <= 0) continue;

    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const animation = path.animate(
      [{ strokeDashoffset: String(length) }, { strokeDashoffset: "0" }],
      { duration, delay, easing: DRAW_IN_EASING, fill: "forwards" },
    );
    animation.finished
      .then(() => {
        clearDash(path);
      })
      .catch(() => {
        /* cancelled */
      });
    animations.push(animation);
  }

  running.set(target, animations);
}

/**
 * Sketch-in the rough.js stroke path on the first paint, and again when
 * `replayKey` changes (e.g. a hover seed swap).
 *
 * `pathRef` may point at an SVG path, an `<svg>`, or any element that
 * contains one — the hook finds the outline path either way.
 */
export function useDrawIn(
  pathRef: RefObject<Element | null>,
  duration: number = DRAW_IN_DURATION_MS,
  enabled: boolean = true,
  replayKey?: unknown,
  delay: number = 0,
): void {
  useLayoutEffect(() => {
    const target = pathRef.current;
    if (!target) return;

    if (!enabled) {
      cancelDrawIn(target);
      return;
    }

    const apply = () => drawIn(target, duration, delay);

    if (getStrokePaths(target).length > 0) {
      apply();
      return () => cancelDrawIn(target);
    }

    const observer = new MutationObserver(() => {
      if (getStrokePaths(target).length === 0) return;
      observer.disconnect();
      apply();
    });
    observer.observe(target, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cancelDrawIn(target);
    };
  }, [pathRef, duration, enabled, replayKey, delay]);
}
