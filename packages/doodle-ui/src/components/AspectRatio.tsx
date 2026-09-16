"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import type { CSSProperties, ReactNode } from "react";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn } from "../utils";

/**
 * Props for {@link AspectRatio}.
 */
export interface AspectRatioProps extends SketchProps {
  ratio?: number;
  /** Wrap content in a hand-drawn frame. Default false — ratio box only. */
  bordered?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  fill?: string;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Fixed aspect ratio container.
 *
 * @example
 * <AspectRatio />
 */
export function AspectRatio({
  ratio = 16 / 9,
  bordered = false,
  className,
  style,
  children,
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
  animate,
}: AspectRatioProps) {
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;

  const inner = (
    <AspectRatioPrimitive.Root
      ratio={ratio}
      className={cn(className)}
      style={{
        width: "100%",
        overflow: "hidden",
        color: ink,
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
      style={{ width: "100%", color: ink, ...style }}
      contentStyle={{ padding: 0, width: "100%", color: ink }}
      fill={fill ?? theme.paper}
      fillStyle={fillStyle ?? "solid"}
      hachureGap={hachureGap}
      hachureAngle={hachureAngle}
      fillWeight={fillWeight}
      roughness={roughness}
      seed={seed}
      sketchColor={ink}
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
