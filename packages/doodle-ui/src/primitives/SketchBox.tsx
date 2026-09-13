"use client";

import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { RoughSvg } from "./RoughSvg";
import type { FillStyle, RoughShape, SketchProps } from "../types";
import { cn, doodleUiFontFamily } from "../utils";

export interface SketchBoxProps
  extends SketchProps, Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  children?: ReactNode;
  shape?: RoughShape;
  fill?: string;
  fillStyle?: FillStyle;
  shadow?: boolean;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  inset?: number;
  path?: string;
}

export const SketchBox = forwardRef<HTMLDivElement, SketchBoxProps>(
  function SketchBox(
    {
      children,
      className,
      style,
      contentClassName,
      contentStyle,
      shape = "rectangle",
      fill,
      fillStyle,
      shadow = false,
      roughness,
      seed,
      sketchColor,
      bowing,
      strokeWidth,
      inset,
      path,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{ position: "relative", ...style }}
        {...rest}
      >
        {shadow ? (
          <RoughSvg
            shape={shape}
            roughness={(roughness ?? 1.5) + 0.35}
            seed={seed}
            sketchColor={sketchColor}
            bowing={bowing}
            fillStyle="hachure"
            fill={sketchColor ?? "#1f1d1a"}
            strokeWidth={1}
            inset={inset}
            style={{ transform: "translate(5px, 6px)", opacity: 0.16 }}
          />
        ) : null}
        <RoughSvg
          shape={shape}
          roughness={roughness}
          seed={seed}
          sketchColor={sketchColor}
          bowing={bowing}
          fillStyle={fill ? fillStyle : shadow ? "solid" : fillStyle}
          fill={fill ?? (shadow ? "#f7f6f2" : undefined)}
          strokeWidth={strokeWidth}
          inset={inset}
          path={path}
        />
        <div
          className={contentClassName}
          style={{
            position: "relative",
            zIndex: 1,
            fontFamily: doodleUiFontFamily,
            ...contentStyle,
          }}
        >
          {children}
        </div>
      </div>
    );
  },
);
