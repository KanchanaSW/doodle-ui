"use client";

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
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontFamily } from "../utils";

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

export interface RadioProps
  extends Omit<
      ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
      "asChild"
    >,
    SketchProps {
  label?: ReactNode;
  /**
   * Draw-in the ring on mount and scale/draw the dot on select.
   * Defaults to the DoodleUIProvider value (true).
   */
  animate?: boolean;
}

const SIZE = 20;

function RadioDot({
  roughness,
  seed,
  bowing,
  shouldAnimate,
}: {
  roughness?: number;
  seed?: number;
  bowing?: number;
  shouldAnimate: boolean;
}) {
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
        roughness={(roughness ?? 1.5) + 0.2}
        seed={seed}
        sketchColor={SKETCH_COLORS.accent}
        fill={SKETCH_COLORS.accent}
        fillStyle="solid"
        bowing={bowing}
        strokeWidth={1}
        inset={6}
      />
    </span>
  );
}

export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio(
  {
    className,
    style,
    label,
    roughness,
    seed,
    sketchColor,
    bowing,
    fillStyle,
    strokeWidth,
    id,
    animate,
    ...rest
  },
  ref,
) {
  const ink = sketchColor ?? SKETCH_COLORS.ink;
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
            fillStyle={fillStyle}
            strokeWidth={strokeWidth ?? 1.6}
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
            bowing={bowing}
            shouldAnimate={shouldAnimate}
          />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {label ? (
        <label
          htmlFor={inputId}
          style={{ fontSize: 15, cursor: "pointer", fontFamily: doodleUiFontFamily }}
        >
          {label}
        </label>
      ) : null}
    </span>
  );
});
