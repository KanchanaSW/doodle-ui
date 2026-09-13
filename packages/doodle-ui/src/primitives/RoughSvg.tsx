"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import rough from "roughjs";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useElementSize } from "../hooks/useElementSize";
import {
  DEFAULT_INSET,
  toRoughOptions,
  type RoughSvgProps,
} from "../types";

/**
 * Absolutely-positioned SVG layer that draws a rough.js shape behind HTML content.
 * Parent must be `position: relative`.
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
  inset = DEFAULT_INSET,
  path,
  className,
  style,
}: RoughSvgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const measured = useElementSize(containerRef);
  const seed = useResolvedSeed(seedProp);

  const width = widthProp ?? measured.width;
  const height = heightProp ?? measured.height;

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg || width < 2 || height < 2) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const options = toRoughOptions({
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      fill,
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
        if (!path) return;
        node = rc.path(path, options);
        break;
      default:
        node = rc.rectangle(x, y, w, h, options);
    }

    svg.appendChild(node);
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
    inset,
    path,
  ]);

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
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        overflow="visible"
        style={{ display: "block" }}
      />
    </div>
  );
}
