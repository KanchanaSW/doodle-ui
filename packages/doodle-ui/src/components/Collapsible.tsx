"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { RoughSvg } from "../primitives/RoughSvg";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";

const CHEVRON_PATH = "M 6 4 L 12 10 L 6 16";

interface CollapsibleSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  open: boolean;
}

const CollapsibleSketchContext =
  createContext<CollapsibleSketchContextValue | null>(null);

function useCollapsibleSketch(): CollapsibleSketchContextValue {
  const ctx = useContext(CollapsibleSketchContext);
  if (!ctx) {
    throw new Error(
      "Collapsible parts must be used inside <Collapsible>.",
    );
  }
  return ctx;
}

export interface CollapsibleProps
  extends Omit<CollapsiblePrimitive.CollapsibleProps, "asChild">,
    SketchProps {
  children?: ReactNode;
}

export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
  function Collapsible(
    {
      className,
      style,
      children,
      open,
      defaultOpen,
      onOpenChange,
      disabled,
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      hachureGap,
      hachureAngle,
      fillWeight,
      ...rest
    },
    ref,
  ) {
    const resolvedSeed = useResolvedSeed(seed);
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const [uncontrolled, setUncontrolled] = useState(defaultOpen ?? false);
    const isOpen = open ?? uncontrolled;

    return (
      <CollapsibleSketchContext.Provider
        value={{
          roughness,
          seed: resolvedSeed,
          sketchColor: ink,
          bowing,
          fillStyle,
          strokeWidth,
          hachureGap,
          hachureAngle,
          fillWeight,
          resolvedSeed,
          ink,
          open: isOpen,
        }}
      >
        <CollapsiblePrimitive.Root
          ref={ref}
          open={isOpen}
          disabled={disabled}
          className={cn(className)}
          style={style}
          onOpenChange={(next) => {
            setUncontrolled(next);
            onOpenChange?.(next);
          }}
          {...rest}
        >
          {children}
        </CollapsiblePrimitive.Root>
      </CollapsibleSketchContext.Provider>
    );
  },
);

export interface CollapsibleTriggerProps
  extends Omit<
    ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>,
    "asChild"
  > {
  children?: ReactNode;
}

export const CollapsibleTrigger = forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(function CollapsibleTrigger({ className, style, children, ...rest }, ref) {
  const sketch = useCollapsibleSketch();

  return (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      className={cn(className)}
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 4px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontFamily: doodleUiFontFamily,
        fontSize: 15,
        fontWeight: doodleUiFontWeight(600),
        color: sketch.ink,
        textAlign: "left",
        outline: "none",
        ...style,
      }}
      {...rest}
    >
      <span>{children}</span>
      <span
        style={{
          position: "relative",
          width: 18,
          height: 18,
          flexShrink: 0,
          transform: sketch.open ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 180ms ease",
        }}
      >
        <RoughSvg
          shape="path"
          path={CHEVRON_PATH}
          roughness={(sketch.roughness ?? 1.5) * 0.7}
          seed={sketch.resolvedSeed}
          sketchColor={sketch.ink}
          bowing={sketch.bowing}
          strokeWidth={(sketch.strokeWidth ?? 1.6) + 0.2}
          inset={0}
        />
      </span>
    </CollapsiblePrimitive.Trigger>
  );
});

export interface CollapsibleContentProps
  extends Omit<
    ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>,
    "asChild"
  > {}

export const CollapsibleContent = forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(function CollapsibleContent({ className, style, children, ...rest }, ref) {
  const sketch = useCollapsibleSketch();
  return (
    <CollapsiblePrimitive.Content
      ref={ref}
      className={cn(className)}
      style={{
        padding: "0 4px 12px",
        fontFamily: doodleUiFontFamily,
        fontSize: 14,
        lineHeight: 1.5,
        color: sketch.ink,
        ...style,
      }}
      {...rest}
    >
      {children}
    </CollapsiblePrimitive.Content>
  );
});
