"use client";

import { forwardRef, useId, useRef, type ReactNode } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import {
  DRAW_IN_DURATION_MS,
  DRAW_IN_MARK_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontFamily } from "../utils";

export interface CheckboxProps
  extends Omit<CheckboxPrimitive.CheckboxProps, "asChild">,
    SketchProps {
  label?: ReactNode;
  /**
   * Draw-in the box on mount and the checkmark when checked.
   * Defaults to the DoodleUIProvider value (true).
   */
  animate?: boolean;
}

const BOX = 20;
const CHECK_PATH = "M 4.5 10.5 L 8.5 14.5 L 15.5 5.5";

function CheckMark({
  roughness,
  seed,
  bowing,
  strokeWidth,
  shouldAnimate,
}: {
  roughness?: number;
  seed?: number;
  bowing?: number;
  strokeWidth?: number;
  shouldAnimate: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useDrawIn(ref, DRAW_IN_MARK_MS, shouldAnimate);

  return (
    <span
      ref={ref}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
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
    </span>
  );
}

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
      animate,
      ...rest
    },
    ref,
  ) {
    const ink = sketchColor ?? SKETCH_COLORS.ink;
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const boxRef = useRef<HTMLSpanElement>(null);
    const shouldAnimate = useAnimate(animate);
    useDrawIn(boxRef, DRAW_IN_DURATION_MS, shouldAnimate);

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
          <span
            ref={boxRef}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
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
          </span>
          <CheckboxPrimitive.Indicator
            style={{
              position: "absolute",
              inset: 0,
              display: "block",
            }}
          >
            <CheckMark
              roughness={roughness}
              seed={seed}
              bowing={bowing}
              strokeWidth={strokeWidth}
              shouldAnimate={shouldAnimate}
            />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
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
  },
);
