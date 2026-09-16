"use client";

import {
  forwardRef,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ForwardedRef,
  type MutableRefObject,
} from "react";
import {
  DRAW_IN_DURATION_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import type { SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Props for {@link Button}.
 */
export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    SketchProps {
  /**
   * Visual style preset.
   * @default "primary"
   */
  variant?: ButtonVariant;
  /**
   * Control size preset.
   * @default "md"
   */
  size?: ButtonSize;
  /**
   * Play sketch animations (draw-in on mount, seed morph on hover).
   * Defaults to the DoodleUIProvider value (true). Explicit `false`
   * renders a static sketch. `prefers-reduced-motion: reduce` disables
   * animation unless the provider set `forceAnimate`.
   */
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

const SIZE_STYLES: Record<ButtonSize, CSSProperties> = {
  sm: { fontSize: 13, padding: "4px 12px", minHeight: 30 },
  md: { fontSize: 15, padding: "8px 16px", minHeight: 38 },
  lg: { fontSize: 17, padding: "11px 22px", minHeight: 46 },
};

function assignRef<T>(ref: ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as MutableRefObject<T | null>).current = value;
}

/**
 * Clickable control with rough.js border and HTML label.
 *
 * @example
 * <Button variant="primary">Save</Button>
 *
 * @see Input
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className,
      style,
      variant = "primary",
      size = "md",
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      hachureGap,
      hachureAngle,
      fillWeight,
      disabled,
      animate,
      onMouseEnter,
      onMouseLeave,
      ...rest
    },
    ref,
  ) {
    const rootRef = useRef<HTMLButtonElement>(null);
    const [hovered, setHovered] = useState(false);
    const theme = useSketchTheme(sketchColor);
    const shouldAnimate = useAnimate(animate);
    const resolvedSeed = useResolvedSeed(seed);
    const hoverSeed = deriveSeed(resolvedSeed, "hover");
    const sketchSeed =
      shouldAnimate && hovered && !disabled ? hoverSeed : resolvedSeed;
    const ink = sketchColor ?? theme.ink;

    const fill =
      variant === "primary"
        ? (theme.isDark
            ? (sketchColor ? `${sketchColor}28` : theme.accentFill)
            : theme.accentFill)
        : variant === "secondary"
          ? theme.secondaryFill
          : hovered && variant === "ghost"
            ? (theme.isDark ? "rgba(255,255,255,0.06)" : "rgba(31,29,26,0.05)")
            : undefined;

    const stroke =
      variant === "ghost" && !hovered
        ? "transparent"
        : variant === "primary"
          ? (sketchColor ?? theme.accent)
          : ink;

    const textColor =
      variant === "primary"
        ? (sketchColor ?? (theme.isDark ? "#ffffff" : ink))
        : ink;

    useDrawIn(rootRef, DRAW_IN_DURATION_MS, shouldAnimate, sketchSeed);

    return (
      <button
        ref={(node) => {
          (rootRef as MutableRefObject<HTMLButtonElement | null>).current =
            node;
          assignRef(ref, node);
        }}
        type="button"
        className={cn(className)}
        disabled={disabled}
        onMouseEnter={(event) => {
          setHovered(true);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setHovered(false);
          onMouseLeave?.(event);
        }}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          border: "none",
          background: "transparent",
          cursor: disabled ? "not-allowed" : "pointer",
          color: textColor,
          fontFamily: doodleUiFontFamily,
          fontWeight: doodleUiFontWeight(600),
          lineHeight: 1.2,
          opacity: disabled ? 0.45 : 1,
          ...SIZE_STYLES[size],
          ...style,
        }}
        {...rest}
      >
        <RoughSvg
          shape="rectangle"
          roughness={roughness}
          seed={sketchSeed}
          sketchColor={stroke}
          bowing={bowing}
          fillStyle={fillStyle ?? (fill ? "hachure" : undefined)}
          fill={fill}
          hachureGap={hachureGap ?? 7}
          hachureAngle={hachureAngle}
          fillWeight={fillWeight ?? 1}
          strokeWidth={
            !shouldAnimate && hovered
              ? (strokeWidth ?? 1.75) + 0.4
              : strokeWidth
          }
        />
        <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      </button>
    );
  },
);
