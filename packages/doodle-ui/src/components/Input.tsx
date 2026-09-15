"use client";

import {
  forwardRef,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import {
  DRAW_IN_DURATION_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size">,
    SketchProps {
  label?: ReactNode;
  /**
   * Draw-in the border on mount and seed-morph on focus.
   * Defaults to the DoodleUIProvider value (true).
   */
  animate?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
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
    onFocus,
    onBlur,
    animate,
    ...rest
  },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const fieldRef = useRef<HTMLSpanElement>(null);
  const shouldAnimate = useAnimate(animate);
  const resolvedSeed = useResolvedSeed(seed);
  const focusSeed = deriveSeed(resolvedSeed, "focus");
  const sketchSeed =
    shouldAnimate && focused ? focusSeed : resolvedSeed;
  const ink = sketchColor ?? SKETCH_COLORS.ink;
  const inputId = id;

  useDrawIn(fieldRef, DRAW_IN_DURATION_MS, shouldAnimate, sketchSeed);

  return (
    <label
      htmlFor={inputId}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "100%",
      }}
    >
      {label ? (
        <span
          style={{
            fontSize: 13,
            fontWeight: doodleUiFontWeight(600),
            fontFamily: doodleUiFontFamily,
            color: ink,
          }}
        >
          {label}
        </span>
      ) : null}
      <span ref={fieldRef} style={{ position: "relative", display: "block" }}>
        <RoughSvg
          shape="rectangle"
          roughness={roughness}
          seed={sketchSeed}
          sketchColor={focused ? SKETCH_COLORS.accent : ink}
          bowing={bowing}
          fillStyle={fillStyle}
          strokeWidth={
            focused && !shouldAnimate
              ? (strokeWidth ?? 1.75) + 0.35
              : focused
                ? (strokeWidth ?? 1.75) + 0.2
                : strokeWidth
          }
        />
        <input
          ref={ref}
          id={inputId}
          className={cn(className)}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            boxSizing: "border-box",
            border: "none",
            outline: "none",
            background: "transparent",
            color: ink,
            fontFamily: doodleUiFontFamily,
            fontSize: 15,
            padding: "8px 12px",
            ...style,
          }}
          {...rest}
        />
      </span>
    </label>
  );
});
