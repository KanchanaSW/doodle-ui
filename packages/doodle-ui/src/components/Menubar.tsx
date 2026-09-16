"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily } from "../utils";

interface MenubarSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  paper: string;
  animate?: boolean;
}

const MenubarSketchContext = createContext<MenubarSketchContextValue | null>(
  null,
);

function useMenubarSketch(): MenubarSketchContextValue {
  const ctx = useContext(MenubarSketchContext);
  if (!ctx) {
    throw new Error("Menubar parts must be used inside <Menubar>.");
  }
  return ctx;
}

export interface MenubarProps
  extends Omit<ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>, "children">,
    SketchProps {
  children?: ReactNode;
  fill?: string;
  animate?: boolean;
}

export function Menubar({
  children,
  className,
  style,
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
}: MenubarProps) {
  const resolvedSeed = useResolvedSeed(seed);
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;

  return (
    <MenubarSketchContext.Provider
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
      <MenubarPrimitive.Root
        className={cn(className)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: 4,
          ...style,
        }}
        {...rest}
      >
        {children}
      </MenubarPrimitive.Root>
    </MenubarSketchContext.Provider>
  );
}

export const MenubarMenu: typeof MenubarPrimitive.Menu = MenubarPrimitive.Menu;

export const MenubarTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(function MenubarTrigger({ className, style, children, ...rest }, ref) {
  const sketch = useMenubarSketch();
  return (
    <MenubarPrimitive.Trigger
      ref={ref}
      className={cn(className)}
      style={{
        border: "none",
        background: "transparent",
        fontFamily: doodleUiFontFamily,
        fontSize: 14,
        padding: "6px 10px",
        cursor: "pointer",
        color: sketch.ink,
        outline: "none",
        ...style,
      }}
      {...rest}
    >
      {children}
    </MenubarPrimitive.Trigger>
  );
});

export const MenubarContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Content> & { fill?: string }
>(function MenubarContent(
  { className, style, children, fill, align = "start", sideOffset = 6, ...rest },
  ref,
) {
  const sketch = useMenubarSketch();
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(className)}
        style={{ zIndex: 80, outline: "none", minWidth: 180, color: sketch.ink, ...style }}
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
          contentStyle={{ padding: "6px 4px", color: sketch.ink }}
        >
          {children}
        </SketchBox>
      </MenubarPrimitive.Content>
    </MenubarPrimitive.Portal>
  );
});

function useMark(highlighted: boolean) {
  const sketch = useMenubarSketch();
  return { sketch, mark: highlighted };
}

export const MenubarItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>
>(function MenubarItem({ className, style, children, ...rest }, ref) {
  const [highlighted, setHighlighted] = useState(false);
  const { sketch, mark } = useMark(highlighted);

  return (
    <MenubarPrimitive.Item
      ref={ref}
      className={cn(className)}
      onPointerMove={() => setHighlighted(true)}
      onPointerLeave={() => setHighlighted(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 12px",
        fontFamily: doodleUiFontFamily,
        fontSize: 14,
        color: sketch.ink,
        outline: "none",
        cursor: "pointer",
        userSelect: "none",
        ...style,
      }}
      {...rest}
    >
      {mark ? (
        <RoughSvg
          shape="line"
          roughness={(sketch.roughness ?? 1.5) + 0.4}
          seed={sketch.resolvedSeed}
          sketchColor={sketch.ink}
          bowing={sketch.bowing ?? 1.6}
          strokeWidth={1.3}
          inset={4}
          style={{ opacity: 0.4 }}
        />
      ) : null}
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </MenubarPrimitive.Item>
  );
});

export const MenubarSeparator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(function MenubarSeparator({ className, style, ...rest }, ref) {
  const sketch = useMenubarSketch();
  return (
    <MenubarPrimitive.Separator
      ref={ref}
      className={cn(className)}
      style={{ position: "relative", height: 10, margin: "2px 0", ...style }}
      {...rest}
    >
      <RoughSvg
        shape="line"
        roughness={(sketch.roughness ?? 1.5) + 0.2}
        seed={deriveSeed(sketch.resolvedSeed, "separator")}
        sketchColor={sketch.ink}
        bowing={sketch.bowing ?? 1.8}
        strokeWidth={1.2}
        inset={6}
        style={{ opacity: 0.5 }}
      />
    </MenubarPrimitive.Separator>
  );
});

export const MenubarLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Label>
>(function MenubarLabel({ className, style, children, ...rest }, ref) {
  const sketch = useMenubarSketch();
  return (
    <MenubarPrimitive.Label
      ref={ref}
      className={cn(className)}
      style={{
        padding: "6px 12px",
        fontFamily: doodleUiFontFamily,
        fontSize: 12,
        fontWeight: 700,
        color: sketch.ink,
        opacity: 0.6,
        ...style,
      }}
      {...rest}
    >
      {children}
    </MenubarPrimitive.Label>
  );
});

export const MenubarShortcut = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(function MenubarShortcut({ className, style, children, ...rest }, ref) {
  return (
    <span
      ref={ref}
      className={cn(className)}
      style={{
        marginLeft: "auto",
        fontSize: 12,
        opacity: 0.55,
        letterSpacing: 0.04,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
});

export const MenubarSub = MenubarPrimitive.Sub;
export const MenubarSubTrigger = MenubarPrimitive.SubTrigger;
export const MenubarSubContent = MenubarPrimitive.SubContent;
export const MenubarCheckboxItem = MenubarPrimitive.CheckboxItem;
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup;
export const MenubarRadioItem = MenubarPrimitive.RadioItem;
