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
import { useSketchTheme } from "../hooks/useSketchTheme";
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
      hachureGap,
      hachureAngle,
      fillWeight,
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
    const theme = useSketchTheme(sketchColor);
    const resolvedInk = sketchColor ?? theme.ink;
    const shouldAnimate = useAnimate(animate);
    useDrawIn(rootRef, drawInDuration, shouldAnimate, drawInKey);

    // Resolve fill & fillStyle:
    // When fill is passed (or when shadow is true), default to "solid" fill.
    // If developer explicitly passed fillStyle ("hachure", "dots", etc.), respect it.
    const hasExplicitFill = fill !== undefined;
    const resolvedFill = hasExplicitFill ? fill : (shadow ? theme.cardBg : undefined);
    const resolvedFillStyle: FillStyle = fillStyle ?? (resolvedFill ? "solid" : "solid");
    const isPatternedFill = Boolean(resolvedFill && resolvedFillStyle !== "solid");

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
            sketchColor={theme.isDark ? "rgba(0, 0, 0, 0.45)" : resolvedInk}
            bowing={bowing}
            fillStyle="hachure"
            fill={theme.isDark ? theme.shadow : (resolvedInk ?? theme.ink)}
            strokeWidth={1}
            hachureGap={8}
            inset={inset}
            style={{
              transform: "translate(5px, 6px)",
              opacity: theme.isDark ? 0.35 : 0.16,
            }}
          />
        ) : null}

        {/* If a patterned fill (e.g. hachure) is requested, draw an underlying solid
            card surface first so text remains 100% legible and high-contrast */}
        {isPatternedFill ? (
          <RoughSvg
            shape={shape}
            roughness={roughness}
            seed={seed}
            sketchColor="transparent"
            bowing={bowing}
            fillStyle="solid"
            fill={theme.cardBg}
            strokeWidth={0}
            inset={inset}
          />
        ) : null}

        <RoughSvg
          shape={shape}
          roughness={roughness}
          seed={seed}
          sketchColor={resolvedInk}
          bowing={bowing}
          fillStyle={resolvedFill ? resolvedFillStyle : undefined}
          fill={resolvedFill}
          strokeWidth={strokeWidth}
          hachureGap={hachureGap ?? (isPatternedFill ? 10 : undefined)}
          hachureAngle={hachureAngle}
          fillWeight={fillWeight ?? (isPatternedFill ? 0.9 : undefined)}
          inset={inset}
          path={path}
        />
        <div
          className={contentClassName}
          style={{
            position: "relative",
            zIndex: 1,
            fontFamily: doodleUiFontFamily,
            color: resolvedInk,
            ...contentStyle,
          }}
        >
          {children}
        </div>
      </div>
    );
  },
);
