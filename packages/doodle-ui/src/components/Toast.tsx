"use client";

import {
  createContext,
  useContext,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { AnimatePresence, motion } from "framer-motion";
import { useAnimate } from "../animations";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SIZE_TOKENS, resolveSize, type DoodleSize } from "../primitives/size";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

export type ToastVariant = "info" | "warning" | "error" | "success";
export type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const LIGHT_VARIANT_FILL: Record<ToastVariant, string> = {
  info: "#d2deec",
  warning: "#f8ebd0",
  error: "#f8d4d0",
  success: "#d3e8dc",
};

const DARK_VARIANT_FILL: Record<ToastVariant, string> = {
  info: "rgba(96, 165, 250, 0.16)",
  warning: "rgba(251, 191, 36, 0.16)",
  error: "rgba(248, 113, 113, 0.16)",
  success: "rgba(52, 211, 153, 0.16)",
};

const POSITION_STYLE: Record<ToastPosition, CSSProperties> = {
  "top-left": { top: 16, left: 16 },
  "top-right": { top: 16, right: 16 },
  "bottom-left": { bottom: 16, left: 16 },
  "bottom-right": { bottom: 16, right: 16 },
};

const ToastPositionContext = createContext<ToastPosition>("bottom-right");

/**
 * Props for {@link ToastProvider}.
 */
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

/**
 * Props for {@link Toast}.
 */
export interface ToastProps extends SketchProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  children?: ReactNode;
  /**
   * Visual style preset.
   * @default "primary"
   */
  variant?: ToastVariant;
  fill?: string;
  /**
   * Toast density preset.
   * @default "md"
   */
  size?: DoodleSize;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  /**
   * Slide-in with a sketchy settle wobble, reversed on exit.
   * Defaults to the DoodleUIProvider value (true).
   */
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Transient notification card.
 *
 * @example
 * <Toast />
 */
export function Toast({
  open,
  defaultOpen,
  onOpenChange,
  title,
  children,
  variant = "info",
  fill,
  size: sizeProp = "md",
  duration,
  className,
  style,
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
}: ToastProps) {
  const position = useContext(ToastPositionContext);
  const fromTop = position.startsWith("top");
  const [uncontrolled, setUncontrolled] = useState(defaultOpen ?? false);
  const isOpen = open ?? uncontrolled;
  const shouldAnimate = useAnimate(animate);
  const size = resolveSize(sizeProp);
  const tokens = SIZE_TOKENS[size];
  const theme = useSketchTheme(sketchColor);
  const color = sketchColor ?? theme[variant];
  const defaultFill = theme.isDark ? DARK_VARIANT_FILL[variant] : LIGHT_VARIANT_FILL[variant];
  const resolvedFill = fill ?? defaultFill;
  const offset = fromTop ? -14 : 14;

  function handleOpenChange(next: boolean) {
    setUncontrolled(next);
    onOpenChange?.(next);
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <ToastPrimitive.Root
          open={isOpen}
          onOpenChange={handleOpenChange}
          duration={duration}
          forceMount
          asChild
        >
          <motion.li
            className={cn(className)}
            initial={
              shouldAnimate
                ? { y: offset, opacity: 0, rotate: -1.4 }
                : false
            }
            animate={
              shouldAnimate
                ? { y: 0, opacity: 1, rotate: [-1.2, 0.9, -0.35, 0] }
                : { y: 0, opacity: 1, rotate: 0 }
            }
            exit={
              shouldAnimate
                ? { y: offset, opacity: 0, rotate: 1.2 }
                : { opacity: 0 }
            }
            transition={
              shouldAnimate
                ? { duration: 0.38, ease: "easeOut" }
                : { duration: 0 }
            }
            style={{
              listStyle: "none",
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
              fill={resolvedFill}
              strokeWidth={strokeWidth}
              hachureGap={hachureGap ?? 9}
              hachureAngle={hachureAngle}
              fillWeight={fillWeight ?? 0.85}
              shadow
              animate={animate}
              contentStyle={{
                padding: `${tokens.paddingY + 4}px ${tokens.paddingX}px`,
                color: theme.ink,
              }}
            >
              {title ? (
                <ToastPrimitive.Title
                  style={{
                    margin: 0,
                    fontWeight: doodleUiFontWeight(700),
                    fontSize: tokens.fontSize,
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
                    fontSize: Math.max(13, tokens.fontSize - 1),
                    lineHeight: 1.5,
                    fontFamily: doodleUiFontFamily,
                    color: theme.ink,
                  }}
                >
                  {children}
                </ToastPrimitive.Description>
              ) : null}
            </SketchBox>
          </motion.li>
        </ToastPrimitive.Root>
      ) : null}
    </AnimatePresence>
  );
}

export const ToastRoot = ToastPrimitive.Root;
export const ToastTitle = ToastPrimitive.Title;
export const ToastDescription = ToastPrimitive.Description;
export const ToastClose = ToastPrimitive.Close;
export const ToastAction = ToastPrimitive.Action;
export const ToastViewport = ToastPrimitive.Viewport;
