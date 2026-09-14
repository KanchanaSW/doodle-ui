"use client";

import { forwardRef, useEffect, useState, type HTMLAttributes } from "react";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type RoughShape, type SketchProps } from "../types";
import { cn } from "../utils";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { deriveSeed } from "../utils";

export type SkeletonVariant = "text" | "rect" | "circle";

export interface SkeletonProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    SketchProps {
  variant?: SkeletonVariant;
  pulse?: boolean;
  width?: number | string;
  height?: number | string;
}

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
      ...rest
    },
    ref,
  ) {
    const base = useResolvedSeed(seed);
    const [tick, setTick] = useState(0);
    const ink = sketchColor ?? SKETCH_COLORS.ink;

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
          roughness={(roughness ?? 1.5) + 0.4}
          seed={resolved}
          sketchColor={ink}
          fill={ink}
          fillStyle={fillStyle ?? "hachure"}
          bowing={bowing ?? 1.6}
          strokeWidth={strokeWidth ?? 1.1}
          inset={2}
          style={{ opacity: 0.28 }}
        />
      </div>
    );
  },
);
