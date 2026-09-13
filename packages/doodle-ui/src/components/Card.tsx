"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { SketchBox, type SketchBoxProps } from "../primitives/SketchBox";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontWeight } from "../utils";

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color" | "title">,
    SketchProps {
  shadow?: boolean;
  fill?: string;
  title?: ReactNode;
  footer?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    children,
    className,
    style,
    shadow = true,
    fill,
    title,
    footer,
    roughness,
    seed,
    sketchColor,
    bowing,
    fillStyle,
    strokeWidth,
    ...rest
  },
  ref,
) {
  const boxProps: SketchBoxProps = {
    shadow,
    fill,
    roughness,
    seed,
    sketchColor: sketchColor ?? SKETCH_COLORS.ink,
    bowing,
    fillStyle,
    strokeWidth,
  };

  return (
    <SketchBox
      ref={ref}
      className={cn(className)}
      style={style}
      contentStyle={{ padding: "16px 18px" }}
      {...boxProps}
      {...rest}
    >
      {title ? (
        <div
          style={{
            fontWeight: doodleUiFontWeight(700),
            fontSize: 16,
            marginBottom: 10,
          }}
        >
          {title}
        </div>
      ) : null}
      {children}
      {footer ? (
        <div style={{ marginTop: 14, fontSize: 13, opacity: 0.8 }}>
          {footer}
        </div>
      ) : null}
    </SketchBox>
  );
});
