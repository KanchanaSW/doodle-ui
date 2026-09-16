"use client";

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
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

const CHEVRON_PATH = "M 4 6 L 10 12 L 16 6";

export interface NativeSelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface NativeSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "color" | "size">,
    SketchProps {
  options?: NativeSelectOption[];
  /** Draw-in the border on mount. Defaults to DoodleUIProvider (true). */
  animate?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect(
    {
      className,
      style,
      options,
      children,
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      animate,
      disabled,
      ...rest
    },
    ref,
  ) {
    const fieldRef = useRef<HTMLSpanElement>(null);
    const shouldAnimate = useAnimate(animate);
    const resolvedSeed = useResolvedSeed(seed);
    const ink = sketchColor ?? SKETCH_COLORS.ink;

    useDrawIn(fieldRef, DRAW_IN_DURATION_MS, shouldAnimate);

    return (
      <span
        className={cn(className)}
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          opacity: disabled ? 0.6 : 1,
          ...style,
        }}
      >
        <span ref={fieldRef} style={{ position: "relative", display: "block" }}>
          <RoughSvg
            shape="rectangle"
            roughness={roughness}
            seed={resolvedSeed}
            sketchColor={ink}
            bowing={bowing}
            fillStyle={fillStyle}
            fill={SKETCH_COLORS.paper}
            strokeWidth={strokeWidth}
          />
          <select
            ref={ref}
            disabled={disabled}
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              border: "none",
              background: "transparent",
              padding: "10px 36px 10px 12px",
              fontFamily: doodleUiFontFamily,
              fontSize: 14,
              fontWeight: doodleUiFontWeight(500),
              color: ink,
              cursor: disabled ? "not-allowed" : "pointer",
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
              roughness={(roughness ?? 1.5) * 0.85}
              seed={resolvedSeed}
              sketchColor={ink}
              bowing={bowing}
              strokeWidth={strokeWidth ?? 1.5}
            />
          </span>
        </span>
      </span>
    );
  },
);
