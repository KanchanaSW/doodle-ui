"use client";

import { forwardRef, useRef, type ReactNode } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { DRAW_IN_MARK_MS, useAnimate, useDrawIn } from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

export interface LabelProps
  extends Omit<LabelPrimitive.LabelProps, "asChild" | "color">,
    SketchProps {
  children?: ReactNode;
  /** Adds a small hand-drawn required mark after the text. */
  required?: boolean;
  /**
   * Draw-in the required mark on mount.
   * Defaults to the DoodleUIProvider value (true).
   */
  animate?: boolean;
}

/**
 * Thin, mostly-typographic wrapper around Radix Label. Ties a caption to a
 * form field via `htmlFor` for accessibility. The only sketch chrome is a
 * small drawn mark next to the text when `required` is set.
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  {
    className,
    style,
    children,
    required,
    roughness,
    seed,
    sketchColor,
    bowing,
    strokeWidth,
    animate,
    ...rest
  },
  ref,
) {
  const ink = sketchColor ?? SKETCH_COLORS.ink;
  const resolvedSeed = useResolvedSeed(seed);
  const shouldAnimate = useAnimate(animate);
  const markRef = useRef<HTMLSpanElement>(null);
  useDrawIn(markRef, DRAW_IN_MARK_MS, shouldAnimate);

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontFamily: doodleUiFontFamily,
        fontSize: 13,
        fontWeight: doodleUiFontWeight(600),
        color: ink,
        cursor: "default",
        ...style,
      }}
      {...rest}
    >
      {children}
      {required ? (
        <span
          ref={markRef}
          aria-hidden="true"
          style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}
        >
          <RoughSvg
            shape="ellipse"
            roughness={(roughness ?? 1.5) * 0.9}
            seed={resolvedSeed}
            sketchColor={SKETCH_COLORS.accent}
            bowing={bowing}
            fillStyle="solid"
            fill={SKETCH_COLORS.accent}
            strokeWidth={strokeWidth ?? 1.2}
            inset={1}
          />
        </span>
      ) : null}
    </LabelPrimitive.Root>
  );
});
