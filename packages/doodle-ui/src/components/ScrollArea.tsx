"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { RoughSvg } from "../primitives/RoughSvg";
import { SketchBox } from "../primitives/SketchBox";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn } from "../utils";

interface ScrollAreaSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  animate?: boolean;
}

const ScrollAreaSketchContext =
  createContext<ScrollAreaSketchContextValue | null>(null);

function useScrollAreaSketch(): ScrollAreaSketchContextValue {
  const ctx = useContext(ScrollAreaSketchContext);
  if (!ctx) {
    throw new Error("ScrollArea parts must be used inside <ScrollArea>.");
  }
  return ctx;
}

export interface ScrollAreaProps
  extends Omit<ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>, "children">,
    SketchProps {
  children?: ReactNode;
  animate?: boolean;
}

export const ScrollArea = forwardRef<
  HTMLDivElement,
  ScrollAreaProps
>(function ScrollArea(
  {
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
    ...rest
  },
  ref,
) {
  const resolvedSeed = useResolvedSeed(seed);
  const ink = sketchColor ?? SKETCH_COLORS.ink;

  return (
    <ScrollAreaSketchContext.Provider
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
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn(className)}
        style={{ position: "relative", overflow: "hidden", ...style }}
        {...rest}
      >
        <SketchBox
          roughness={roughness}
          seed={resolvedSeed}
          sketchColor={ink}
          bowing={bowing}
          fillStyle={fillStyle ?? "solid"}
          fill="#f7f6f2"
          strokeWidth={strokeWidth ?? 1.5}
          animate={animate}
          contentStyle={{ padding: 0, height: "100%" }}
          style={{ height: "100%" }}
        >
          {children}
        </SketchBox>
      </ScrollAreaPrimitive.Root>
    </ScrollAreaSketchContext.Provider>
  );
});

export const ScrollAreaViewport = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>
>(function ScrollAreaViewport({ className, style, children, ...rest }, ref) {
  return (
    <ScrollAreaPrimitive.Viewport
      ref={ref}
      className={cn(className)}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
  );
});

export interface ScrollBarProps
  extends ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {}

export const ScrollBar = forwardRef<HTMLDivElement, ScrollBarProps>(
  function ScrollBar(
    { className, style, orientation = "vertical", ...rest },
    ref,
  ) {
    const sketch = useScrollAreaSketch();

    return (
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        ref={ref}
        orientation={orientation}
        className={cn(className)}
        style={{
          display: "flex",
          touchAction: "none",
          userSelect: "none",
          padding: 2,
          ...(orientation === "vertical"
            ? { width: 12, flexDirection: "column" }
            : { height: 12, flexDirection: "row" }),
          ...style,
        }}
        {...rest}
      >
        <ScrollAreaPrimitive.ScrollAreaThumb asChild>
          <div style={{ position: "relative", flex: 1 }}>
            <RoughSvg
              shape={orientation === "vertical" ? "line-vertical" : "line"}
              roughness={(sketch.roughness ?? 1.5) + 0.3}
              seed={sketch.resolvedSeed}
              sketchColor={sketch.ink}
              bowing={sketch.bowing}
              strokeWidth={sketch.strokeWidth ?? 2.2}
              inset={1}
            />
          </div>
        </ScrollAreaPrimitive.ScrollAreaThumb>
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
    );
  },
);

export const ScrollAreaCorner = ScrollAreaPrimitive.Corner;
