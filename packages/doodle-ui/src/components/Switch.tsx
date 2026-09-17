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
import type { SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily } from "../utils";

const TRACK_W = 44;
const TRACK_H = 24;
const THUMB = 18;
const THUMB_OFF = 3;
const THUMB_ON = TRACK_W - THUMB - 3;

/**
 * Props for {@link Switch}.
 */
export interface SwitchProps
  extends Omit<SwitchPrimitive.SwitchProps, "asChild">,
    SketchProps {
  /** Visible label beside the control. */
  label?: ReactNode;
  /**
   * Slide the thumb and seed-morph the track on toggle.
   * Defaults to the DoodleUIProvider value (true).
   */
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Toggle switch with sliding thumb.
 *
 * @example
 * <Switch />
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch(
    {
      className,
      style,
      label,
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
      ...rest
    },
    ref,
  ) {
    const [uncontrolled, setUncontrolled] = useState(defaultChecked === true);
    const isOn = checked ?? uncontrolled;
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const baseRoughness = useBaseRoughness();
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const activeColor = sketchColor ?? theme.accent;
    const activeFill = theme.isDark
      ? (sketchColor ? `${sketchColor}25` : theme.accentFill)
      : theme.accentFill;
    const resolvedSeed = useResolvedSeed(seed);
    const shouldAnimate = useAnimate(animate);
    const trackRef = useRef<HTMLSpanElement>(null);
    const trackSeed = shouldAnimate
      ? deriveSeed(resolvedSeed, isOn ? "on" : "off")
      : resolvedSeed;

    useDrawIn(trackRef, DRAW_IN_DURATION_MS, shouldAnimate, trackSeed);

    return (
      <span
        className={cn(className)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          userSelect: "none",
          color: ink,
          ...style,
        }}
      >
        <SwitchPrimitive.Root
          ref={ref}
          id={inputId}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={(next) => {
            setUncontrolled(next);
            onCheckedChange?.(next);
          }}
          style={{
            position: "relative",
            width: TRACK_W,
            height: TRACK_H,
            padding: 0,
            border: "none",
            background: "transparent",
            flexShrink: 0,
            cursor: "pointer",
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
              strokeWidth={strokeWidth ?? 1.6}
              inset={1.5}
            />
          </span>
          <SwitchPrimitive.Thumb asChild>
            <motion.span
              initial={false}
              animate={{ x: isOn ? THUMB_ON : THUMB_OFF }}
              transition={
                shouldAnimate
                  ? { type: "spring", stiffness: 420, damping: 30 }
                  : { duration: 0 }
              }
              style={{
                position: "absolute",
                top: (TRACK_H - THUMB) / 2,
                left: 0,
                width: THUMB,
                height: THUMB,
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
              fontSize: 15,
              cursor: "pointer",
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
