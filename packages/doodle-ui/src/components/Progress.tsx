"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn } from "../utils";

export interface ProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    SketchProps {
  value?: number;
  max?: number;
}

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
      ...rest
    },
    ref,
  ) {
    const ink = sketchColor ?? SKETCH_COLORS.accent;
    const clamped = Math.min(max, Math.max(0, value));
    const percent = max === 0 ? 0 : (clamped / max) * 100;

    return (
      <div
        ref={ref}
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
        <RoughSvg
          shape="rectangle"
          roughness={roughness}
          seed={seed}
          sketchColor={SKETCH_COLORS.ink}
          bowing={bowing}
          strokeWidth={strokeWidth ?? 1.5}
          inset={2}
        />
        {percent > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 5,
              top: 4,
              bottom: 4,
              width: `calc(${percent}% - 10px)`,
              minWidth: percent > 0 ? 8 : 0,
              overflow: "hidden",
            }}
          >
            <RoughSvg
              shape="rectangle"
              roughness={(roughness ?? 1.5) + 0.55}
              seed={seed}
              sketchColor={ink}
              fill={ink}
              fillStyle={fillStyle ?? "hachure"}
              bowing={bowing}
              strokeWidth={1.1}
              inset={1}
            />
          </div>
        ) : null}
      </div>
    );
  },
);
