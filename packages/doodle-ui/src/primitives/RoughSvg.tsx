"use client";

import { useRef, type CSSProperties } from "react";
import rough from "roughjs";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import {
  mergeSketchProps,
  readSketchCssVars,
  useSketchDefaults,
} from "../hooks/useSketchDefaults";
import { useElementSize } from "../hooks/useElementSize";
import {
  DEFAULT_INSET,
  toRoughOptions,
  type RoughSvgProps,
} from "../types";

function ensureSvg(container: HTMLDivElement): SVGSVGElement {
  const existing = container.querySelector(":scope > svg");
  if (existing instanceof SVGSVGElement) return existing;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("overflow", "visible");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.style.display = "block";
  container.appendChild(svg);
  return svg;
}

function paintRough(
  container: HTMLDivElement,
  svg: SVGSVGElement,
  opts: {
    width: number;
    height: number;
    shape: RoughSvgProps["shape"];
    roughness?: number;
    seed: number;
    sketchColor?: string;
    bowing?: number;
    fillStyle?: RoughSvgProps["fillStyle"];
    strokeWidth?: number;
    fill?: string;
    hachureGap?: number;
    hachureAngle?: number;
    fillWeight?: number;
    inset: number;
    path?: string;
    sketchDefaults: ReturnType<typeof useSketchDefaults>;
  },
) {
  const {
    width,
    height,
    shape = "rectangle",
    roughness,
    seed,
    sketchColor,
    bowing,
    fillStyle,
    strokeWidth,
    fill,
    hachureGap,
    hachureAngle,
    fillWeight,
    inset,
    path,
    sketchDefaults,
  } = opts;

  if (width < 2 || height < 2) return;
  if (shape === "path" && !path) return;

  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const cssVars = readSketchCssVars(container);
  const merged = mergeSketchProps(
    {
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      hachureGap,
      hachureAngle,
      fillWeight,
    },
    sketchDefaults,
    cssVars,
  );

  const rc = rough.svg(svg);
  const options = toRoughOptions({
    roughness: merged.roughness,
    seed,
    sketchColor: merged.sketchColor,
    bowing: merged.bowing,
    fillStyle: merged.fillStyle,
    strokeWidth: merged.strokeWidth,
    fill,
    hachureGap,
    hachureAngle,
    fillWeight,
  });

  const x = inset;
  const y = inset;
  const w = Math.max(1, width - inset * 2);
  const h = Math.max(1, height - inset * 2);

  let node: SVGGElement;
  switch (shape) {
    case "ellipse":
      node = rc.ellipse(width / 2, height / 2, w, h, options);
      break;
    case "line":
      node = rc.line(inset, height / 2, width - inset, height / 2, options);
      break;
    case "line-vertical":
      node = rc.line(width / 2, inset, width / 2, height - inset, options);
      break;
    case "path":
      node = rc.path(path!, options);
      break;
    default:
      node = rc.rectangle(x, y, w, h, options);
  }

  svg.appendChild(node);
}

/**
 * Absolutely-positioned SVG layer that draws a rough.js shape behind HTML content.
 * Parent must be `position: relative`.
 *
 * The `<svg>` is created imperatively so React reconciliation cannot wipe
 * rough.js nodes on parent re-renders.
 *
 * @example
 * <div style={{ position: "relative" }}>
 *   <RoughSvg roughness={2} sketchColor="#1f1d1a" />
 *   <span>Content</span>
 * </div>
 *
 * @see SketchBox
 */
export function RoughSvg({
  shape = "rectangle",
  width: widthProp,
  height: heightProp,
  roughness,
  seed: seedProp,
  sketchColor,
  bowing,
  fillStyle,
  strokeWidth,
  fill,
  hachureGap,
  hachureAngle,
  fillWeight,
  inset = DEFAULT_INSET,
  path,
  className,
  style,
}: RoughSvgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measured = useElementSize(containerRef);
  const seed = useResolvedSeed(seedProp);
  const sketchDefaults = useSketchDefaults();

  const width = widthProp ?? measured.width;
  const height = heightProp ?? measured.height;

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const svg = ensureSvg(container);
    paintRough(container, svg, {
      width,
      height,
      shape,
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      fill,
      hachureGap,
      hachureAngle,
      fillWeight,
      inset,
      path,
      sketchDefaults,
    });
  }, [
    width,
    height,
    shape,
    roughness,
    seed,
    sketchColor,
    bowing,
    fillStyle,
    strokeWidth,
    fill,
    hachureGap,
    hachureAngle,
    fillWeight,
    inset,
    path,
    sketchDefaults,
  ]);

  // Late layout / wiped sketch recovery: if the layer is sized but empty, paint.
  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || width < 2 || height < 2) return;
    const svg = ensureSvg(container);
    if (svg.childElementCount > 0) return;
    paintRough(container, svg, {
      width,
      height,
      shape,
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      fill,
      hachureGap,
      hachureAngle,
      fillWeight,
      inset,
      path,
      sketchDefaults,
    });
  });

  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    overflow: "visible",
    zIndex: 0,
    ...style,
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={overlayStyle}
    />
  );
}
