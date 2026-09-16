"use client";

import { useSketchDefaults } from "../hooks/useSketchDefaults";
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ReactNode,
} from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily } from "../utils";

interface DropdownMenuSketchContextValue extends SketchProps {
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

const DropdownMenuSketchContext =
  createContext<DropdownMenuSketchContextValue | null>(null);

function useDropdownMenuSketch(): DropdownMenuSketchContextValue {
  const ctx = useContext(DropdownMenuSketchContext);
  if (!ctx) {
    throw new Error(
      "DropdownMenu parts must be used inside <DropdownMenu>.",
    );
  }
  return ctx;
}

/**
 * Props for {@link DropdownMenu}.
 */
export interface DropdownMenuProps
  extends Omit<DropdownMenuPrimitive.DropdownMenuProps, "children">,
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
 * Sketch-styled dropdown menu.
 *
 * @example
 * <DropdownMenu />
 */
export function DropdownMenu({
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
}: DropdownMenuProps) {
  const resolvedSeed = useResolvedSeed(seed);
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;

  return (
    <DropdownMenuSketchContext.Provider
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
      <DropdownMenuPrimitive.Root {...rest}>
        {children}
      </DropdownMenuPrimitive.Root>
    </DropdownMenuSketchContext.Provider>
  );
}

export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;

/**
 * Props for {@link DropdownMenuContent}.
 */
export interface DropdownMenuContentProps
  extends Omit<DropdownMenuPrimitive.DropdownMenuContentProps, "asChild"> {
  children?: ReactNode;
  fill?: string;
}

export const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(function DropdownMenuContent(
  { className, style, children, fill, sideOffset = 6, align = "start", ...rest },
  ref,
) {
  const sketch = useDropdownMenuSketch();

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        align={align}
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
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
});

function useMark(highlighted: boolean) {
  const sketch = useDropdownMenuSketch();
  return { sketch, mark: highlighted };
}

/**
 * Props for {@link DropdownMenuItem}.
 */
export interface DropdownMenuItemProps
  extends Omit<DropdownMenuPrimitive.DropdownMenuItemProps, "asChild"> {
  children?: ReactNode;
  inset?: boolean;
}

export const DropdownMenuItem = forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(function DropdownMenuItem(
  { className, style, children, inset, ...rest },
  ref,
) {
  const { roughness: baseRoughness } = useSketchDefaults();
  const [highlighted, setHighlighted] = useState(false);
  const { sketch, mark } = useMark(highlighted);

  return (
    <DropdownMenuPrimitive.Item
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
    </DropdownMenuPrimitive.Item>
  );
});

/**
 * Props for {@link DropdownMenuCheckboxItem}.
 */
export interface DropdownMenuCheckboxItemProps
  extends Omit<
    DropdownMenuPrimitive.DropdownMenuCheckboxItemProps,
    "asChild"
  > {
  children?: ReactNode;
}

const CHECK_PATH = "M 2 6 L 5 9 L 10 3";

export const DropdownMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  DropdownMenuCheckboxItemProps
>(function DropdownMenuCheckboxItem(
  { className, style, children, checked, ...rest },
  ref,
) {
  const { roughness: baseRoughness } = useSketchDefaults();
  const [highlighted, setHighlighted] = useState(false);
  const { sketch, mark } = useMark(highlighted);

  return (
    <DropdownMenuPrimitive.CheckboxItem
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
        <DropdownMenuPrimitive.ItemIndicator>
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
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </DropdownMenuPrimitive.CheckboxItem>
  );
});

/**
 * Props for {@link DropdownMenuRadioItem}.
 */
export interface DropdownMenuRadioItemProps
  extends Omit<DropdownMenuPrimitive.DropdownMenuRadioItemProps, "asChild"> {
  children?: ReactNode;
}

export const DropdownMenuRadioItem = forwardRef<
  HTMLDivElement,
  DropdownMenuRadioItemProps
>(function DropdownMenuRadioItem(
  { className, style, children, ...rest },
  ref,
) {
  const { roughness: baseRoughness } = useSketchDefaults();
  const [highlighted, setHighlighted] = useState(false);
  const { sketch, mark } = useMark(highlighted);

  return (
    <DropdownMenuPrimitive.RadioItem
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
        <DropdownMenuPrimitive.ItemIndicator>
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
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </DropdownMenuPrimitive.RadioItem>
  );
});

/**
 * Props for {@link DropdownMenuLabel}.
 */
export interface DropdownMenuLabelProps
  extends Omit<DropdownMenuPrimitive.DropdownMenuLabelProps, "asChild"> {
  children?: ReactNode;
}

export const DropdownMenuLabel = forwardRef<
  HTMLDivElement,
  DropdownMenuLabelProps
>(function DropdownMenuLabel({ className, style, children, ...rest }, ref) {
  const sketch = useDropdownMenuSketch();
  return (
    <DropdownMenuPrimitive.Label
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
    </DropdownMenuPrimitive.Label>
  );
});

/**
 * Props for {@link DropdownMenuSeparator}.
 */
export interface DropdownMenuSeparatorProps
  extends Omit<DropdownMenuPrimitive.DropdownMenuSeparatorProps, "asChild"> {}

export const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(function DropdownMenuSeparator({ className, style, ...rest }, ref) {
  const { roughness: baseRoughness } = useSketchDefaults();
  const sketch = useDropdownMenuSketch();
  return (
    <DropdownMenuPrimitive.Separator
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
    </DropdownMenuPrimitive.Separator>
  );
});
