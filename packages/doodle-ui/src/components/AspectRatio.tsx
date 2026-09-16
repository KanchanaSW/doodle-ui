"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import type { CSSProperties, ReactNode } from "react";
import { SketchBox } from "../primitives/SketchBox";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn } from "../utils";

export interface AspectRatioProps extends SketchProps {
  ratio?: number;
  /** Wrap content in a hand-drawn frame. Default false — ratio box only. */
  bordered?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  animate?: boolean;
}

export function AspectRatio({
  ratio = 16 / 9,
  bordered = false,
  className,
  style,
  children,
  roughness,
  seed,
  sketchColor,
  bowing,
  fillStyle,
  strokeWidth,
  animate,
}: AspectRatioProps) {
  const inner = (
    <AspectRatioPrimitive.Root
      ratio={ratio}
      className={cn(className)}
      style={{
        width: "100%",
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ width: "100%", height: "100%" }}>{children}</div>
    </AspectRatioPrimitive.Root>
  );

  if (!bordered) {
    return inner;
  }

  return (
    <SketchBox
      className={cn(className)}
      style={{ width: "100%", ...style }}
      contentStyle={{ padding: 0, width: "100%" }}
      fill={SKETCH_COLORS.paper}
      fillStyle={fillStyle ?? "hachure"}
      roughness={roughness}
      seed={seed}
      sketchColor={sketchColor}
      bowing={bowing}
      strokeWidth={strokeWidth}
      animate={animate}
    >
      <AspectRatioPrimitive.Root ratio={ratio} style={{ width: "100%" }}>
        <div style={{ width: "100%", height: "100%" }}>{children}</div>
      </AspectRatioPrimitive.Root>
    </SketchBox>
  );
}
