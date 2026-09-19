"use client";

import { useBaseRoughness } from "../hooks/useSketchDefaults";
import {
  forwardRef,
  useRef,
  type CSSProperties,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
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
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

const CHEVRON_PATH = "M 4 6 L 10 12 L 16 6";

export interface NativeSelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export type NativeSelectSize = DoodleSize;

/**
 * Props for {@link NativeSelect}.
 */
export interface NativeSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "color" | "size">,
    SketchProps,
    ValidationProps {
  options?: NativeSelectOption[];
  fill?: string;
  /**
   * Control size preset.
   * @default "md"
   */
  size?: NativeSelectSize;
  /** Draw-in the border on mount. Defaults to DoodleUIProvider (true). */
  animate?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Native HTML select with sketch border.
 *
 * @example
 * <NativeSelect />
 */
export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect(
    {
      className,
      style,
      options,
      children,
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
    const fieldRef = useRef<HTMLSpanElement>(null);
    const shouldAnimate = useAnimate(animate);
    const resolvedSeed = useResolvedSeed(seed);
    const baseRoughness = useBaseRoughness();
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const interactive = resolveInteractiveState({ disabled });
    const validation = useFieldValidation(
      { invalid, error, errorMessage },
      { describedBy: ariaDescribedBy, errorColor: theme.error },
    );

    useDrawIn(fieldRef, DRAW_IN_DURATION_MS, shouldAnimate);

    return (
      <span
        className={cn(className)}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          color: ink,
          ...interactive.style,
          ...style,
        }}
      >
        <span ref={fieldRef} style={{ position: "relative", display: "block" }}>
          <RoughSvg
            shape="rectangle"
            roughness={roughness}
            seed={resolvedSeed}
            sketchColor={validation.strokeOverride ?? ink}
            bowing={bowing}
            fillStyle={fillStyle ?? "solid"}
            fill={fill ?? theme.paper}
            strokeWidth={strokeWidth}
            hachureGap={hachureGap}
            hachureAngle={hachureAngle}
            fillWeight={fillWeight}
          />
          <select
            ref={ref}
            disabled={interactive.isDisabled}
            aria-invalid={validation.ariaInvalid ?? ariaInvalidProp}
            aria-describedby={validation.describedBy}
            aria-disabled={interactive.aria["aria-disabled"]}
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              border: "none",
              background: "transparent",
              ...FIELD_SIZE_STYLES[size],
              paddingRight: 36,
              fontFamily: doodleUiFontFamily,
              fontWeight: doodleUiFontWeight(500),
              color: ink,
              cursor: interactive.isDisabled ? "not-allowed" : "pointer",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              outline: "none",
            }}
            {...rest}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <span
            aria-hidden
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 20,
              height: 14,
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <RoughSvg
              shape="path"
              path={CHEVRON_PATH}
              roughness={(roughness ?? baseRoughness) * 0.85}
              seed={resolvedSeed}
              sketchColor={validation.strokeOverride ?? ink}
              bowing={bowing}
              strokeWidth={strokeWidth ?? 1.5}
            />
          </span>
        </span>
        <ValidationMessage id={validation.errorId} style={validation.messageStyle}>
          {validation.errorMessage}
        </ValidationMessage>
      </span>
    );
  },
);
