"use client";

import {
  forwardRef,
  memo,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SketchBox } from "../primitives/SketchBox";
import { DoodleIcon } from "../primitives/icon";
import {
  BADGE_SIZE_STYLES,
  resolveSize,
  type DoodleSize,
} from "../primitives/size";
import type { SketchProps } from "../types";
import { cn, doodleUiFontWeight } from "../utils";

export type BadgeVariant = "default" | "accent" | "outline";
export type BadgeSize = DoodleSize;

/**
 * Props for {@link Badge}.
 */
export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color">,
    SketchProps {
  /**
   * Visual style preset.
   * @default "default"
   */
  variant?: BadgeVariant;
  /**
   * Control size preset.
   * @default "md"
   */
  size?: BadgeSize;
  /**
   * Merge props onto the single child instead of rendering a wrapper span.
   * @default false
   */
  asChild?: boolean;
  /** Leading icon. */
  startIcon?: ReactNode;
  /** Trailing icon. */
  endIcon?: ReactNode;
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
 * <Badge>New</Badge>
 * <Badge asChild><a href="/tags/art">Art</a></Badge>
 */
export const Badge = memo(
  forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
    {
      children,
      className,
      style,
      variant = "default",
      size: sizeProp = "md",
      asChild = false,
      startIcon,
      endIcon,
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
    const size = resolveSize(sizeProp);
    const theme = useSketchTheme(sketchColor);
    const ink =
      variant === "accent"
        ? sketchColor ?? (theme.isDark ? theme.accent : theme.accentInk)
        : sketchColor ?? theme.ink;

    const fill =
      variant === "accent"
        ? theme.isDark
          ? sketchColor
            ? `${sketchColor}25`
            : theme.accentFill
          : theme.accentFill
        : variant === "outline"
          ? undefined
          : theme.secondaryFill;

    const contentStyle = {
      ...BADGE_SIZE_STYLES[size],
      fontWeight: doodleUiFontWeight(650),
      letterSpacing: "0.01em",
      color: ink,
      display: "inline-flex" as const,
      alignItems: "center" as const,
      gap: 4,
    };

    return (
      <SketchBox
        className={cn(className)}
        style={{
          display: "inline-flex",
          verticalAlign: "middle",
          ...style,
        }}
        contentStyle={contentStyle}
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
        asChild={asChild}
        {...rest}
      >
        {asChild ? (
          children
        ) : (
          <span
            ref={ref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {startIcon ? <DoodleIcon size={size}>{startIcon}</DoodleIcon> : null}
            {children}
            {endIcon ? <DoodleIcon size={size}>{endIcon}</DoodleIcon> : null}
          </span>
        )}
      </SketchBox>
    );
  }),
);
Badge.displayName = "Badge";
