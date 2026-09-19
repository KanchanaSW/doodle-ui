"use client";

import {
  useId,
  type CSSProperties,
  type ReactNode,
} from "react";
import { doodleUiFontFamily } from "../utils";

export interface ValidationProps {
  /**
   * Marks the control as invalid. Prefer this name; `error` is also accepted
   * for convenience (boolean or message string).
   */
  invalid?: boolean;
  /**
   * Convenience alias: `true` marks invalid; a string also sets `errorMessage`.
   */
  error?: boolean | string;
  /** Validation feedback rendered below the control. */
  errorMessage?: ReactNode;
}

export interface ValidationResult {
  invalid: boolean;
  errorMessage: ReactNode | undefined;
  errorId: string;
  describedBy: string | undefined;
  ariaInvalid: boolean | undefined;
  strokeOverride: string | undefined;
  messageStyle: CSSProperties;
}

/**
 * Shared error / validation plumbing for form controls.
 * When invalid, stroke should use theme.error / --doodle-ui-color-error.
 */
export function useFieldValidation(
  props: ValidationProps,
  opts?: {
    /** Existing aria-describedby from the consumer. */
    describedBy?: string;
    /** Theme error color (from useSketchTheme().error). */
    errorColor?: string;
  },
): ValidationResult {
  const generatedId = useId();
  const errorId = `${generatedId}-error`;

  const messageFromError =
    typeof props.error === "string" ? props.error : undefined;
  const errorMessage = props.errorMessage ?? messageFromError;
  const invalid =
    Boolean(props.invalid) ||
    props.error === true ||
    Boolean(errorMessage);

  const parts = [opts?.describedBy, invalid && errorMessage ? errorId : null]
    .filter(Boolean)
    .join(" ");

  return {
    invalid,
    errorMessage: invalid ? errorMessage : undefined,
    errorId,
    describedBy: parts.length > 0 ? parts : undefined,
    ariaInvalid: invalid ? true : undefined,
    strokeOverride: invalid ? opts?.errorColor : undefined,
    messageStyle: {
      margin: 0,
      marginTop: 6,
      fontFamily: doodleUiFontFamily,
      fontSize: 12,
      lineHeight: 1.45,
      color: opts?.errorColor,
    },
  };
}

/** Renders the shared error message paragraph when present. */
export function ValidationMessage({
  id,
  children,
  style,
}: {
  id: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  if (!children) return null;
  return (
    <p id={id} role="alert" style={style}>
      {children}
    </p>
  );
}
