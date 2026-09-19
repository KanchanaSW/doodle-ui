"use client";

import { useBaseRoughness } from "../hooks/useSketchDefaults";
import { forwardRef, useId, useRef, type ReactNode } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import {
  DRAW_IN_DURATION_MS,
  DRAW_IN_MARK_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import { resolveInteractiveState } from "../primitives/interactive";
import { SIZE_TOKENS, resolveSize, type DoodleSize } from "../primitives/size";
import {
  useFieldValidation,
  ValidationMessage,
  type ValidationProps,
} from "../primitives/validation";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily } from "../utils";

export type CheckboxSize = DoodleSize;

/**
 * Props for {@link Checkbox}.
 */
export interface CheckboxProps
  extends Omit<CheckboxPrimitive.CheckboxProps, "asChild">,
    SketchProps,
    ValidationProps {
  /** Visible label beside the control. */
  label?: ReactNode;
  fill?: string;
  /**
   * Control size preset.
   * @default "md"
   */
  size?: CheckboxSize;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

const CHECK_PATH = "M 4.5 10.5 L 8.5 14.5 L 15.5 5.5";

function CheckMark({
  roughness,
  seed,
  sketchColor,
  bowing,
  strokeWidth,
  shouldAnimate,
}: {
  roughness?: number;
  seed?: number;
  sketchColor?: string;
  bowing?: number;
  strokeWidth?: number;
  shouldAnimate: boolean;
}) {
  const baseRoughness = useBaseRoughness();
  const ref = useRef<HTMLSpanElement>(null);
  useDrawIn(ref, DRAW_IN_MARK_MS, shouldAnimate);

  return (
    <span
      ref={ref}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <RoughSvg
        shape="path"
        path={CHECK_PATH}
        roughness={(roughness ?? baseRoughness) * 0.7}
        seed={seed}
        sketchColor={sketchColor}
        bowing={bowing}
        strokeWidth={(strokeWidth ?? 1.6) + 0.4}
        inset={0}
      />
    </span>
  );
}

/**
 * Square checkbox with a drawn checkmark.
 *
 * Supports controlled (`checked` + `onCheckedChange`) and uncontrolled
 * (`defaultChecked`) modes. Pass `name` for native FormData / RHF Controller.
 *
 * @example
 * <Checkbox label="Accept" name="terms" required />
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox(
    {
      className,
      style,
      label,
      fill,
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
      checked,
      defaultChecked,
      onCheckedChange,
      id,
      animate,
      disabled,
      invalid,
      error,
      errorMessage,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalidProp,
      ...rest
    },
    ref,
  ) {
    const size = resolveSize(sizeProp);
    const box = SIZE_TOKENS[size].controlBox;
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const accent = sketchColor ?? theme.accent;
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const boxRef = useRef<HTMLSpanElement>(null);
    const shouldAnimate = useAnimate(animate);
    const interactive = resolveInteractiveState({ disabled });
    const validation = useFieldValidation(
      { invalid, error, errorMessage },
      { describedBy: ariaDescribedBy, errorColor: theme.error },
    );
    useDrawIn(boxRef, DRAW_IN_DURATION_MS, shouldAnimate);

    const strokeColor = validation.strokeOverride ?? ink;

    return (
      <span
        className={cn(className)}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          gap: 4,
          ...interactive.style,
          ...style,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: SIZE_TOKENS[size].gap,
            cursor: interactive.isDisabled ? "not-allowed" : "pointer",
            userSelect: "none",
            color: ink,
          }}
        >
          <CheckboxPrimitive.Root
            ref={ref}
            id={inputId}
            checked={checked}
            defaultChecked={defaultChecked}
            onCheckedChange={onCheckedChange}
            disabled={interactive.isDisabled}
            aria-invalid={validation.ariaInvalid ?? ariaInvalidProp}
            aria-describedby={validation.describedBy}
            aria-disabled={interactive.aria["aria-disabled"]}
            style={{
              position: "relative",
              width: box,
              height: box,
              padding: 0,
              border: "none",
              background: "transparent",
              flexShrink: 0,
              cursor: interactive.isDisabled ? "not-allowed" : "pointer",
            }}
            {...rest}
          >
            <span
              ref={boxRef}
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            >
              <RoughSvg
                shape="rectangle"
                roughness={roughness}
                seed={seed}
                sketchColor={strokeColor}
                bowing={bowing}
                fillStyle={fillStyle ?? (fill ? "solid" : undefined)}
                fill={fill}
                strokeWidth={strokeWidth ?? SIZE_TOKENS[size].strokeWidth}
                hachureGap={hachureGap}
                hachureAngle={hachureAngle}
                fillWeight={fillWeight}
                inset={1.5}
              />
            </span>
            <CheckboxPrimitive.Indicator
              style={{
                position: "absolute",
                inset: 0,
                display: "block",
              }}
            >
              <CheckMark
                roughness={roughness}
                seed={seed}
                sketchColor={accent}
                bowing={bowing}
                strokeWidth={strokeWidth}
                shouldAnimate={shouldAnimate}
              />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
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
        <ValidationMessage id={validation.errorId} style={validation.messageStyle}>
          {validation.errorMessage}
        </ValidationMessage>
      </span>
    );
  },
);
