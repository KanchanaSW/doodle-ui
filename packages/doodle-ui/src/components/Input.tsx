"use client";

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size">,
    SketchProps {
  label?: ReactNode;
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
    ...rest
  },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const ink = sketchColor ?? SKETCH_COLORS.ink;
  const inputId = id;

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
      <span style={{ position: "relative", display: "block" }}>
        <RoughSvg
          shape="rectangle"
          roughness={roughness}
          seed={seed}
          sketchColor={focused ? SKETCH_COLORS.accent : ink}
          bowing={bowing}
          fillStyle={fillStyle}
          strokeWidth={focused ? (strokeWidth ?? 1.75) + 0.35 : strokeWidth}
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
