"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily } from "../utils";

export interface KbdProps
  extends Omit<HTMLAttributes<HTMLElement>, "color">,
    SketchProps {
  fill?: string;
  /**
   * Draw-in the border on mount. Defaults to the DoodleUIProvider value (true).
   */
  animate?: boolean;
}

export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  {
    children,
    className,
    style,
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
    animate,
    ...rest
  },
  ref,
) {
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;

  return (
    <SketchBox
      className={cn(className)}
      style={{
        display: "inline-flex",
        verticalAlign: "middle",
        color: ink,
        ...style,
      }}
      contentStyle={{
        padding: "2px 7px",
        fontSize: 11,
        fontFamily: doodleUiFontFamily,
        lineHeight: 1.35,
        letterSpacing: "0.04em",
        color: ink,
      }}
      fill={fill ?? theme.secondaryFill}
      fillStyle={fillStyle ?? "hachure"}
      hachureGap={hachureGap ?? 6}
      hachureAngle={hachureAngle}
      fillWeight={fillWeight ?? 0.8}
      roughness={roughness}
      seed={seed}
      sketchColor={ink}
      bowing={bowing}
      strokeWidth={strokeWidth ?? 1.3}
      animate={animate}
      {...rest}
    >
      <kbd
        ref={ref}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          font: "inherit",
          color: "inherit",
        }}
      >
        {children}
      </kbd>
    </SketchBox>
  );
});
