"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { DRAW_IN_ALERT_MS } from "../animations";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, doodleUiFontWeight } from "../utils";

export type AlertVariant = "info" | "warning" | "error" | "success";

/**
 * Props for {@link Alert}.
 */
export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color" | "title">,
    SketchProps {
  variant?: AlertVariant;
  title?: ReactNode;
  fill?: string;
  /**
   * Draw-in the border on mount (~200ms). Defaults to the DoodleUIProvider value (true).
   */
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

const LIGHT_VARIANT_FILL: Record<AlertVariant, string> = {
  info: "#d2deec",
  warning: "#f3e2c0",
  error: "#f3d0cc",
  success: "#d3e8dc",
};

const DARK_VARIANT_FILL: Record<AlertVariant, string> = {
  info: "rgba(96, 165, 250, 0.16)",
  warning: "rgba(251, 191, 36, 0.16)",
  error: "rgba(248, 113, 113, 0.16)",
  success: "rgba(52, 211, 153, 0.16)",
};

/**
 * Color-coded callout with sketch framing.
 *
 * @example
 * <Alert />
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    children,
    className,
    style,
    variant = "info",
    title,
    fill,
    roughness,
    seed,
    sketchColor,
    bowing,
    fillStyle,
    strokeWidth,
    hachureGap,
    hachureAngle,
    fillWeight,
    role = "status",
    animate,
    ...rest
  },
  ref,
) {
  const theme = useSketchTheme(sketchColor);
  const color = sketchColor ?? theme[variant];
  const defaultFill = theme.isDark ? DARK_VARIANT_FILL[variant] : LIGHT_VARIANT_FILL[variant];
  const resolvedFill = fill ?? defaultFill;

  return (
    <SketchBox
      ref={ref}
      role={role}
      className={cn(className)}
      style={{ color, ...style }}
      contentStyle={{ padding: "12px 16px", color: theme.ink }}
      roughness={roughness}
      seed={seed}
      sketchColor={color}
      bowing={bowing}
      fillStyle={fillStyle ?? "hachure"}
      fill={resolvedFill}
      strokeWidth={strokeWidth}
      hachureGap={hachureGap ?? 9}
      hachureAngle={hachureAngle}
      fillWeight={fillWeight ?? 0.85}
      animate={animate}
      drawInDuration={DRAW_IN_ALERT_MS}
      {...rest}
    >
      {title ? (
        <div
          style={{
            fontWeight: doodleUiFontWeight(700),
            marginBottom: 4,
            fontSize: 15,
            color,
          }}
        >
          {title}
        </div>
      ) : null}
      <div style={{ fontSize: 14, lineHeight: 1.5, color: theme.ink }}>
        {children}
      </div>
    </SketchBox>
  );
});
