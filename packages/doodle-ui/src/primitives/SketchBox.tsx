"use client";

import {
  forwardRef,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactNode,
} from "react";
import {
  DRAW_IN_DURATION_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import type { FillStyle, RoughShape, SketchProps } from "../types";
import { assignRef, cn, doodleUiFontFamily } from "../utils";
import { RoughSvg } from "./RoughSvg";

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
  /**
   * Sketch-in the border on mount. Defaults to the DoodleUIProvider value.
   */
  animate?: boolean;
  /** Override the default 400ms draw-in duration. */
  drawInDuration?: number;
  /** Replay draw-in when this value changes. */
  drawInKey?: unknown;
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
      animate,
      drawInDuration = DRAW_IN_DURATION_MS,
      drawInKey,
      ...rest
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const shouldAnimate = useAnimate(animate);
    useDrawIn(rootRef, drawInDuration, shouldAnimate, drawInKey);

    return (
      <div
        ref={(node) => {
          (rootRef as MutableRefObject<HTMLDivElement | null>).current = node;
          assignRef(ref, node);
        }}
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
