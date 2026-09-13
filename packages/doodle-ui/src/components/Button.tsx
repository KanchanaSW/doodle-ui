"use client";

import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
} from "react";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    SketchProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const SIZE_STYLES: Record<ButtonSize, CSSProperties> = {
  sm: { fontSize: 13, padding: "4px 12px", minHeight: 30 },
  md: { fontSize: 15, padding: "8px 16px", minHeight: 38 },
  lg: { fontSize: 17, padding: "11px 22px", minHeight: 46 },
};

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
      disabled,
      onMouseEnter,
      onMouseLeave,
      ...rest
    },
    ref,
  ) {
    const [hovered, setHovered] = useState(false);
    const ink = sketchColor ?? SKETCH_COLORS.ink;

    const fill =
      variant === "primary"
        ? SKETCH_COLORS.accentFill
        : variant === "secondary"
          ? SKETCH_COLORS.secondaryFill
          : undefined;

    const stroke =
      variant === "ghost" && !hovered
        ? "transparent"
        : variant === "primary"
          ? sketchColor ?? SKETCH_COLORS.accent
          : ink;

    return (
      <button
        ref={ref}
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
          color: ink,
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
          seed={seed}
          sketchColor={stroke}
          bowing={bowing}
          fillStyle={fillStyle ?? "hachure"}
          fill={fill}
          strokeWidth={
            hovered ? (strokeWidth ?? 1.75) + 0.4 : strokeWidth
          }
        />
        <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      </button>
    );
  },
);
