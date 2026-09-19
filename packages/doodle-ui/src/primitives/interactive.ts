import type { AriaAttributes, CSSProperties } from "react";

export interface InteractiveStateProps {
  disabled?: boolean;
  loading?: boolean;
}

export interface InteractiveStateResult {
  /** True when the control should reject pointer / keyboard interaction. */
  isDisabled: boolean;
  /** True when loading (implies disabled). */
  isLoading: boolean;
  style: CSSProperties;
  aria: Pick<AriaAttributes, "aria-disabled" | "aria-busy">;
}

/**
 * Shared disabled / loading visual treatment.
 * Apply once across interactive components instead of inventing per-component looks.
 */
export function resolveInteractiveState(
  props: InteractiveStateProps,
): InteractiveStateResult {
  const isLoading = Boolean(props.loading);
  const isDisabled = Boolean(props.disabled) || isLoading;

  return {
    isDisabled,
    isLoading,
    style: {
      opacity: isDisabled ? 0.5 : undefined,
      cursor: isDisabled ? "not-allowed" : undefined,
      pointerEvents: isDisabled ? "none" : undefined,
    },
    aria: {
      "aria-disabled": isDisabled ? true : undefined,
      "aria-busy": isLoading ? true : undefined,
    },
  };
}

/** Opacity applied to sketch roughness when disabled (slightly flatter). */
export const DISABLED_ROUGHNESS_FACTOR = 0.7;
