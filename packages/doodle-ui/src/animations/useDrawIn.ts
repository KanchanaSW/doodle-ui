"use client";

import { type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";

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

    // Dasharray alone does not hide the stroke. Never leave an inline
    // dashoffset if the animation fails to run — that permanently hid borders.
    path.style.strokeDasharray = `${length}`;
    try {
      const animation = path.animate(
        [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
        {
          duration,
          delay,
          easing: DRAW_IN_EASING,
          fill: "forwards",
        },
      );
      animation.finished
        .then(() => {
          clearDash(path);
          try {
            animation.cancel();
          } catch {
            /* already finished */
          }
        })
        .catch(() => {
          clearDash(path);
        });
      animations.push(animation);
    } catch {
      clearDash(path);
    }
  }

  running.set(target, animations);
}

/**
 * Sketch-in the rough.js stroke path on the first paint, and again when
 * `replayKey` changes (e.g. a hover seed swap).
 *
 * Keeps watching for RoughSvg path replacements so draw-in still runs after
 * late size measurement / redraws.
 *
 * @param pathRef - Ref to an SVG path, `<svg>`, or container with sketch paths
 * @param duration - Animation duration in ms
 * @default 400 ({@link DRAW_IN_DURATION_MS})
 * @param enabled - When false, cancels any in-flight draw-in
 * @default true
 * @param replayKey - When this value changes, the stroke redraws
 * @param delay - Delay before the animation starts (ms)
 * @default 0
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useDrawIn(ref, DRAW_IN_DURATION_MS, shouldAnimate, seed);
 */
export function useDrawIn(
  pathRef: RefObject<Element | null>,
  duration: number = DRAW_IN_DURATION_MS,
  enabled: boolean = true,
  replayKey?: unknown,
  delay: number = 0,
): void {
  useIsomorphicLayoutEffect(() => {
    const target = pathRef.current;
    if (!target) return;

    if (!enabled) {
      cancelDrawIn(target);
      return;
    }

    let cancelled = false;
    let lastPathSignature = "";

    const pathSignature = () =>
      getStrokePaths(target)
        .map((path) => path.getAttribute("d") ?? "")
        .join("|");

    const apply = () => {
      if (cancelled) return;
      const paths = getStrokePaths(target);
      if (paths.length === 0) return;
      const signature = pathSignature();
      // Avoid restarting the same stroke on unrelated DOM churn.
      if (signature === lastPathSignature && signature !== "") return;
      lastPathSignature = signature;
      drawIn(target, duration, delay);
    };

    apply();

    const observer = new MutationObserver(() => {
      apply();
    });
    observer.observe(target, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      observer.disconnect();
      cancelDrawIn(target);
    };
  }, [pathRef, duration, enabled, replayKey, delay]);
}
