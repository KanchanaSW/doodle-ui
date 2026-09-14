"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn } from "../utils";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { deriveSeed } from "../utils";

export type SliderThumbShape = "circle" | "square";

export interface SliderProps
  extends Omit<
      ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
      "asChild"
    >,
    SketchProps {
  thumbShape?: SliderThumbShape;
}

export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  {
    className,
    style,
    roughness,
    seed,
    sketchColor,
    bowing,
    fillStyle,
    strokeWidth,
    thumbShape = "circle",
    ...rest
  },
  ref,
) {
  const ink = sketchColor ?? SKETCH_COLORS.ink;
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
          roughness={roughness ?? 1.8}
          seed={resolvedSeed}
          sketchColor={ink}
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
            roughness={(roughness ?? 1.5) + 0.4}
            seed={deriveSeed(resolvedSeed, "range")}
            sketchColor={SKETCH_COLORS.accent}
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
          roughness={(roughness ?? 1.5) * 0.85}
          seed={deriveSeed(resolvedSeed, "thumb")}
          sketchColor={SKETCH_COLORS.accent}
          fill="#f7f6f2"
          fillStyle={fillStyle ?? "solid"}
          bowing={bowing}
          strokeWidth={(strokeWidth ?? 1.5) + 0.3}
          inset={1}
        />
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
});
