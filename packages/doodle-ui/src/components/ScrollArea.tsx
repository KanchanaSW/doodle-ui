"use client";

import { useSketchDefaults } from "../hooks/useSketchDefaults";
import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn } from "../utils";

interface ScrollAreaSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  paper: string;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
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

/**
 * Props for {@link ScrollArea}.
 */
export interface ScrollAreaProps
  extends Omit<ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>, "children">,
    SketchProps {
  children?: ReactNode;
  fill?: string;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Scrollable region with rough scrollbar.
 *
 * @example
 * <ScrollArea />
 */
export const ScrollArea = forwardRef<
  HTMLDivElement,
  ScrollAreaProps
>(function ScrollArea(
  {
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
    ...rest
  },
  ref,
) {
  const resolvedSeed = useResolvedSeed(seed);
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;

  return (
    <ScrollAreaSketchContext.Provider
      value={{
        roughness,
        seed: resolvedSeed,
        sketchColor,
        bowing,
        fillStyle,
        strokeWidth,
        hachureGap,
        hachureAngle,
        fillWeight,
        resolvedSeed,
        ink,
        paper: fill ?? theme.paper,
        animate,
      }}
    >
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn(className)}
        style={{ position: "relative", overflow: "hidden", color: ink, ...style }}
        {...rest}
      >
        <SketchBox
          roughness={roughness}
          seed={resolvedSeed}
          sketchColor={ink}
          bowing={bowing}
          fillStyle={fillStyle ?? "solid"}
          fill={fill ?? theme.paper}
          strokeWidth={strokeWidth ?? 1.5}
          hachureGap={hachureGap}
          hachureAngle={hachureAngle}
          fillWeight={fillWeight}
          animate={animate}
          contentStyle={{ padding: 0, height: "100%", color: ink }}
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

/**
 * Props for {@link ScrollBar}.
 */
export interface ScrollBarProps
  extends ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {}

export const ScrollBar = forwardRef<HTMLDivElement, ScrollBarProps>(
  function ScrollBar(
    { className, style, orientation = "vertical", ...rest },
    ref,
  ) {
    const { roughness: baseRoughness } = useSketchDefaults();
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
              roughness={(sketch.roughness ?? baseRoughness) + 0.3}
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
