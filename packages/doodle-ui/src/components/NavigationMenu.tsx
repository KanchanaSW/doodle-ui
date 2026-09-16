"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { RoughSvg } from "../primitives/RoughSvg";
import { SketchBox } from "../primitives/SketchBox";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

interface NavigationMenuSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  animate?: boolean;
}

const NavigationMenuSketchContext =
  createContext<NavigationMenuSketchContextValue | null>(null);

function useNavigationMenuSketch(): NavigationMenuSketchContextValue {
  const ctx = useContext(NavigationMenuSketchContext);
  if (!ctx) {
    throw new Error("NavigationMenu parts must be used inside <NavigationMenu>.");
  }
  return ctx;
}

export interface NavigationMenuProps
  extends Omit<
      ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>,
      "children"
    >,
    SketchProps {
  children?: ReactNode;
  animate?: boolean;
}

export function NavigationMenu({
  children,
  roughness,
  seed,
  sketchColor,
  bowing,
  fillStyle,
  strokeWidth,
  animate,
  ...rest
}: NavigationMenuProps) {
  const resolvedSeed = useResolvedSeed(seed);
  const ink = sketchColor ?? SKETCH_COLORS.ink;

  return (
    <NavigationMenuSketchContext.Provider
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
      <NavigationMenuPrimitive.Root {...rest}>
        {children}
        <NavigationMenuViewport />
      </NavigationMenuPrimitive.Root>
    </NavigationMenuSketchContext.Provider>
  );
}

export const NavigationMenuList = forwardRef<
  HTMLUListElement,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(function NavigationMenuList({ className, style, ...rest }, ref) {
  return (
    <NavigationMenuPrimitive.List
      ref={ref}
      className={cn(className)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        listStyle: "none",
        margin: 0,
        padding: 0,
        ...style,
      }}
      {...rest}
    />
  );
});

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

export const NavigationMenuTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(function NavigationMenuTrigger({ className, style, children, ...rest }, ref) {
  const sketch = useNavigationMenuSketch();
  return (
    <NavigationMenuPrimitive.Trigger
      ref={ref}
      className={cn(className)}
      style={{
        position: "relative",
        border: "none",
        background: "transparent",
        fontFamily: doodleUiFontFamily,
        fontWeight: doodleUiFontWeight(600),
        fontSize: 14,
        color: sketch.ink,
        padding: "8px 12px",
        cursor: "pointer",
        outline: "none",
        ...style,
      }}
      {...rest}
    >
      {children}
    </NavigationMenuPrimitive.Trigger>
  );
});

export const NavigationMenuContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(function NavigationMenuContent({ className, style, children, ...rest }, ref) {
  const sketch = useNavigationMenuSketch();
  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={cn(className)}
      style={{ outline: "none", ...style }}
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
        contentStyle={{ padding: 12, minWidth: 200 }}
      >
        {children}
      </SketchBox>
    </NavigationMenuPrimitive.Content>
  );
});

export const NavigationMenuLink = NavigationMenuPrimitive.Link;

export const NavigationMenuViewport = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(function NavigationMenuViewport({ className, style, ...rest }, ref) {
  return (
    <div style={{ position: "absolute", top: "100%", left: 0, perspective: 2000 }}>
      <NavigationMenuPrimitive.Viewport
        ref={ref}
        className={cn(className)}
        style={{
          position: "relative",
          marginTop: 6,
          overflow: "hidden",
          ...style,
        }}
        {...rest}
      />
    </div>
  );
});

export const NavigationMenuIndicator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(function NavigationMenuIndicator({ className, style, ...rest }, ref) {
  const sketch = useNavigationMenuSketch();
  return (
    <NavigationMenuPrimitive.Indicator
      ref={ref}
      className={cn(className)}
      style={{ position: "relative", height: 6, ...style }}
      {...rest}
    >
      <RoughSvg
        shape="line"
        roughness={(sketch.roughness ?? 1.5) + 0.2}
        seed={deriveSeed(sketch.resolvedSeed, "nav-indicator")}
        sketchColor={sketch.ink}
        strokeWidth={2}
        inset={2}
      />
    </NavigationMenuPrimitive.Indicator>
  );
});

export interface NavigationMenuItemLinkProps
  extends ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link> {
  active?: boolean;
}

export const NavigationMenuItemLink = forwardRef<
  HTMLAnchorElement,
  NavigationMenuItemLinkProps
>(function NavigationMenuItemLink(
  { className, style, active, children, ...rest },
  ref,
) {
  const sketch = useNavigationMenuSketch();
  const [hovered, setHovered] = useState(false);
  const showMark = active || hovered;

  return (
    <NavigationMenuPrimitive.Link
      ref={ref}
      className={cn(className)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        padding: "8px 12px",
        fontFamily: doodleUiFontFamily,
        fontSize: 14,
        color: sketch.ink,
        textDecoration: "none",
        outline: "none",
        ...style,
      }}
      {...rest}
    >
      {showMark ? (
        <RoughSvg
          shape="line"
          roughness={(sketch.roughness ?? 1.5) + 0.3}
          seed={deriveSeed(sketch.resolvedSeed, "nav-link")}
          sketchColor={sketch.ink}
          strokeWidth={1.4}
          inset={4}
          style={{ opacity: 0.35 }}
        />
      ) : null}
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </NavigationMenuPrimitive.Link>
  );
});
