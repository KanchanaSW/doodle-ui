"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { deriveSeed } from "../utils";

interface TabsSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  current: string | undefined;
}

const TabsSketchContext = createContext<TabsSketchContextValue | null>(null);

function useTabsSketch(): TabsSketchContextValue {
  const ctx = useContext(TabsSketchContext);
  if (!ctx) {
    throw new Error("Tab parts must be used inside <Tabs>.");
  }
  return ctx;
}

export interface TabsProps
  extends Omit<ComponentPropsWithoutRef<typeof TabsPrimitive.Root>, "asChild">,
    SketchProps {}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    className,
    style,
    children,
    value,
    defaultValue,
    onValueChange,
    roughness,
    seed,
    sketchColor,
    bowing,
    fillStyle,
    strokeWidth,
    ...rest
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = value ?? uncontrolled;
  const resolvedSeed = useResolvedSeed(seed);
  const ink = sketchColor ?? SKETCH_COLORS.ink;

  return (
    <TabsSketchContext.Provider
      value={{
        roughness,
        seed: resolvedSeed,
        sketchColor,
        bowing,
        fillStyle,
        strokeWidth,
        resolvedSeed,
        ink,
        current,
      }}
    >
      <TabsPrimitive.Root
        ref={ref}
        className={cn(className)}
        style={style}
        value={current}
        defaultValue={defaultValue}
        onValueChange={(next) => {
          setUncontrolled(next);
          onValueChange?.(next);
        }}
        {...rest}
      >
        {children}
      </TabsPrimitive.Root>
    </TabsSketchContext.Provider>
  );
});

export interface TabListProps
  extends Omit<
    ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    "asChild"
  > {}

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  function TabList({ className, style, children, ...rest }, ref) {
    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(className)}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          ...style,
        }}
        {...rest}
      >
        {children}
      </TabsPrimitive.List>
    );
  },
);

export interface TabProps
  extends Omit<
    ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    "asChild"
  > {
  children?: ReactNode;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { className, style, children, value, ...rest },
  ref,
) {
  const sketch = useTabsSketch();
  const active = sketch.current === value;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      value={value}
      className={cn(className)}
      style={{
        position: "relative",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: "8px 14px 12px",
        fontFamily: doodleUiFontFamily,
        fontSize: 15,
        fontWeight: active
          ? doodleUiFontWeight(650)
          : doodleUiFontWeight(400),
        color: sketch.ink,
        outline: "none",
        ...style,
      }}
      {...rest}
    >
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      {active ? (
        <span
          style={{
            position: "absolute",
            left: 8,
            right: 8,
            bottom: 2,
            height: 10,
            pointerEvents: "none",
          }}
        >
          <RoughSvg
            shape="line"
            roughness={(sketch.roughness ?? 1.5) + 0.35}
            seed={deriveSeed(sketch.resolvedSeed, value)}
            sketchColor={SKETCH_COLORS.accent}
            bowing={sketch.bowing ?? 1.8}
            strokeWidth={(sketch.strokeWidth ?? 1.75) + 0.4}
            inset={2}
          />
        </span>
      ) : null}
    </TabsPrimitive.Trigger>
  );
});

export interface TabPanelProps
  extends Omit<
    ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    "asChild"
  > {}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  function TabPanel({ className, style, children, ...rest }, ref) {
    const sketch = useTabsSketch();
    return (
      <TabsPrimitive.Content
        ref={ref}
        className={cn(className)}
        style={{
          paddingTop: 14,
          fontFamily: doodleUiFontFamily,
          color: sketch.ink,
          fontSize: 15,
          lineHeight: 1.5,
          outline: "none",
          ...style,
        }}
        {...rest}
      >
        {children}
      </TabsPrimitive.Content>
    );
  },
);
