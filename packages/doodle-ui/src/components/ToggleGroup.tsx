"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import {
  DRAW_IN_DURATION_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import type { SketchProps } from "../types";
import { cn, assignRef, deriveSeed, doodleUiFontFamily, doodleUiFontWeight } from "../utils";
import type { ToggleSize } from "./Toggle";

interface ToggleGroupSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  accent: string;
  accentFill: string;
  isDark: boolean;
  animate?: boolean;
  size: ToggleSize;
}

const ToggleGroupSketchContext =
  createContext<ToggleGroupSketchContextValue | null>(null);

function useToggleGroupSketch(): ToggleGroupSketchContextValue {
  const ctx = useContext(ToggleGroupSketchContext);
  if (!ctx) {
    throw new Error("ToggleGroupItem must be used inside <ToggleGroup>.");
  }
  return ctx;
}

export type ToggleGroupProps = SketchProps & {
  children?: ReactNode;
  size?: ToggleSize;
  animate?: boolean;
} & (
  | ({ type?: "single" } & Omit<
      ToggleGroupPrimitive.ToggleGroupSingleProps,
      "type" | "children"
    >)
  | ({ type: "multiple" } & Omit<
      ToggleGroupPrimitive.ToggleGroupMultipleProps,
      "type" | "children"
    >)
);

export function ToggleGroup(props: ToggleGroupProps) {
  const {
    children,
    roughness,
    seed,
    sketchColor,
    bowing,
    fillStyle,
    strokeWidth,
    hachureGap,
    hachureAngle,
    fillWeight,
    size = "md",
    animate,
    type = "single",
    ...rest
  } = props;
  const resolvedSeed = useResolvedSeed(seed);
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;
  const accent = sketchColor ?? theme.accent;
  const accentFill = theme.isDark
    ? (sketchColor ? `${sketchColor}25` : theme.accentFill)
    : theme.accentFill;

  const rootStyle = { display: "inline-flex", gap: 6, flexWrap: "wrap" as const };

  return (
    <ToggleGroupSketchContext.Provider
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
        accent,
        accentFill,
        isDark: theme.isDark,
        animate,
        size,
      }}
    >
      {type === "multiple" ? (
        <ToggleGroupPrimitive.Root
          type="multiple"
          style={rootStyle}
          {...(rest as Omit<
            ToggleGroupPrimitive.ToggleGroupMultipleProps,
            "type" | "children"
          >)}
        >
          {children}
        </ToggleGroupPrimitive.Root>
      ) : (
        <ToggleGroupPrimitive.Root
          type="single"
          style={rootStyle}
          {...(rest as Omit<
            ToggleGroupPrimitive.ToggleGroupSingleProps,
            "type" | "children"
          >)}
        >
          {children}
        </ToggleGroupPrimitive.Root>
      )}
    </ToggleGroupSketchContext.Provider>
  );
}

const ITEM_SIZE: Record<
  ToggleSize,
  { fontSize: number; padding: string; minHeight: number }
> = {
  sm: { fontSize: 13, padding: "4px 10px", minHeight: 30 },
  md: { fontSize: 15, padding: "7px 14px", minHeight: 38 },
  lg: { fontSize: 17, padding: "10px 18px", minHeight: 46 },
};

export interface ToggleGroupItemProps
  extends Omit<ToggleGroupPrimitive.ToggleGroupItemProps, "asChild"> {
  children?: ReactNode;
}

export const ToggleGroupItem = forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>(function ToggleGroupItem(
  { className, style, children, value, disabled, ...rest },
  ref,
) {
  const sketch = useToggleGroupSketch();
  const rootRef = useRef<HTMLButtonElement>(null);
  const [pressed, setPressed] = useState(false);
  const shouldAnimate = useAnimate(sketch.animate);
  const pressSeed = deriveSeed(
    sketch.resolvedSeed,
    `${value}-${pressed ? "on" : "off"}`,
  );
  const sketchSeed = shouldAnimate ? pressSeed : sketch.resolvedSeed;

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const sync = () => setPressed(el.getAttribute("data-state") === "on");
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(el, { attributes: true, attributeFilter: ["data-state"] });
    return () => obs.disconnect();
  }, [value]);

  useDrawIn(rootRef, DRAW_IN_DURATION_MS, shouldAnimate, sketchSeed);

  const textColor = pressed
    ? (sketch.isDark ? "#ffffff" : sketch.accent)
    : sketch.ink;

  return (
    <ToggleGroupPrimitive.Item
      ref={(node) => {
        (rootRef as MutableRefObject<HTMLButtonElement | null>).current = node;
        assignRef(ref, node);
      }}
      value={value}
      disabled={disabled}
      className={cn(className)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        background: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        color: textColor,
        fontFamily: doodleUiFontFamily,
        fontWeight: doodleUiFontWeight(600),
        opacity: disabled ? 0.45 : 1,
        outline: "none",
        ...ITEM_SIZE[sketch.size],
        ...style,
      }}
      {...rest}
    >
      <RoughSvg
        shape="rectangle"
        roughness={sketch.roughness}
        seed={sketchSeed}
        sketchColor={pressed ? sketch.accent : sketch.ink}
        bowing={sketch.bowing}
        fillStyle={sketch.fillStyle ?? "hachure"}
        fill={pressed ? sketch.accentFill : undefined}
        strokeWidth={sketch.strokeWidth ?? 1.6}
        hachureGap={sketch.hachureGap ?? 7}
        hachureAngle={sketch.hachureAngle}
        fillWeight={sketch.fillWeight ?? 1}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </ToggleGroupPrimitive.Item>
  );
});
