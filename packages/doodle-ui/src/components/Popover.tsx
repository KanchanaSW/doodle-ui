"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn } from "../utils";

interface PopoverSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  paper: string;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

const PopoverSketchContext = createContext<PopoverSketchContextValue | null>(
  null,
);

function usePopoverSketch(): PopoverSketchContextValue {
  const ctx = useContext(PopoverSketchContext);
  if (!ctx) {
    throw new Error("Popover parts must be used inside <Popover>.");
  }
  return ctx;
}

/**
 * Props for {@link Popover}.
 */
export interface PopoverProps
  extends Omit<PopoverPrimitive.PopoverProps, "children">,
    SketchProps {
  children?: ReactNode;
  fill?: string;
  /**
   * Draw-in the panel border when the popover opens.
   * Defaults to the DoodleUIProvider value (true).
   */
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Floating sketch panel anchored to a trigger.
 *
 * @example
 * <Popover />
 */
export function Popover({
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
}: PopoverProps) {
  const resolvedSeed = useResolvedSeed(seed);
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;

  return (
    <PopoverSketchContext.Provider
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
      <PopoverPrimitive.Root {...rest}>{children}</PopoverPrimitive.Root>
    </PopoverSketchContext.Provider>
  );
}

export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

/**
 * Props for {@link PopoverContent}.
 */
export interface PopoverContentProps
  extends Omit<PopoverPrimitive.PopoverContentProps, "asChild"> {
  children?: ReactNode;
  fill?: string;
}

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(
    { className, style, children, fill, sideOffset = 8, ...rest },
    ref,
  ) {
    const sketch = usePopoverSketch();

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(className)}
          style={{ zIndex: 80, outline: "none", color: sketch.ink, ...style }}
          {...rest}
        >
          <SketchBox
            roughness={sketch.roughness}
            seed={sketch.resolvedSeed}
            sketchColor={sketch.ink}
            bowing={sketch.bowing}
            fillStyle={sketch.fillStyle ?? "solid"}
            fill={fill ?? sketch.paper}
            strokeWidth={sketch.strokeWidth ?? 1.5}
            hachureGap={sketch.hachureGap}
            hachureAngle={sketch.hachureAngle}
            fillWeight={sketch.fillWeight}
            shadow
            animate={sketch.animate}
            contentStyle={{ padding: "14px 16px", minWidth: 200, color: sketch.ink }}
          >
            {children}
          </SketchBox>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  },
);

export function PopoverArrow(
  props: ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>,
) {
  return <PopoverPrimitive.Arrow {...props} />;
}
