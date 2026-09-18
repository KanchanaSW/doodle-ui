"use client";

import { forwardRef, memo, type HTMLAttributes } from "react";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, doodleUiFontWeight } from "../utils";

export type BadgeVariant = "default" | "accent" | "outline";

/**
 * Props for {@link Badge}.
 */
export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color">,
    SketchProps {
  /**
   * Visual style preset.
   * @default "primary"
   */
  variant?: BadgeVariant;
  /**
   * Draw-in the border on mount. Defaults to the DoodleUIProvider value (true).
   */
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Small sketch label for counts and tags.
 *
 * @example
 * <Badge />
 */
export const Badge = memo(
  forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
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
    // Brand accent (#e24b3b) fails 4.5:1 on accentFill — use accentInk for text/stroke.
    const ink =
      variant === "accent"
        ? sketchColor ?? (theme.isDark ? theme.accent : theme.accentInk)
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
  }),
);
Badge.displayName = "Badge";
