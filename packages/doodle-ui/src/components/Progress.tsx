"use client";

import { useSketchDefaults } from "../hooks/useSketchDefaults";
import {
  forwardRef,
  useRef,
  type HTMLAttributes,
  type MutableRefObject,
} from "react";
import {
  DRAW_IN_DURATION_MS,
  useAnimate,
  useDrawIn,
  useTweenNumber,
} from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import type { SketchProps } from "../types";
import { assignRef, cn, deriveSeed } from "../utils";

/**
 * Props for {@link Progress}.
 */
export interface ProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    SketchProps {
  value?: number;
  max?: number;
  /**
   * Draw-in the track on mount and redraw the fill as value changes.
   * Defaults to the DoodleUIProvider value (true).
   */
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Progress bar with rough fill.
 *
 * @example
 * <Progress />
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(
    {
      className,
      style,
      value = 0,
      max = 100,
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      hachureGap,
      fillWeight,
      animate,
      ...rest
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLSpanElement>(null);
    const { roughness: baseRoughness } = useSketchDefaults();
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.accent;
    const trackInk = sketchColor ?? (theme.isDark ? "rgba(243, 244, 246, 0.45)" : theme.ink);
    const clamped = Math.min(max, Math.max(0, value));
    const percent = max === 0 ? 0 : (clamped / max) * 100;
    const shouldAnimate = useAnimate(animate);
    const displayed = useTweenNumber(percent, shouldAnimate, 420);
    const resolvedSeed = useResolvedSeed(seed);
    const fillSeed = shouldAnimate
      ? deriveSeed(resolvedSeed, `fill-${Math.round(displayed / 6)}`)
      : resolvedSeed;
    const fillRoughness =
      (roughness ?? baseRoughness) + 0.4 + (displayed / 100) * 0.7;

    useDrawIn(trackRef, DRAW_IN_DURATION_MS, shouldAnimate);

    return (
      <div
        ref={(node) => {
          (rootRef as MutableRefObject<HTMLDivElement | null>).current = node;
          assignRef(ref, node);
        }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
        className={cn(className)}
        style={{
          position: "relative",
          width: "100%",
          height: 18,
          ...style,
        }}
        {...rest}
      >
        <span
          ref={trackRef}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <RoughSvg
            shape="rectangle"
            roughness={roughness}
            seed={resolvedSeed}
            sketchColor={trackInk}
            bowing={bowing}
            strokeWidth={strokeWidth ?? 1.5}
            inset={2}
          />
        </span>
        {displayed > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 5,
              top: 4,
              bottom: 4,
              width: `calc(${displayed}% - 10px)`,
              minWidth: displayed > 0 ? 8 : 0,
              overflow: "hidden",
            }}
          >
            <RoughSvg
              shape="rectangle"
              roughness={fillRoughness}
              seed={fillSeed}
              sketchColor={ink}
              fill={ink}
              fillStyle={fillStyle ?? "hachure"}
              bowing={bowing}
              strokeWidth={1.1}
              hachureGap={hachureGap ?? 5}
              fillWeight={fillWeight ?? 1.2}
              inset={1}
            />
          </div>
        ) : null}
      </div>
    );
  },
);
