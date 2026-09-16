"use client";

import { useSketchDefaults } from "../hooks/useSketchDefaults";
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily } from "../utils";

interface ContextMenuSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  paper: string;
  accent: string;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

const ContextMenuSketchContext =
  createContext<ContextMenuSketchContextValue | null>(null);

function useContextMenuSketch(): ContextMenuSketchContextValue {
  const ctx = useContext(ContextMenuSketchContext);
  if (!ctx) {
    throw new Error(
      "ContextMenu parts must be used inside <ContextMenu>.",
    );
  }
  return ctx;
}

/**
 * Props for {@link ContextMenu}.
 */
export interface ContextMenuProps
  extends Omit<ContextMenuPrimitive.ContextMenuProps, "children">,
    SketchProps {
  children?: ReactNode;
  fill?: string;
  /**
   * Draw-in the panel border when the menu opens.
   * Defaults to the DoodleUIProvider value (true).
   */
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Right-click context menu with sketch chrome.
 *
 * @example
 * <ContextMenu />
 */
export function ContextMenu({
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
}: ContextMenuProps) {
  const resolvedSeed = useResolvedSeed(seed);
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;

  return (
    <ContextMenuSketchContext.Provider
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
        accent: theme.accent,
        animate,
      }}
    >
      <ContextMenuPrimitive.Root {...rest}>
        {children}
      </ContextMenuPrimitive.Root>
    </ContextMenuSketchContext.Provider>
  );
}

export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuGroup = ContextMenuPrimitive.Group;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
export const ContextMenuSub = ContextMenuPrimitive.Sub;

/**
 * Props for {@link ContextMenuContent}.
 */
export interface ContextMenuContentProps
  extends Omit<ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>, "asChild"> {
  children?: ReactNode;
  fill?: string;
}

export const ContextMenuContent = forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(function ContextMenuContent(
  { className, style, children, fill, ...rest },
  ref,
) {
  const sketch = useContextMenuSketch();

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        ref={ref}
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
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Portal>
  );
});

function useMark(highlighted: boolean) {
  const sketch = useContextMenuSketch();
  return { sketch, mark: highlighted };
}

/**
 * Props for {@link ContextMenuItem}.
 */
export interface ContextMenuItemProps
  extends Omit<ContextMenuPrimitive.ContextMenuItemProps, "asChild"> {
  children?: ReactNode;
  inset?: boolean;
}

export const ContextMenuItem = forwardRef<
  HTMLDivElement,
  ContextMenuItemProps
>(function ContextMenuItem(
  { className, style, children, inset, ...rest },
  ref,
) {
  const { roughness: baseRoughness } = useSketchDefaults();
  const [highlighted, setHighlighted] = useState(false);
  const { sketch, mark } = useMark(highlighted);

  return (
    <ContextMenuPrimitive.Item
      ref={ref}
      className={cn(className)}
      onPointerMove={() => setHighlighted(true)}
      onPointerLeave={() => setHighlighted(false)}
      onFocus={() => setHighlighted(true)}
      onBlur={() => setHighlighted(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: inset ? "7px 12px 7px 26px" : "7px 12px",
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
          roughness={(sketch.roughness ?? baseRoughness) + 0.4}
          seed={sketch.resolvedSeed}
          sketchColor={sketch.ink}
          bowing={sketch.bowing ?? 1.6}
          strokeWidth={1.3}
          inset={4}
          style={{ opacity: 0.4 }}
        />
      ) : null}
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </ContextMenuPrimitive.Item>
  );
});

/**
 * Props for {@link ContextMenuCheckboxItem}.
 */
export interface ContextMenuCheckboxItemProps
  extends Omit<
    ContextMenuPrimitive.ContextMenuCheckboxItemProps,
    "asChild"
  > {
  children?: ReactNode;
}

const CHECK_PATH = "M 2 6 L 5 9 L 10 3";

export const ContextMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  ContextMenuCheckboxItemProps
>(function ContextMenuCheckboxItem(
  { className, style, children, checked, ...rest },
  ref,
) {
  const { roughness: baseRoughness } = useSketchDefaults();
  const [highlighted, setHighlighted] = useState(false);
  const { sketch, mark } = useMark(highlighted);

  return (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(className)}
      onPointerMove={() => setHighlighted(true)}
      onPointerLeave={() => setHighlighted(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 12px 7px 26px",
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
          roughness={(sketch.roughness ?? baseRoughness) + 0.4}
          seed={sketch.resolvedSeed}
          sketchColor={sketch.ink}
          bowing={sketch.bowing ?? 1.6}
          strokeWidth={1.3}
          inset={4}
          style={{ opacity: 0.4 }}
        />
      ) : null}
      <span
        style={{
          position: "relative",
          width: 12,
          height: 12,
          flexShrink: 0,
          marginLeft: -18,
        }}
      >
        <ContextMenuPrimitive.ItemIndicator>
          <RoughSvg
            shape="path"
            path={CHECK_PATH}
            roughness={(sketch.roughness ?? baseRoughness) * 0.7}
            seed={deriveSeed(sketch.resolvedSeed, "checkbox-mark")}
            sketchColor={sketch.accent}
            bowing={sketch.bowing}
            strokeWidth={1.6}
            inset={0}
          />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </ContextMenuPrimitive.CheckboxItem>
  );
});

/**
 * Props for {@link ContextMenuRadioItem}.
 */
export interface ContextMenuRadioItemProps
  extends Omit<ContextMenuPrimitive.ContextMenuRadioItemProps, "asChild"> {
  children?: ReactNode;
}

export const ContextMenuRadioItem = forwardRef<
  HTMLDivElement,
  ContextMenuRadioItemProps
>(function ContextMenuRadioItem(
  { className, style, children, ...rest },
  ref,
) {
  const { roughness: baseRoughness } = useSketchDefaults();
  const [highlighted, setHighlighted] = useState(false);
  const { sketch, mark } = useMark(highlighted);

  return (
    <ContextMenuPrimitive.RadioItem
      ref={ref}
      className={cn(className)}
      onPointerMove={() => setHighlighted(true)}
      onPointerLeave={() => setHighlighted(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 12px 7px 26px",
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
          roughness={(sketch.roughness ?? baseRoughness) + 0.4}
          seed={sketch.resolvedSeed}
          sketchColor={sketch.ink}
          bowing={sketch.bowing ?? 1.6}
          strokeWidth={1.3}
          inset={4}
          style={{ opacity: 0.4 }}
        />
      ) : null}
      <span
        style={{
          position: "relative",
          width: 8,
          height: 8,
          flexShrink: 0,
          marginLeft: -18,
        }}
      >
        <ContextMenuPrimitive.ItemIndicator>
          <RoughSvg
            shape="ellipse"
            roughness={(sketch.roughness ?? baseRoughness) * 0.8}
            seed={deriveSeed(sketch.resolvedSeed, "radio-mark")}
            sketchColor={sketch.accent}
            bowing={sketch.bowing}
            fillStyle="solid"
            fill={sketch.accent}
            strokeWidth={1.2}
            inset={0}
          />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </ContextMenuPrimitive.RadioItem>
  );
});

/**
 * Props for {@link ContextMenuLabel}.
 */
export interface ContextMenuLabelProps
  extends Omit<ContextMenuPrimitive.ContextMenuLabelProps, "asChild"> {
  children?: ReactNode;
}

export const ContextMenuLabel = forwardRef<
  HTMLDivElement,
  ContextMenuLabelProps
>(function ContextMenuLabel({ className, style, children, ...rest }, ref) {
  const sketch = useContextMenuSketch();
  return (
    <ContextMenuPrimitive.Label
      ref={ref}
      className={cn(className)}
      style={{
        padding: "6px 12px",
        fontFamily: doodleUiFontFamily,
        fontSize: 12,
        fontWeight: 700,
        color: sketch.ink,
        opacity: 0.6,
        textTransform: "uppercase",
        letterSpacing: 0.4,
        ...style,
      }}
      {...rest}
    >
      {children}
    </ContextMenuPrimitive.Label>
  );
});

/**
 * Props for {@link ContextMenuSeparator}.
 */
export interface ContextMenuSeparatorProps
  extends Omit<ContextMenuPrimitive.ContextMenuSeparatorProps, "asChild"> {}

export const ContextMenuSeparator = forwardRef<
  HTMLDivElement,
  ContextMenuSeparatorProps
>(function ContextMenuSeparator({ className, style, ...rest }, ref) {
  const { roughness: baseRoughness } = useSketchDefaults();
  const sketch = useContextMenuSketch();
  return (
    <ContextMenuPrimitive.Separator
      ref={ref}
      className={cn(className)}
      style={{ position: "relative", height: 10, margin: "2px 0", ...style }}
      {...rest}
    >
      <RoughSvg
        shape="line"
        roughness={(sketch.roughness ?? baseRoughness) + 0.2}
        seed={deriveSeed(sketch.resolvedSeed, "separator")}
        sketchColor={sketch.ink}
        bowing={sketch.bowing ?? 1.8}
        strokeWidth={1.2}
        inset={6}
        style={{ opacity: 0.5 }}
      />
    </ContextMenuPrimitive.Separator>
  );
});
