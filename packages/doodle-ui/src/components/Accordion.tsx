"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { RoughSvg } from "../primitives/RoughSvg";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { deriveSeed } from "../utils";

const CHEVRON_PATH = "M 6 4 L 12 10 L 6 16";

interface AccordionSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  openValue: string | string[] | undefined;
}

const AccordionSketchContext =
  createContext<AccordionSketchContextValue | null>(null);

function useAccordionSketch(): AccordionSketchContextValue {
  const ctx = useContext(AccordionSketchContext);
  if (!ctx) {
    throw new Error("Accordion parts must be used inside <Accordion>.");
  }
  return ctx;
}

const AccordionItemContext = createContext<string>("");

export interface AccordionProps extends SketchProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(
    {
      className,
      style,
      children,
      type = "single",
      collapsible = true,
      value,
      defaultValue,
      onValueChange,
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
    },
    ref,
  ) {
    const resolvedSeed = useResolvedSeed(seed);
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const [uncontrolled, setUncontrolled] = useState<
      string | string[] | undefined
    >(defaultValue ?? (type === "multiple" ? [] : undefined));
    const openValue = value ?? uncontrolled;

    const sketchValue: AccordionSketchContextValue = {
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
      openValue,
    };

    function handleChange(next: string | string[]) {
      setUncontrolled(next);
      onValueChange?.(next);
    }

    const root =
      type === "multiple" ? (
        <AccordionPrimitive.Root
          ref={ref}
          type="multiple"
          disabled={disabled}
          className={cn(className)}
          style={style}
          value={openValue as string[] | undefined}
          defaultValue={defaultValue as string[] | undefined}
          onValueChange={handleChange}
        >
          {children}
        </AccordionPrimitive.Root>
      ) : (
        <AccordionPrimitive.Root
          ref={ref}
          type="single"
          collapsible={collapsible}
          disabled={disabled}
          className={cn(className)}
          style={style}
          value={openValue as string | undefined}
          defaultValue={defaultValue as string | undefined}
          onValueChange={handleChange}
        >
          {children}
        </AccordionPrimitive.Root>
      );

    return (
      <AccordionSketchContext.Provider value={sketchValue}>
        {root}
      </AccordionSketchContext.Provider>
    );
  },
);

export interface AccordionItemProps
  extends Omit<
    ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
    "asChild"
  > {}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem({ className, style, children, value, ...rest }, ref) {
    const sketch = useAccordionSketch();

    return (
      <AccordionItemContext.Provider value={value}>
        <AccordionPrimitive.Item
          ref={ref}
          value={value}
          className={cn(className)}
          style={{ position: "relative", ...style }}
          {...rest}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: -6,
              height: 12,
              pointerEvents: "none",
            }}
          >
            <RoughSvg
              shape="line"
              roughness={(sketch.roughness ?? 1.5) + 0.25}
              seed={deriveSeed(sketch.resolvedSeed, `div-${value}`)}
              sketchColor={sketch.ink}
              bowing={sketch.bowing ?? 1.8}
              strokeWidth={sketch.strokeWidth ?? 1.4}
              inset={2}
            />
          </div>
          {children}
        </AccordionPrimitive.Item>
      </AccordionItemContext.Provider>
    );
  },
);

export interface AccordionTriggerProps
  extends Omit<
    ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>,
    "asChild"
  > {
  children?: ReactNode;
}

export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(function AccordionTrigger({ className, style, children, ...rest }, ref) {
  const sketch = useAccordionSketch();
  const itemValue = useContext(AccordionItemContext);
  const open = Array.isArray(sketch.openValue)
    ? sketch.openValue.includes(itemValue)
    : sketch.openValue === itemValue;

  return (
    <AccordionPrimitive.Header asChild>
      <h3 style={{ margin: 0 }}>
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(className)}
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "12px 4px",
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
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 180ms ease",
            }}
          >
            <RoughSvg
              shape="path"
              path={CHEVRON_PATH}
              roughness={(sketch.roughness ?? 1.5) * 0.7}
              seed={deriveSeed(sketch.resolvedSeed, `chevron-${itemValue}`)}
              sketchColor={sketch.ink}
              bowing={sketch.bowing}
              strokeWidth={(sketch.strokeWidth ?? 1.6) + 0.2}
              inset={0}
            />
          </span>
        </AccordionPrimitive.Trigger>
      </h3>
    </AccordionPrimitive.Header>
  );
});

export interface AccordionContentProps
  extends Omit<
    ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>,
    "asChild"
  > {}

export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(function AccordionContent({ className, style, children, ...rest }, ref) {
  const sketch = useAccordionSketch();
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(className)}
      style={{
        padding: "0 4px 14px",
        fontFamily: doodleUiFontFamily,
        fontSize: 14,
        lineHeight: 1.5,
        color: sketch.ink,
        ...style,
      }}
      {...rest}
    >
      {children}
    </AccordionPrimitive.Content>
  );
});
