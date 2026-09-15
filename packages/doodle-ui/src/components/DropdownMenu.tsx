"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ReactNode,
} from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { RoughSvg } from "../primitives/RoughSvg";
import { SketchBox } from "../primitives/SketchBox";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily } from "../utils";

interface DropdownMenuSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
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

export interface DropdownMenuProps
  extends Omit<DropdownMenuPrimitive.DropdownMenuProps, "children">,
    SketchProps {
  children?: ReactNode;
  /**
   * Draw-in the panel border when the menu opens.
   * Defaults to the DoodleUIProvider value (true).
   */
  animate?: boolean;
}

export function DropdownMenu({
  children,
  roughness,
  seed,
  sketchColor,
  bowing,
  fillStyle,
  strokeWidth,
  animate,
  ...rest
}: DropdownMenuProps) {
  const resolvedSeed = useResolvedSeed(seed);
  const ink = sketchColor ?? SKETCH_COLORS.ink;

  return (
    <DropdownMenuSketchContext.Provider
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

export interface DropdownMenuContentProps
  extends Omit<DropdownMenuPrimitive.DropdownMenuContentProps, "asChild"> {
  children?: ReactNode;
}

export const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(function DropdownMenuContent(
  { className, style, children, sideOffset = 6, align = "start", ...rest },
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
        style={{ zIndex: 80, outline: "none", minWidth: 180, ...style }}
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
          contentStyle={{ padding: "6px 4px" }}
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
    </DropdownMenuPrimitive.Item>
  );
});

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
          roughness={(sketch.roughness ?? 1.5) + 0.4}
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
            roughness={(sketch.roughness ?? 1.5) * 0.7}
            seed={deriveSeed(sketch.resolvedSeed, "checkbox-mark")}
            sketchColor={SKETCH_COLORS.accent}
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
          roughness={(sketch.roughness ?? 1.5) + 0.4}
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
            roughness={(sketch.roughness ?? 1.5) * 0.8}
            seed={deriveSeed(sketch.resolvedSeed, "radio-mark")}
            sketchColor={SKETCH_COLORS.accent}
            bowing={sketch.bowing}
            fillStyle="solid"
            fill={SKETCH_COLORS.accent}
            strokeWidth={1.2}
            inset={0}
          />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </DropdownMenuPrimitive.RadioItem>
  );
});

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

export interface DropdownMenuSeparatorProps
  extends Omit<DropdownMenuPrimitive.DropdownMenuSeparatorProps, "asChild"> {}

export const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(function DropdownMenuSeparator({ className, style, ...rest }, ref) {
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
        roughness={(sketch.roughness ?? 1.5) + 0.2}
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
