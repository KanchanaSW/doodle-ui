"use client";

import { forwardRef, useId, type ReactNode } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn } from "../utils";

export interface CheckboxProps
  extends Omit<CheckboxPrimitive.CheckboxProps, "asChild">,
    SketchProps {
  label?: ReactNode;
}

const BOX = 20;
const CHECK_PATH = "M 4.5 10.5 L 8.5 14.5 L 15.5 5.5";

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox(
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
      checked,
      defaultChecked,
      onCheckedChange,
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
        <CheckboxPrimitive.Root
          ref={ref}
          id={inputId}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          style={{
            position: "relative",
            width: BOX,
            height: BOX,
            padding: 0,
            border: "none",
            background: "transparent",
            flexShrink: 0,
            cursor: "pointer",
          }}
          {...rest}
        >
          <RoughSvg
            shape="rectangle"
            roughness={roughness}
            seed={seed}
            sketchColor={ink}
            bowing={bowing}
            fillStyle={fillStyle}
            strokeWidth={strokeWidth ?? 1.6}
            inset={1.5}
          />
          <CheckboxPrimitive.Indicator
            style={{
              position: "absolute",
              inset: 0,
              display: "block",
            }}
          >
            <RoughSvg
              shape="path"
              path={CHECK_PATH}
              roughness={(roughness ?? 1.5) * 0.7}
              seed={seed}
              sketchColor={SKETCH_COLORS.accent}
              bowing={bowing}
              strokeWidth={(strokeWidth ?? 1.6) + 0.4}
              inset={0}
            />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {label ? (
          <label htmlFor={inputId} style={{ fontSize: 15, cursor: "pointer" }}>
            {label}
          </label>
        ) : null}
      </span>
    );
  },
);
