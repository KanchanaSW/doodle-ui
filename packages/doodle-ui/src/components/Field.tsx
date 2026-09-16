"use client";

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useId,
  useMemo,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { Label } from "./Label";
import { SKETCH_COLORS } from "../types";
import { cn, doodleUiFontFamily } from "../utils";

interface FieldContextValue {
  id: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  error?: ReactNode;
}

const FieldContext = createContext<FieldContextValue | null>(null);

function useField(): FieldContextValue {
  const ctx = useContext(FieldContext);
  if (!ctx) {
    throw new Error("Field parts must be used inside <Field>.");
  }
  return ctx;
}

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  invalid?: boolean;
  error?: ReactNode;
}

export function Field({
  className,
  style,
  children,
  invalid = false,
  error,
  ...rest
}: FieldProps) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const value = useMemo(
    () => ({
      id,
      descriptionId,
      errorId,
      invalid: invalid || Boolean(error),
      error,
    }),
    [id, descriptionId, errorId, invalid, error],
  );

  return (
    <FieldContext.Provider value={value}>
      <div
        className={cn(className)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          width: "100%",
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    </FieldContext.Provider>
  );
}

export interface FieldLabelProps
  extends Omit<React.ComponentProps<typeof Label>, "htmlFor"> {}

export function FieldLabel({ className, style, ...rest }: FieldLabelProps) {
  const { id } = useField();
  return <Label htmlFor={id} className={className} style={style} {...rest} />;
}

export function FieldDescription({
  className,
  style,
  children,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  const { descriptionId } = useField();
  return (
    <p
      id={descriptionId}
      className={cn(className)}
      style={{
        margin: 0,
        fontFamily: doodleUiFontFamily,
        fontSize: 12,
        lineHeight: 1.45,
        color: SKETCH_COLORS.ink,
        opacity: 0.75,
        ...style,
      }}
      {...rest}
    >
      {children}
    </p>
  );
}

export function FieldError({
  className,
  style,
  children,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  const { error, errorId } = useField();
  const message = children ?? error;
  if (!message) return null;

  return (
    <p
      id={errorId}
      role="alert"
      className={cn(className)}
      style={{
        margin: 0,
        fontFamily: doodleUiFontFamily,
        fontSize: 12,
        lineHeight: 1.45,
        color: SKETCH_COLORS.error,
        ...style,
      }}
      {...rest}
    >
      {message}
    </p>
  );
}

export interface FieldControlProps {
  children: ReactElement;
}

export function FieldControl({ children }: FieldControlProps) {
  const { id, descriptionId, errorId, invalid } = useField();
  const child = Children.only(children);
  if (!isValidElement(child)) {
    throw new Error("FieldControl expects a single React element child.");
  }

  const describedBy = [descriptionId, invalid ? errorId : null]
    .filter(Boolean)
    .join(" ");

  const props = child.props as {
    id?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
  };
  return cloneElement(child as ReactElement<Record<string, unknown>>, {
    id: props.id ?? id,
    "aria-describedby":
      props["aria-describedby"] ??
      (describedBy.length > 0 ? describedBy : undefined),
    "aria-invalid": invalid ? true : props["aria-invalid"],
  });
}
