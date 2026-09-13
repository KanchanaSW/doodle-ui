"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { SketchBox } from "../primitives/SketchBox";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontFamily } from "../utils";

export const TooltipProvider = TooltipPrimitive.Provider;

export interface TooltipProps extends SketchProps {
  content: ReactNode;
  children: ReactNode;
  side?: ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>["side"];
  delayDuration?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  delayDuration = 200,
  className,
  roughness,
  seed,
  sketchColor,
  bowing,
  fillStyle,
  strokeWidth,
}: TooltipProps) {
  const ink = sketchColor ?? SKETCH_COLORS.ink;

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
            fill="#f7f6f2"
            strokeWidth={strokeWidth ?? 1.4}
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
