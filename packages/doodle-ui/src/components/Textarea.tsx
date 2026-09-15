"use client";

import {
  forwardRef,
  useRef,
  useState,
  type ReactNode,
  type TextareaHTMLAttributes,
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

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "color">,
    SketchProps {
  label?: ReactNode;
  /**
   * Draw-in the border on mount and seed-morph on focus.
   * Defaults to the DoodleUIProvider value (true).
   */
  animate?: boolean;
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

    useDrawIn(fieldRef, DRAW_IN_DURATION_MS, shouldAnimate, sketchSeed);

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
