"use client";

import {
  forwardRef,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import {
  DRAW_IN_DURATION_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import { DoodleIcon } from "../primitives/icon";
import { resolveInteractiveState } from "../primitives/interactive";
import {
  FIELD_SIZE_STYLES,
  resolveSize,
  type DoodleSize,
} from "../primitives/size";
import {
  useFieldValidation,
  ValidationMessage,
  type ValidationProps,
} from "../primitives/validation";
import type { SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

export type InputSize = DoodleSize;

/**
 * Props for {@link Input}.
 */
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size">,
    SketchProps,
    ValidationProps {
  /** Visible label above the control. */
  label?: ReactNode;
  /**
   * Control size preset.
   * @default "md"
   */
  size?: InputSize;
  /** Leading icon inside the field. */
  startIcon?: ReactNode;
  /** Trailing icon inside the field. */
  endIcon?: ReactNode;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Single-line text field with a hand-drawn border.
 *
 * @example
 * <Input label="Email" name="email" required />
 * <Input invalid errorMessage="Required" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    style,
    label,
    size: sizeProp = "md",
    startIcon,
    endIcon,
    roughness,
    seed,
    sketchColor,
    bowing,
    fillStyle,
    strokeWidth,
    hachureGap,
    hachureAngle,
    fillWeight,
    id,
    onFocus,
    onBlur,
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
  const [focused, setFocused] = useState(false);
  const fieldRef = useRef<HTMLSpanElement>(null);
  const theme = useSketchTheme(sketchColor);
  const shouldAnimate = useAnimate(animate);
  const resolvedSeed = useResolvedSeed(seed);
  const focusSeed = deriveSeed(resolvedSeed, "focus");
  const sketchSeed = shouldAnimate && focused ? focusSeed : resolvedSeed;
  const ink = sketchColor ?? theme.ink;
  const inputId = id;
  const interactive = resolveInteractiveState({ disabled });
  const validation = useFieldValidation(
    { invalid, error, errorMessage },
    { describedBy: ariaDescribedBy, errorColor: theme.error },
  );

  useDrawIn(fieldRef, DRAW_IN_DURATION_MS, shouldAnimate, sketchSeed);

  const strokeColor = validation.strokeOverride
    ?? (focused ? (sketchColor ?? theme.accent) : ink);

  const padX = size === "sm" ? 10 : size === "lg" ? 14 : 12;
  const iconPad = startIcon || endIcon ? SIZE_ICON_PAD[size] : 0;

  return (
    <label
      htmlFor={inputId}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "100%",
        ...interactive.style,
      }}
    >
      {label ? (
        <span
          style={{
            fontSize: 13,
            fontWeight: doodleUiFontWeight(600),
            fontFamily: doodleUiFontFamily,
            color: ink,
          }}
        >
          {label}
        </span>
      ) : null}
      <span ref={fieldRef} style={{ position: "relative", display: "block" }}>
        <RoughSvg
          shape="rectangle"
          roughness={roughness}
          seed={sketchSeed}
          sketchColor={strokeColor}
          bowing={bowing}
          fillStyle={fillStyle}
          hachureGap={hachureGap}
          hachureAngle={hachureAngle}
          fillWeight={fillWeight}
          strokeWidth={
            focused && !shouldAnimate
              ? (strokeWidth ?? 1.75) + 0.35
              : focused
                ? (strokeWidth ?? 1.75) + 0.2
                : strokeWidth
          }
        />
        {startIcon ? (
          <span
            style={{
              position: "absolute",
              left: padX,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              display: "inline-flex",
              pointerEvents: "none",
              color: ink,
            }}
          >
            <DoodleIcon size={size}>{startIcon}</DoodleIcon>
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(className)}
          disabled={interactive.isDisabled}
          aria-invalid={validation.ariaInvalid ?? ariaInvalidProp}
          aria-describedby={validation.describedBy}
          aria-disabled={interactive.aria["aria-disabled"]}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            boxSizing: "border-box",
            border: "none",
            outline: "none",
            background: "transparent",
            color: ink,
            fontFamily: doodleUiFontFamily,
            ...FIELD_SIZE_STYLES[size],
            paddingLeft: padX + (startIcon ? iconPad : 0),
            paddingRight: padX + (endIcon ? iconPad : 0),
            ...style,
          }}
          {...rest}
        />
        {endIcon ? (
          <span
            style={{
              position: "absolute",
              right: padX,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              display: "inline-flex",
              pointerEvents: "none",
              color: ink,
            }}
          >
            <DoodleIcon size={size}>{endIcon}</DoodleIcon>
          </span>
        ) : null}
      </span>
      <ValidationMessage id={validation.errorId} style={validation.messageStyle}>
        {validation.errorMessage}
      </ValidationMessage>
    </label>
  );
});

const SIZE_ICON_PAD: Record<"sm" | "md" | "lg", number> = {
  sm: 20,
  md: 24,
  lg: 28,
};
