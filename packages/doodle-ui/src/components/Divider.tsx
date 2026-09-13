"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn } from "../utils";

export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    SketchProps {
  orientation?: DividerOrientation;
}

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
      ...rest
    },
    ref,
  ) {
    const horizontal = orientation === "horizontal";

    return (
      <div
        ref={ref}
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
          roughness={roughness ?? 1.8}
          seed={seed}
          sketchColor={sketchColor ?? SKETCH_COLORS.ink}
          bowing={bowing ?? 2}
          strokeWidth={strokeWidth ?? 1.5}
          inset={4}
        />
      </div>
    );
  },
);
