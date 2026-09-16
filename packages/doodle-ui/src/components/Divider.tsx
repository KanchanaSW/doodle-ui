"use client";

import { useBaseRoughness } from "../hooks/useSketchDefaults";
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
} from "../animations";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import type { SketchProps } from "../types";
import { assignRef, cn } from "../utils";

export type DividerOrientation = "horizontal" | "vertical";

/**
 * Props for {@link Divider}.
 */
export interface DividerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    SketchProps {
  orientation?: DividerOrientation;
  /**
   * Draw-in so the line extends across its length. Defaults to the
   * DoodleUIProvider value (true).
   */
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Horizontal or vertical squiggly rule.
 *
 * @example
 * <Divider />
 */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  function Divider(
    {
      className,
      style,
      orientation = "horizontal",
      roughness,
      seed,
      sketchColor,
      bowing,
      strokeWidth,
      hachureGap,
      hachureAngle,
      fillWeight,
      animate,
      ...rest
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const baseRoughness = useBaseRoughness();
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const shouldAnimate = useAnimate(animate);
    const horizontal = orientation === "horizontal";
    useDrawIn(rootRef, DRAW_IN_DURATION_MS, shouldAnimate);

    return (
      <div
        ref={(node) => {
          (rootRef as MutableRefObject<HTMLDivElement | null>).current = node;
          assignRef(ref, node);
        }}
        role="separator"
        aria-orientation={orientation}
        className={cn(className)}
        style={{
          position: "relative",
          width: horizontal ? "100%" : 12,
          height: horizontal ? 12 : "100%",
          minHeight: horizontal ? 12 : 48,
          ...style,
        }}
        {...rest}
      >
        <RoughSvg
          shape={horizontal ? "line" : "line-vertical"}
          roughness={roughness ?? baseRoughness}
          seed={seed}
          sketchColor={ink}
          bowing={bowing ?? 2}
          strokeWidth={strokeWidth ?? 1.5}
          hachureGap={hachureGap}
          hachureAngle={hachureAngle}
          fillWeight={fillWeight}
          inset={4}
        />
      </div>
    );
  },
);
