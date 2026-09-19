"use client";

import { useBaseRoughness } from "../hooks/useSketchDefaults";
import {
  forwardRef,
  useId,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import {
  DRAW_IN_DURATION_MS,
  DRAW_IN_MARK_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
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

export type RadioSize = DoodleSize;

/**
 * Props for {@link RadioGroup}.
 */
export interface RadioGroupProps
  extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    ValidationProps {}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(
    {
      className,
      style,
      children,
      invalid,
      error,
      errorMessage,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalidProp,
      disabled,
      ...rest
    },
    ref,
  ) {
    const theme = useSketchTheme();
    const interactive = resolveInteractiveState({ disabled });
    const validation = useFieldValidation(
      { invalid, error, errorMessage },
      { describedBy: ariaDescribedBy, errorColor: theme.error },
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <RadioGroupPrimitive.Root
          ref={ref}
          className={cn(className)}
          disabled={interactive.isDisabled}
          aria-invalid={validation.ariaInvalid ?? ariaInvalidProp}
          aria-describedby={validation.describedBy}
          aria-disabled={interactive.aria["aria-disabled"]}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            ...interactive.style,
            ...style,
          }}
          {...rest}
        >
          {children}
        </RadioGroupPrimitive.Root>
        <ValidationMessage id={validation.errorId} style={validation.messageStyle}>
          {validation.errorMessage}
        </ValidationMessage>
      </div>
    );
  },
);

/**
 * Props for {@link Radio}.
 */
export interface RadioProps
  extends Omit<
      ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
      "asChild"
    >,
    SketchProps {
  /** Visible label beside the control. */
  label?: ReactNode;
  fill?: string;
  /**
   * Control size preset.
   * @default "md"
   */
  size?: RadioSize;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

function RadioDot({
  roughness,
  seed,
  sketchColor,
  bowing,
  shouldAnimate,
  inset,
}: {
  roughness?: number;
  seed?: number;
  sketchColor?: string;
  bowing?: number;
  shouldAnimate: boolean;
  inset: number;
}) {
  const baseRoughness = useBaseRoughness();
  const ref = useRef<HTMLSpanElement>(null);
  useDrawIn(ref, DRAW_IN_MARK_MS, shouldAnimate);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node || !shouldAnimate) return;
    const animation = node.animate(
      [
        { transform: "scale(0.35)", opacity: 0 },
        { transform: "scale(1)", opacity: 1 },
      ],
      { duration: 180, easing: "ease-out", fill: "forwards" },
    );
    return () => animation.cancel();
  }, [shouldAnimate]);

  return (
    <span
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        display: "block",
      }}
    >
      <RoughSvg
        shape="ellipse"
        roughness={(roughness ?? baseRoughness) + 0.2}
        seed={seed}
        sketchColor={sketchColor}
        fill={sketchColor}
        fillStyle="solid"
        bowing={bowing}
        strokeWidth={1}
        inset={inset}
      />
    </span>
  );
}

/**
 * Circular radio option with a filled dot when selected.
 *
 * @example
 * <RadioGroup name="plan" defaultValue="pro">
 *   <Radio value="pro" label="Pro" />
 * </RadioGroup>
 */
export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio(
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
    id,
    animate,
    disabled,
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
  const ringRef = useRef<HTMLSpanElement>(null);
  const shouldAnimate = useAnimate(animate);
  const interactive = resolveInteractiveState({ disabled });
  useDrawIn(ringRef, DRAW_IN_DURATION_MS, shouldAnimate);

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
      <RadioGroupPrimitive.Item
        ref={ref}
        id={inputId}
        disabled={interactive.isDisabled}
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
          borderRadius: "50%",
        }}
        {...rest}
      >
        <span
          ref={ringRef}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <RoughSvg
            shape="ellipse"
            roughness={roughness}
            seed={seed}
            sketchColor={ink}
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
        <RadioGroupPrimitive.Indicator
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
          }}
        >
          <RadioDot
            roughness={roughness}
            seed={seed}
            sketchColor={accent}
            bowing={bowing}
            shouldAnimate={shouldAnimate}
            inset={Math.round(box * 0.3)}
          />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
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
});
