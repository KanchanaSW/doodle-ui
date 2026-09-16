"use client";

import { useBaseRoughness } from "../hooks/useSketchDefaults";
import {
  forwardRef,
  useId,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import {
  DRAW_IN_DURATION_MS,
  DRAW_IN_MARK_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily } from "../utils";

/**
 * Props for {@link RadioGroup}.
 */
export interface RadioGroupProps
  extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup({ className, style, children, ...rest }, ref) {
    return (
      <RadioGroupPrimitive.Root
        ref={ref}
        className={cn(className)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          ...style,
        }}
        {...rest}
      >
        {children}
      </RadioGroupPrimitive.Root>
    );
  },
);

/**
 * Props for {@link Radio}.
 */
export interface RadioProps
  extends Omit<
      ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
      "asChild"
    >,
    SketchProps {
  /** Visible label beside the control. */
  label?: ReactNode;
  fill?: string;
  /**
   * Draw-in the ring on mount and scale/draw the dot on select.
   * Defaults to the DoodleUIProvider value (true).
   */
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

const SIZE = 20;

function RadioDot({
  roughness,
  seed,
  sketchColor,
  bowing,
  shouldAnimate,
}: {
  roughness?: number;
  seed?: number;
  sketchColor?: string;
  bowing?: number;
  shouldAnimate: boolean;
}) {
  const baseRoughness = useBaseRoughness();
  const ref = useRef<HTMLSpanElement>(null);
  useDrawIn(ref, DRAW_IN_MARK_MS, shouldAnimate);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || !shouldAnimate) return;
    const animation = node.animate(
      [
        { transform: "scale(0.35)", opacity: 0 },
        { transform: "scale(1)", opacity: 1 },
      ],
      { duration: 180, easing: "ease-out", fill: "forwards" },
    );
    return () => animation.cancel();
  }, [shouldAnimate]);

  return (
    <span
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        display: "block",
      }}
    >
      <RoughSvg
        shape="ellipse"
        roughness={(roughness ?? baseRoughness) + 0.2}
        seed={seed}
        sketchColor={sketchColor}
        fill={sketchColor}
        fillStyle="solid"
        bowing={bowing}
        strokeWidth={1}
        inset={6}
      />
    </span>
  );
}

/**
 * Circular radio option with a filled dot when selected.
 *
 * @example
 * <Radio />
 */
export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio(
  {
    className,
    style,
    label,
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
    id,
    animate,
    ...rest
  },
  ref,
) {
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;
  const accent = sketchColor ?? theme.accent;
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const ringRef = useRef<HTMLSpanElement>(null);
  const shouldAnimate = useAnimate(animate);
  useDrawIn(ringRef, DRAW_IN_DURATION_MS, shouldAnimate);

  return (
    <span
      className={cn(className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        userSelect: "none",
        color: ink,
        ...style,
      }}
    >
      <RadioGroupPrimitive.Item
        ref={ref}
        id={inputId}
        style={{
          position: "relative",
          width: SIZE,
          height: SIZE,
          padding: 0,
          border: "none",
          background: "transparent",
          flexShrink: 0,
          cursor: "pointer",
          borderRadius: "50%",
        }}
        {...rest}
      >
        <span
          ref={ringRef}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <RoughSvg
            shape="ellipse"
            roughness={roughness}
            seed={seed}
            sketchColor={ink}
            bowing={bowing}
            fillStyle={fillStyle ?? (fill ? "solid" : undefined)}
            fill={fill}
            strokeWidth={strokeWidth ?? 1.6}
            hachureGap={hachureGap}
            hachureAngle={hachureAngle}
            fillWeight={fillWeight}
            inset={1.5}
          />
        </span>
        <RadioGroupPrimitive.Indicator
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
          }}
        >
          <RadioDot
            roughness={roughness}
            seed={seed}
            sketchColor={accent}
            bowing={bowing}
            shouldAnimate={shouldAnimate}
          />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {label ? (
        <label
          htmlFor={inputId}
          style={{ fontSize: 15, cursor: "pointer", fontFamily: doodleUiFontFamily, color: ink }}
        >
          {label}
        </label>
      ) : null}
    </span>
  );
});
