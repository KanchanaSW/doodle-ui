"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { DRAW_IN_ALERT_MS } from "../animations";
import { SketchBox } from "../primitives/SketchBox";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontWeight } from "../utils";

export type AlertVariant = "info" | "warning" | "error" | "success";

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color" | "title">,
    SketchProps {
  variant?: AlertVariant;
  title?: ReactNode;
  /**
   * Draw-in the border on mount (~200ms). Defaults to the DoodleUIProvider value (true).
   */
  animate?: boolean;
}

const VARIANT_COLOR: Record<AlertVariant, string> = {
  info: SKETCH_COLORS.info,
  warning: SKETCH_COLORS.warning,
  error: SKETCH_COLORS.error,
  success: SKETCH_COLORS.success,
};

const VARIANT_FILL: Record<AlertVariant, string> = {
  info: "#d2deec",
  warning: "#f3e2c0",
  error: "#f3d0cc",
  success: "#d3e8dc",
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    children,
    className,
    style,
    variant = "info",
    title,
    roughness,
    seed,
    sketchColor,
    bowing,
    fillStyle,
    strokeWidth,
    role = "status",
    animate,
    ...rest
  },
  ref,
) {
  const color = sketchColor ?? VARIANT_COLOR[variant];

  return (
    <SketchBox
      ref={ref}
      role={role}
      className={cn(className)}
      style={{ color, ...style }}
      contentStyle={{ padding: "12px 16px" }}
      roughness={roughness}
      seed={seed}
      sketchColor={color}
      bowing={bowing}
      fillStyle={fillStyle ?? "hachure"}
      fill={VARIANT_FILL[variant]}
      strokeWidth={strokeWidth}
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
          }}
        >
          {title}
        </div>
      ) : null}
      <div style={{ fontSize: 14, lineHeight: 1.5, color: SKETCH_COLORS.ink }}>
        {children}
      </div>
    </SketchBox>
  );
});
