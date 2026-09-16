"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { DRAW_IN_TOOLTIP_MS } from "../animations";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily } from "../utils";

export const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Props for {@link Tooltip}.
 */
export interface TooltipProps extends SketchProps {
  content: ReactNode;
  children: ReactNode;
  side?: ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>["side"];
  delayDuration?: number;
  className?: string;
  fill?: string;
  /**
   * Quick draw-in when the bubble shows (~180ms). Defaults to the
   * DoodleUIProvider value (true).
   */
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Hover tooltip in a sketch bubble.
 *
 * @example
 * <Tooltip />
 */
export function Tooltip({
  content,
  children,
  side = "top",
  delayDuration = 200,
  className,
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
}: TooltipProps) {
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;

  return (
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={8}
          className={cn(className)}
          style={{ zIndex: 60, outline: "none" }}
        >
          <SketchBox
            roughness={roughness ?? 1.3}
            seed={seed}
            sketchColor={ink}
            bowing={bowing}
            fillStyle={fillStyle ?? "solid"}
            fill={fill ?? theme.paper}
            strokeWidth={strokeWidth ?? 1.4}
            hachureGap={hachureGap}
            hachureAngle={hachureAngle}
            fillWeight={fillWeight}
            animate={animate}
            drawInDuration={DRAW_IN_TOOLTIP_MS}
            contentStyle={{
              padding: "6px 10px",
              fontSize: 13,
              lineHeight: 1.35,
              fontFamily: doodleUiFontFamily,
              color: ink,
              maxWidth: 240,
            }}
          >
            {content}
          </SketchBox>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
