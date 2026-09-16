"use client";

import { useSketchDefaults } from "../hooks/useSketchDefaults";
import { forwardRef, useEffect, useState, type HTMLAttributes } from "react";
import { RoughSvg } from "../primitives/RoughSvg";
import type { RoughShape, SketchProps } from "../types";
import { cn } from "../utils";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { deriveSeed } from "../utils";

export type SkeletonVariant = "text" | "rect" | "circle";

/**
 * Props for {@link Skeleton}.
 */
export interface SkeletonProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    SketchProps {
  /**
   * Visual style preset.
   * @default "primary"
   */
  variant?: SkeletonVariant;
  pulse?: boolean;
  width?: number | string;
  height?: number | string;
}

/**
 * Loading placeholder with scribble fill.
 *
 * @example
 * <Skeleton />
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(
    {
      className,
      style,
      variant = "rect",
      pulse = true,
      width,
      height,
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      hachureGap,
      hachureAngle,
      fillWeight,
      ...rest
    },
    ref,
  ) {
    const base = useResolvedSeed(seed);
    const [tick, setTick] = useState(0);
    const { roughness: baseRoughness } = useSketchDefaults();
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;

    useEffect(() => {
      if (!pulse) return;
      const id = window.setInterval(() => {
        setTick((current) => current + 1);
      }, 900);
      return () => window.clearInterval(id);
    }, [pulse]);

    const resolved = pulse ? deriveSeed(base, `pulse-${tick}`) : base;
    const shape: RoughShape = variant === "circle" ? "ellipse" : "rectangle";
    const defaultHeight = variant === "text" ? 14 : variant === "circle" ? 40 : 80;
    const defaultWidth = variant === "circle" ? 40 : "100%";

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(className)}
        style={{
          position: "relative",
          width: width ?? defaultWidth,
          height: height ?? defaultHeight,
          maxWidth: "100%",
          ...style,
        }}
        {...rest}
      >
        <RoughSvg
          shape={shape}
          roughness={(roughness ?? baseRoughness) + 0.4}
          seed={resolved}
          sketchColor={ink}
          fill={ink}
          fillStyle={fillStyle ?? "hachure"}
          bowing={bowing ?? 1.6}
          strokeWidth={strokeWidth ?? 1.1}
          hachureGap={hachureGap}
          hachureAngle={hachureAngle}
          fillWeight={fillWeight}
          inset={2}
          style={{ opacity: 0.28 }}
        />
      </div>
    );
  },
);
