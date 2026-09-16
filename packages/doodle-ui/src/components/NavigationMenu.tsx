"use client";

import { useBaseRoughness } from "../hooks/useSketchDefaults";
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
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

interface NavigationMenuSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  paper: string;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
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

/**
 * Props for {@link NavigationMenu}.
 */
export interface NavigationMenuProps
  extends Omit<
      ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>,
      "children"
    >,
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
 * Horizontal navigation with dropdown panels.
 *
 * @example
 * <NavigationMenu />
 */
export function NavigationMenu({
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
}: NavigationMenuProps) {
  const resolvedSeed = useResolvedSeed(seed);
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;

  return (
    <NavigationMenuSketchContext.Provider
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
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content> & { fill?: string }
>(function NavigationMenuContent({ className, style, children, fill, ...rest }, ref) {
  const sketch = useNavigationMenuSketch();
  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={cn(className)}
      style={{ outline: "none", color: sketch.ink, ...style }}
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
        contentStyle={{ padding: 12, minWidth: 200, color: sketch.ink }}
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
  const baseRoughness = useBaseRoughness();
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
        roughness={(sketch.roughness ?? baseRoughness) + 0.2}
        seed={deriveSeed(sketch.resolvedSeed, "nav-indicator")}
        sketchColor={sketch.ink}
        strokeWidth={2}
        inset={2}
      />
    </NavigationMenuPrimitive.Indicator>
  );
});

/**
 * Props for {@link NavigationMenuItemLink}.
 */
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
  const baseRoughness = useBaseRoughness();
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
          roughness={(sketch.roughness ?? baseRoughness) + 0.3}
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
