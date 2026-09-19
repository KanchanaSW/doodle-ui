"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { DRAW_IN_ALERT_MS } from "../animations";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SketchBox } from "../primitives/SketchBox";
import { DoodleIcon } from "../primitives/icon";
import {
  SIZE_TOKENS,
  resolveSize,
  type DoodleSize,
} from "../primitives/size";
import type { SketchProps } from "../types";
import { cn, doodleUiFontWeight } from "../utils";

export type AlertVariant = "info" | "warning" | "error" | "success";
export type AlertSize = DoodleSize;

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
   * Control size preset.
   * @default "md"
   */
  size?: AlertSize;
  /** Leading icon beside the title/body. */
  startIcon?: ReactNode;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

const LIGHT_VARIANT_FILL: Record<AlertVariant, string> = {
  info: "#d2deec",
  warning: "#f8ebd0",
  error: "#f8d4d0",
  success: "#d3e8dc",
};

const DARK_VARIANT_FILL: Record<AlertVariant, string> = {
  info: "rgba(96, 165, 250, 0.16)",
  warning: "rgba(251, 191, 36, 0.16)",
  error: "rgba(248, 113, 113, 0.16)",
  success: "rgba(52, 211, 153, 0.16)",
};

const ALERT_PADDING: Record<DoodleSize, string> = {
  sm: "8px 12px",
  md: "12px 16px",
  lg: "16px 20px",
};

/**
 * Color-coded callout with sketch framing.
 *
 * @example
 * <Alert variant="warning" title="Heads up" startIcon={<Icon />}>
 *   Check your settings.
 * </Alert>
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    children,
    className,
    style,
    variant = "info",
    title,
    fill,
    size: sizeProp = "md",
    startIcon,
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
  const size = resolveSize(sizeProp);
  const theme = useSketchTheme(sketchColor);
  const color = sketchColor ?? theme[variant];
  const defaultFill = theme.isDark
    ? DARK_VARIANT_FILL[variant]
    : LIGHT_VARIANT_FILL[variant];
  const resolvedFill = fill ?? defaultFill;
  const tokens = SIZE_TOKENS[size];

  return (
    <SketchBox
      ref={ref}
      role={role}
      className={cn(className)}
      style={{ color, ...style }}
      contentStyle={{
        padding: ALERT_PADDING[size],
        color: theme.ink,
        display: "flex",
        gap: tokens.gap,
        alignItems: "flex-start",
      }}
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
      {startIcon ? (
        <span style={{ flexShrink: 0, color, marginTop: 2 }}>
          <DoodleIcon size={size}>{startIcon}</DoodleIcon>
        </span>
      ) : null}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title ? (
          <div
            style={{
              fontWeight: doodleUiFontWeight(700),
              marginBottom: 4,
              fontSize: tokens.fontSize,
              color,
            }}
          >
            {title}
          </div>
        ) : null}
        <div
          style={{
            fontSize: tokens.fontSize - 1,
            lineHeight: 1.5,
            color: theme.ink,
          }}
        >
          {children}
        </div>
      </div>
    </SketchBox>
  );
});
