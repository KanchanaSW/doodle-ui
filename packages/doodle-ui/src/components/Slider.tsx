"use client";

import { useSketchDefaults } from "../hooks/useSketchDefaults";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import type { SketchProps } from "../types";
import { cn, deriveSeed } from "../utils";

export type SliderThumbShape = "circle" | "square";

/**
 * Props for {@link Slider}.
 */
export interface SliderProps
  extends Omit<
      ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
      "asChild"
    >,
    SketchProps {
  thumbShape?: SliderThumbShape;
  fill?: string;
}

/**
 * Range slider with sketch track and thumb.
 *
 * @example
 * <Slider />
 */
export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  {
    className,
    style,
    fill,
    roughness,
    seed,
    sketchColor,
    bowing,
    fillStyle,
    strokeWidth,
    hachureGap,
    hachureAngle,
    fillWeight,
    thumbShape = "circle",
    ...rest
  },
  ref,
) {
  const { roughness: baseRoughness } = useSketchDefaults();
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;
  const accent = sketchColor ?? theme.accent;
  const trackInk = sketchColor ?? (theme.isDark ? "rgba(243, 244, 246, 0.4)" : theme.ink);
  const resolvedSeed = useResolvedSeed(seed);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(className)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: 28,
        userSelect: "none",
        touchAction: "none",
        color: ink,
        ...style,
      }}
      {...rest}
    >
      <SliderPrimitive.Track
        style={{
          position: "relative",
          flex: 1,
          height: 16,
        }}
      >
        <RoughSvg
          shape="line"
          roughness={roughness ?? baseRoughness}
          seed={resolvedSeed}
          sketchColor={trackInk}
          bowing={bowing ?? 2}
          strokeWidth={strokeWidth ?? 1.6}
          inset={4}
        />
        <SliderPrimitive.Range
          style={{
            position: "absolute",
            left: 0,
            height: "100%",
          }}
        >
          <RoughSvg
            shape="line"
            roughness={(roughness ?? baseRoughness) + 0.4}
            seed={deriveSeed(resolvedSeed, "range")}
            sketchColor={accent}
            bowing={bowing ?? 1.6}
            strokeWidth={(strokeWidth ?? 1.6) + 0.6}
            inset={4}
          />
        </SliderPrimitive.Range>
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        style={{
          display: "block",
          width: 20,
          height: 20,
          position: "relative",
          outline: "none",
          cursor: "grab",
        }}
      >
        <RoughSvg
          shape={thumbShape === "square" ? "rectangle" : "ellipse"}
          roughness={(roughness ?? baseRoughness) * 0.85}
          seed={deriveSeed(resolvedSeed, "thumb")}
          sketchColor={accent}
          fill={fill ?? theme.paper}
          fillStyle={fillStyle ?? "solid"}
          bowing={bowing}
          strokeWidth={(strokeWidth ?? 1.5) + 0.3}
          hachureGap={hachureGap}
          hachureAngle={hachureAngle}
          fillWeight={fillWeight}
          inset={1}
        />
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
});
