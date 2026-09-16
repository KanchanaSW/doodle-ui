"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, doodleUiFontWeight } from "../utils";

export type BadgeVariant = "default" | "accent" | "outline";

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color">,
    SketchProps {
  variant?: BadgeVariant;
  /**
   * Draw-in the border on mount. Defaults to the DoodleUIProvider value (true).
   */
  animate?: boolean;
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
    hachureGap,
    hachureAngle,
    fillWeight,
    animate,
    ...rest
  },
  ref,
) {
  const theme = useSketchTheme(sketchColor);
  const ink =
    variant === "accent"
      ? sketchColor ?? theme.accent
      : sketchColor ?? theme.ink;

  const fill =
    variant === "accent"
      ? (theme.isDark ? (sketchColor ? `${sketchColor}25` : theme.accentFill) : theme.accentFill)
      : variant === "outline"
        ? undefined
        : theme.secondaryFill;

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
        fontWeight: doodleUiFontWeight(650),
        lineHeight: 1.4,
        letterSpacing: "0.01em",
        color: ink,
      }}
      fill={fill}
      fillStyle={fillStyle ?? (fill ? "hachure" : undefined)}
      hachureGap={hachureGap ?? 6}
      hachureAngle={hachureAngle}
      fillWeight={fillWeight ?? 0.9}
      roughness={roughness}
      seed={seed}
      sketchColor={ink}
      bowing={bowing}
      strokeWidth={strokeWidth ?? 1.4}
      animate={animate}
      {...rest}
    >
      <span ref={ref}>{children}</span>
    </SketchBox>
  );
});
