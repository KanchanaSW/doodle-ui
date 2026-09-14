"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { SketchBox } from "../primitives/SketchBox";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

export type ToastVariant = "info" | "warning" | "error" | "success";
export type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const VARIANT_COLOR: Record<ToastVariant, string> = {
  info: SKETCH_COLORS.info,
  warning: SKETCH_COLORS.warning,
  error: SKETCH_COLORS.error,
  success: SKETCH_COLORS.success,
};

const VARIANT_FILL: Record<ToastVariant, string> = {
  info: "#d2deec",
  warning: "#f3e2c0",
  error: "#f3d0cc",
  success: "#d3e8dc",
};

const POSITION_STYLE: Record<ToastPosition, CSSProperties> = {
  "top-left": { top: 16, left: 16 },
  "top-right": { top: 16, right: 16 },
  "bottom-left": { bottom: 16, left: 16 },
  "bottom-right": { bottom: 16, right: 16 },
};

const ToastPositionContext = createContext<ToastPosition>("bottom-right");

export interface ToastProviderProps {
  children?: ReactNode;
  position?: ToastPosition;
  duration?: number;
  swipeDirection?: ToastPrimitive.ToastProviderProps["swipeDirection"];
  label?: string;
}

export function ToastProvider({
  children,
  position = "bottom-right",
  duration = 4000,
  swipeDirection = "right",
  label,
}: ToastProviderProps) {
  return (
    <ToastPositionContext.Provider value={position}>
      <ToastPrimitive.Provider
        duration={duration}
        swipeDirection={swipeDirection}
        label={label}
      >
        {children}
        <ToastPrimitive.Viewport
          style={{
            position: "fixed",
            zIndex: 90,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: "min(360px, calc(100vw - 32px))",
            margin: 0,
            padding: 0,
            listStyle: "none",
            outline: "none",
            ...POSITION_STYLE[position],
          }}
        />
      </ToastPrimitive.Provider>
    </ToastPositionContext.Provider>
  );
}

export interface ToastProps extends SketchProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  children?: ReactNode;
  variant?: ToastVariant;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

export function Toast({
  open,
  defaultOpen,
  onOpenChange,
  title,
  children,
  variant = "info",
  duration,
  className,
  style,
  roughness,
  seed,
  sketchColor,
  bowing,
  fillStyle,
  strokeWidth,
}: ToastProps) {
  const position = useContext(ToastPositionContext);
  const fromTop = position.startsWith("top");
  const [entered, setEntered] = useState(false);
  const color = sketchColor ?? VARIANT_COLOR[variant];
  const visible = open ?? true;

  useLayoutEffect(() => {
    if (!visible) {
      setEntered(false);
      return;
    }
    setEntered(false);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  return (
    <ToastPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      duration={duration}
      className={cn(className)}
      style={{
        transform: entered
          ? "translateY(0)"
          : `translateY(${fromTop ? "-10px" : "10px"})`,
        opacity: entered ? 1 : 0,
        transition: "transform 200ms ease, opacity 200ms ease",
        outline: "none",
        ...style,
      }}
    >
      <SketchBox
        roughness={roughness}
        seed={seed}
        sketchColor={color}
        bowing={bowing}
        fillStyle={fillStyle ?? "hachure"}
        fill={VARIANT_FILL[variant]}
        strokeWidth={strokeWidth ?? 1.7}
        shadow
        contentStyle={{ padding: "12px 16px" }}
      >
        {title ? (
          <ToastPrimitive.Title
            style={{
              margin: 0,
              fontWeight: doodleUiFontWeight(700),
              fontSize: 15,
              fontFamily: doodleUiFontFamily,
              color,
              marginBottom: children ? 4 : 0,
            }}
          >
            {title}
          </ToastPrimitive.Title>
        ) : null}
        {children ? (
          <ToastPrimitive.Description
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.5,
              fontFamily: doodleUiFontFamily,
              color: SKETCH_COLORS.ink,
            }}
          >
            {children}
          </ToastPrimitive.Description>
        ) : null}
      </SketchBox>
    </ToastPrimitive.Root>
  );
}

export const ToastRoot = ToastPrimitive.Root;
export const ToastTitle = ToastPrimitive.Title;
export const ToastDescription = ToastPrimitive.Description;
export const ToastClose = ToastPrimitive.Close;
export const ToastAction = ToastPrimitive.Action;
export const ToastViewport = ToastPrimitive.Viewport;
