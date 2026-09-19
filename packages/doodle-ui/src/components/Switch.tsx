"use client";

import { useBaseRoughness } from "../hooks/useSketchDefaults";
import { forwardRef, useId, useRef, useState, type ReactNode } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { motion } from "framer-motion";
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
  SIZE_TOKENS,
  SWITCH_SIZE,
  resolveSize,
  type DoodleSize,
} from "../primitives/size";
import type { SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily } from "../utils";

export type SwitchSize = DoodleSize;

/**
 * Props for {@link Switch}.
 */
export interface SwitchProps
  extends Omit<SwitchPrimitive.SwitchProps, "asChild">,
    SketchProps {
  /** Visible label beside the control. */
  label?: ReactNode;
  /**
   * Control size preset.
   * @default "md"
   */
  size?: SwitchSize;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Toggle switch with sliding thumb.
 *
 * Supports controlled (`checked` + `onCheckedChange`) and uncontrolled
 * (`defaultChecked`). Pass `name` for native FormData / RHF Controller.
 *
 * @example
 * <Switch label="Notifications" name="notify" />
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch(
    {
      className,
      style,
      label,
      size: sizeProp = "md",
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      checked,
      defaultChecked,
      onCheckedChange,
      id,
      animate,
      disabled,
      ...rest
    },
    ref,
  ) {
    const size = resolveSize(sizeProp);
    const { trackW, trackH, thumb } = SWITCH_SIZE[size];
    const thumbOff = 3;
    const thumbOn = trackW - thumb - 3;
    const [uncontrolled, setUncontrolled] = useState(defaultChecked === true);
    const isOn = checked ?? uncontrolled;
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const baseRoughness = useBaseRoughness();
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const activeColor = sketchColor ?? theme.accent;
    const activeFill = theme.isDark
      ? sketchColor
        ? `${sketchColor}25`
        : theme.accentFill
      : theme.accentFill;
    const resolvedSeed = useResolvedSeed(seed);
    const shouldAnimate = useAnimate(animate);
    const trackRef = useRef<HTMLSpanElement>(null);
    const trackSeed = shouldAnimate
      ? deriveSeed(resolvedSeed, isOn ? "on" : "off")
      : resolvedSeed;
    const interactive = resolveInteractiveState({ disabled });

    useDrawIn(trackRef, DRAW_IN_DURATION_MS, shouldAnimate, trackSeed);

    return (
      <span
        className={cn(className)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: SIZE_TOKENS[size].gap,
          cursor: interactive.isDisabled ? "not-allowed" : "pointer",
          userSelect: "none",
          color: ink,
          ...interactive.style,
          ...style,
        }}
      >
        <SwitchPrimitive.Root
          ref={ref}
          id={inputId}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={interactive.isDisabled}
          aria-disabled={interactive.aria["aria-disabled"]}
          onCheckedChange={(next) => {
            setUncontrolled(next);
            onCheckedChange?.(next);
          }}
          style={{
            position: "relative",
            width: trackW,
            height: trackH,
            padding: 0,
            border: "none",
            background: "transparent",
            flexShrink: 0,
            cursor: interactive.isDisabled ? "not-allowed" : "pointer",
            outline: "none",
          }}
          {...rest}
        >
          <span
            ref={trackRef}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            <RoughSvg
              shape="rectangle"
              roughness={roughness}
              seed={trackSeed}
              sketchColor={isOn ? activeColor : ink}
              bowing={bowing ?? 1.4}
              fillStyle={fillStyle ?? (isOn ? "hachure" : undefined)}
              fill={isOn ? activeFill : undefined}
              strokeWidth={strokeWidth ?? SIZE_TOKENS[size].strokeWidth}
              inset={1.5}
            />
          </span>
          <SwitchPrimitive.Thumb asChild>
            <motion.span
              initial={false}
              animate={{ x: isOn ? thumbOn : thumbOff }}
              transition={
                shouldAnimate
                  ? { type: "spring", stiffness: 420, damping: 30 }
                  : { duration: 0 }
              }
              style={{
                position: "absolute",
                top: (trackH - thumb) / 2,
                left: 0,
                width: thumb,
                height: thumb,
                display: "block",
                zIndex: 1,
              }}
            >
              <RoughSvg
                shape="ellipse"
                roughness={(roughness ?? baseRoughness) * 0.85}
                seed={deriveSeed(resolvedSeed, "thumb")}
                sketchColor={isOn ? activeColor : ink}
                fill={theme.paper}
                fillStyle="solid"
                bowing={bowing}
                strokeWidth={(strokeWidth ?? 1.5) + 0.2}
                inset={1}
              />
            </motion.span>
          </SwitchPrimitive.Thumb>
        </SwitchPrimitive.Root>
        {label ? (
          <label
            htmlFor={inputId}
            style={{
              fontSize: SIZE_TOKENS[size].fontSize,
              cursor: interactive.isDisabled ? "not-allowed" : "pointer",
              fontFamily: doodleUiFontFamily,
              color: ink,
            }}
          >
            {label}
          </label>
        ) : null}
      </span>
    );
  },
);
