"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { SketchBox } from "../primitives/SketchBox";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn } from "../utils";

export type BadgeVariant = "default" | "accent" | "outline";

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color">,
    SketchProps {
  variant?: BadgeVariant;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    children,
    className,
    style,
    variant = "default",
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
  const ink =
    variant === "accent"
      ? sketchColor ?? SKETCH_COLORS.accent
      : sketchColor ?? SKETCH_COLORS.ink;

  const fill =
    variant === "accent"
      ? SKETCH_COLORS.accentFill
      : variant === "outline"
        ? undefined
        : SKETCH_COLORS.secondaryFill;

  return (
    <SketchBox
      className={cn(className)}
      style={{
        display: "inline-flex",
        verticalAlign: "middle",
        ...style,
      }}
      contentStyle={{
        padding: "2px 10px",
        fontSize: 12,
        fontWeight: 650,
        lineHeight: 1.4,
        letterSpacing: "0.01em",
      }}
      fill={fill}
      fillStyle={fillStyle ?? "hachure"}
      roughness={roughness}
      seed={seed}
      sketchColor={ink}
      bowing={bowing}
      strokeWidth={strokeWidth ?? 1.4}
      {...rest}
    >
      <span ref={ref}>{children}</span>
    </SketchBox>
  );
});
