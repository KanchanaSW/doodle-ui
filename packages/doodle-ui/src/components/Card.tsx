"use client";

import { forwardRef, memo, type HTMLAttributes, type ReactNode } from "react";
import { SketchBox, type SketchBoxProps } from "../primitives/SketchBox";
import { useSketchTheme } from "../hooks/useSketchTheme";
import type { SketchProps } from "../types";
import { cn, doodleUiFontWeight } from "../utils";

/**
 * Props for {@link Card}.
 */
export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color" | "title">,
    SketchProps {
  shadow?: boolean;
  fill?: string;
  title?: ReactNode;
  footer?: ReactNode;
  /**
   * Draw-in the border on mount. Defaults to the DoodleUIProvider value (true).
   */
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Content container with optional offset shadow.
 *
 * @example
 * <Card />
 */
export const Card = memo(
  forwardRef<HTMLDivElement, CardProps>(function Card(
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

    const boxProps: SketchBoxProps = {
      shadow,
      fill,
      roughness,
      seed,
      sketchColor: ink,
      bowing,
      fillStyle,
      strokeWidth,
      hachureGap,
      hachureAngle,
      fillWeight,
      animate,
    };

    return (
      <SketchBox
        ref={ref}
        className={cn(className)}
        style={{
          color: ink,
          ...style,
        }}
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
              color: ink,
            }}
          >
            {title}
          </div>
        ) : null}
        {children}
        {footer ? (
          <div style={{ marginTop: 14, fontSize: 13, opacity: 0.8, color: ink }}>
            {footer}
          </div>
        ) : null}
      </SketchBox>
    );
  }),
);
Card.displayName = "Card";
