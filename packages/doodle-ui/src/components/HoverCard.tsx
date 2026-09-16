"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { SketchBox } from "../primitives/SketchBox";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn } from "../utils";

interface HoverCardSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  animate?: boolean;
}

const HoverCardSketchContext = createContext<HoverCardSketchContextValue | null>(
  null,
);

function useHoverCardSketch(): HoverCardSketchContextValue {
  const ctx = useContext(HoverCardSketchContext);
  if (!ctx) {
    throw new Error("HoverCard parts must be used inside <HoverCard>.");
  }
  return ctx;
}

export interface HoverCardProps
  extends Omit<ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>, "children">,
    SketchProps {
  children?: ReactNode;
  animate?: boolean;
}

export function HoverCard({
  children,
  roughness,
  seed,
  sketchColor,
  bowing,
  fillStyle,
  strokeWidth,
  animate,
  ...rest
}: HoverCardProps) {
  const resolvedSeed = useResolvedSeed(seed);
  const ink = sketchColor ?? SKETCH_COLORS.ink;

  return (
    <HoverCardSketchContext.Provider
      value={{
        roughness,
        seed: resolvedSeed,
        sketchColor,
        bowing,
        fillStyle,
        strokeWidth,
        resolvedSeed,
        ink,
        animate,
      }}
    >
      <HoverCardPrimitive.Root {...rest}>{children}</HoverCardPrimitive.Root>
    </HoverCardSketchContext.Provider>
  );
}

export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export interface HoverCardContentProps
  extends ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> {
  children?: ReactNode;
}

export const HoverCardContent = forwardRef<
  HTMLDivElement,
  HoverCardContentProps
>(function HoverCardContent(
  { className, style, children, sideOffset = 6, align = "center", ...rest },
  ref,
) {
  const sketch = useHoverCardSketch();

  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        align={align}
        className={cn(className)}
        style={{ zIndex: 75, outline: "none", ...style }}
        {...rest}
      >
        <SketchBox
          roughness={sketch.roughness}
          seed={sketch.resolvedSeed}
          sketchColor={sketch.ink}
          bowing={sketch.bowing}
          fillStyle={sketch.fillStyle ?? "solid"}
          fill="#f7f6f2"
          strokeWidth={sketch.strokeWidth ?? 1.5}
          shadow
          animate={sketch.animate}
          contentStyle={{ padding: 14, maxWidth: 320, fontSize: 14 }}
        >
          {children}
        </SketchBox>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  );
});

export const HoverCardArrow = HoverCardPrimitive.Arrow;
