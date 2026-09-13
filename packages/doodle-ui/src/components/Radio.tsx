"use client";

import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
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
}

const SIZE = 20;

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
    ...rest
  },
  ref,
) {
  const ink = sketchColor ?? SKETCH_COLORS.ink;
  const generatedId = useId();
  const inputId = id ?? generatedId;

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
        <RadioGroupPrimitive.Indicator
          style={{
            position: "absolute",
            inset: 0,
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
