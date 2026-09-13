"use client";

import {
  forwardRef,
  useState,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "color">,
    SketchProps {
  label?: ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
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
      rows = 4,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) {
    const [focused, setFocused] = useState(false);
    const ink = sketchColor ?? SKETCH_COLORS.ink;

    return (
      <label
        htmlFor={id}
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
          <textarea
            ref={ref}
            id={id}
            rows={rows}
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
              lineHeight: 1.5,
              padding: "10px 12px",
              resize: "vertical",
              ...style,
            }}
            {...rest}
          />
        </span>
      </label>
    );
  },
);
