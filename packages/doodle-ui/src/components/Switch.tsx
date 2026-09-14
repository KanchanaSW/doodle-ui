"use client";

import { forwardRef, useState, type ReactNode } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontFamily } from "../utils";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { deriveSeed } from "../utils";

const TRACK_W = 44;
const TRACK_H = 24;
const THUMB = 18;
const THUMB_OFF = 3;
const THUMB_ON = TRACK_W - THUMB - 3;

export interface SwitchProps
  extends Omit<SwitchPrimitive.SwitchProps, "asChild">,
    SketchProps {
  label?: ReactNode;
}

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
      ...rest
    },
    ref,
  ) {
    const [uncontrolled, setUncontrolled] = useState(defaultChecked === true);
    const isOn = checked ?? uncontrolled;
    const ink = sketchColor ?? SKETCH_COLORS.ink;
    const resolvedSeed = useResolvedSeed(seed);

    return (
      <span
        className={cn(className)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          userSelect: "none",
          ...style,
        }}
      >
        <SwitchPrimitive.Root
          ref={ref}
          id={id}
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
          <RoughSvg
            shape="rectangle"
            roughness={roughness}
            seed={resolvedSeed}
            sketchColor={isOn ? SKETCH_COLORS.accent : ink}
            bowing={bowing ?? 1.4}
            fillStyle={fillStyle ?? (isOn ? "hachure" : undefined)}
            fill={isOn ? SKETCH_COLORS.accentFill : undefined}
            strokeWidth={strokeWidth ?? 1.6}
            inset={1.5}
          />
          <SwitchPrimitive.Thumb
            style={{
              position: "absolute",
              top: (TRACK_H - THUMB) / 2,
              left: 0,
              width: THUMB,
              height: THUMB,
              display: "block",
              transform: `translateX(${isOn ? THUMB_ON : THUMB_OFF}px)`,
              transition: "transform 160ms ease",
              zIndex: 1,
            }}
          >
            <RoughSvg
              shape="ellipse"
              roughness={(roughness ?? 1.5) * 0.85}
              seed={deriveSeed(resolvedSeed, "thumb")}
              sketchColor={isOn ? SKETCH_COLORS.accent : ink}
              fill="#f7f6f2"
              fillStyle="solid"
              bowing={bowing}
              strokeWidth={(strokeWidth ?? 1.5) + 0.2}
              inset={1}
            />
          </SwitchPrimitive.Thumb>
        </SwitchPrimitive.Root>
        {label ? (
          <label
            htmlFor={id}
            style={{
              fontSize: 15,
              cursor: "pointer",
              fontFamily: doodleUiFontFamily,
            }}
          >
            {label}
          </label>
        ) : null}
      </span>
    );
  },
);
