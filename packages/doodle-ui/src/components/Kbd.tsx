"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { SketchBox } from "../primitives/SketchBox";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontFamily } from "../utils";

export interface KbdProps
  extends Omit<HTMLAttributes<HTMLElement>, "color">,
    SketchProps {
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
    roughness,
    seed,
    sketchColor,
    bowing,
    fillStyle,
    strokeWidth,
    animate,
    ...rest
  },
  ref,
) {
  const ink = sketchColor ?? SKETCH_COLORS.ink;

  return (
    <SketchBox
      className={cn(className)}
      style={{
        display: "inline-flex",
        verticalAlign: "middle",
        ...style,
      }}
      contentStyle={{
        padding: "2px 7px",
        fontSize: 11,
        fontFamily: doodleUiFontFamily,
        lineHeight: 1.35,
        letterSpacing: "0.04em",
      }}
      fill={SKETCH_COLORS.secondaryFill}
      fillStyle={fillStyle ?? "hachure"}
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
