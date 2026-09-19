"use client";

import {
  forwardRef,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import {
  DRAW_IN_DURATION_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import { resolveInteractiveState } from "../primitives/interactive";
import {
  CONTROL_SIZE_STYLES,
  resolveSize,
  type DoodleSize,
} from "../primitives/size";
import type { SketchProps } from "../types";
import { assignRef, cn, deriveSeed, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

export type ToggleSize = DoodleSize;

/**
 * Props for {@link Toggle}.
 */
export interface ToggleProps
  extends Omit<TogglePrimitive.ToggleProps, "asChild">,
    SketchProps {
  /**
   * Control size preset.
   * @default "md"
   */
  size?: ToggleSize;
  /**
   * Draw-in on mount and seed morph on press.
   * Defaults to the DoodleUIProvider value (true).
   */
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Pressed/unpressed sketch toggle button.
 *
 * @example
 * <Toggle />
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  function Toggle(
    {
      className,
      style,
      size: sizeProp = "md",
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      hachureGap,
      hachureAngle,
      fillWeight,
      pressed,
      defaultPressed,
      onPressedChange,
      disabled,
      animate,
      children,
      ...rest
    },
    ref,
  ) {
    const size = resolveSize(sizeProp);
    const rootRef = useRef<HTMLButtonElement>(null);
    const [uncontrolled, setUncontrolled] = useState(defaultPressed === true);
    const isPressed = pressed ?? uncontrolled;
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const accent = sketchColor ?? theme.accent;
    const accentFill = theme.isDark
      ? (sketchColor ? `${sketchColor}25` : theme.accentFill)
      : theme.accentFill;
    const resolvedSeed = useResolvedSeed(seed);
    const shouldAnimate = useAnimate(animate);
    const pressSeed = deriveSeed(resolvedSeed, isPressed ? "on" : "off");
    const sketchSeed = shouldAnimate ? pressSeed : resolvedSeed;
    const interactive = resolveInteractiveState({ disabled });

    useDrawIn(rootRef, DRAW_IN_DURATION_MS, shouldAnimate, sketchSeed);

    return (
      <TogglePrimitive.Root
        ref={(node) => {
          (rootRef as MutableRefObject<HTMLButtonElement | null>).current = node;
          assignRef(ref, node);
        }}
        pressed={pressed}
        defaultPressed={defaultPressed}
        onPressedChange={(next) => {
          setUncontrolled(next);
          onPressedChange?.(next);
        }}
        disabled={interactive.isDisabled}
        aria-disabled={interactive.aria["aria-disabled"]}
        className={cn(className)}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          background: "transparent",
          color: isPressed ? (theme.isDark ? "#ffffff" : accent) : ink,
          fontFamily: doodleUiFontFamily,
          fontWeight: doodleUiFontWeight(600),
          outline: "none",
          ...CONTROL_SIZE_STYLES[size],
          ...interactive.style,
          cursor: interactive.isDisabled ? "not-allowed" : "pointer",
          ...style,
        }}
        {...rest}
      >
        <RoughSvg
          shape="rectangle"
          roughness={roughness}
          seed={sketchSeed}
          sketchColor={isPressed ? accent : ink}
          bowing={bowing}
          fillStyle={fillStyle ?? "hachure"}
          fill={isPressed ? accentFill : undefined}
          strokeWidth={strokeWidth ?? 1.6}
          hachureGap={hachureGap ?? 7}
          hachureAngle={hachureAngle}
          fillWeight={fillWeight ?? 1}
        />
        <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      </TogglePrimitive.Root>
    );
  },
);
