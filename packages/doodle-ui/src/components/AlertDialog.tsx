"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useAnimate } from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";
import { Button } from "./Button";

interface AlertDialogSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  paper: string;
  isDark: boolean;
  animate?: boolean;
  open: boolean;
}

const AlertDialogSketchContext =
  createContext<AlertDialogSketchContextValue | null>(null);

function useAlertDialogSketch(): AlertDialogSketchContextValue {
  const ctx = useContext(AlertDialogSketchContext);
  if (!ctx) {
    throw new Error(
      "AlertDialog parts must be used inside <AlertDialog>.",
    );
  }
  return ctx;
}

export interface AlertDialogProps
  extends Omit<AlertDialogPrimitive.AlertDialogProps, "children">,
    SketchProps {
  children?: ReactNode;
  fill?: string;
  /**
   * Backdrop fade, panel enter/exit, and border draw-in on open.
   * Defaults to the DoodleUIProvider value (true).
   */
  animate?: boolean;
}

/**
 * Confirm / destructive-action variant of `Dialog`. Same composable shape,
 * but Radix's alert dialog primitive requires an explicit action — there is
 * no dismiss-on-outside-click or Escape by default, and `AlertDialogAction`
 * / `AlertDialogCancel` give the confirm button visual emphasis.
 */
export function AlertDialog({
  children,
  open,
  defaultOpen,
  onOpenChange,
  fill,
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
  ...rest
}: AlertDialogProps) {
  const resolvedSeed = useResolvedSeed(seed);
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;
  const [uncontrolled, setUncontrolled] = useState(defaultOpen === true);
  const isOpen = open ?? uncontrolled;

  return (
    <AlertDialogSketchContext.Provider
      value={{
        roughness,
        seed: resolvedSeed,
        sketchColor,
        bowing,
        fillStyle,
        strokeWidth,
        hachureGap,
        hachureAngle,
        fillWeight,
        resolvedSeed,
        ink,
        paper: fill ?? theme.paper,
        isDark: theme.isDark,
        animate,
        open: isOpen,
      }}
    >
      <AlertDialogPrimitive.Root
        open={isOpen}
        onOpenChange={(next) => {
          setUncontrolled(next);
          onOpenChange?.(next);
        }}
        {...rest}
      >
        {children}
      </AlertDialogPrimitive.Root>
    </AlertDialogSketchContext.Provider>
  );
}

export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;

export interface AlertDialogOverlayProps
  extends Omit<
    AlertDialogPrimitive.AlertDialogOverlayProps,
    "asChild" | "forceMount"
  > {}

export const AlertDialogOverlay = forwardRef<
  HTMLDivElement,
  AlertDialogOverlayProps
>(function AlertDialogOverlay({ style, ...rest }, ref) {
  const sketch = useAlertDialogSketch();
  const shouldAnimate = useAnimate(sketch.animate);

  return (
    <AlertDialogPrimitive.Overlay ref={ref} asChild forceMount {...rest}>
      <motion.div
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        exit={shouldAnimate ? { opacity: 0 } : undefined}
        transition={
          shouldAnimate ? { duration: 0.2, ease: "easeOut" } : { duration: 0 }
        }
        style={{
          position: "fixed",
          inset: 0,
          background: sketch.isDark ? "rgba(0, 0, 0, 0.65)" : "rgba(31, 29, 26, 0.38)",
          zIndex: 70,
          ...style,
        }}
      />
    </AlertDialogPrimitive.Overlay>
  );
});

export interface AlertDialogContentProps
  extends Omit<
    AlertDialogPrimitive.AlertDialogContentProps,
    "asChild" | "forceMount"
  > {
  children?: ReactNode;
  fill?: string;
  contentStyle?: CSSProperties;
}

export const AlertDialogContent = forwardRef<
  HTMLDivElement,
  AlertDialogContentProps
>(function AlertDialogContent(
  { className, style, contentStyle, fill, children, ...rest },
  ref,
) {
  const sketch = useAlertDialogSketch();
  const shouldAnimate = useAnimate(sketch.animate);

  return (
    <AnimatePresence>
      {sketch.open ? (
        <AlertDialogPrimitive.Portal forceMount>
          <AlertDialogOverlay />
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              padding: 16,
            }}
          >
            <AlertDialogPrimitive.Content ref={ref} asChild forceMount {...rest}>
              <motion.div
                className={cn(className)}
                initial={
                  shouldAnimate ? { opacity: 0, scale: 0.96, y: 10 } : false
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                  shouldAnimate ? { opacity: 0, scale: 0.96, y: 8 } : undefined
                }
                transition={
                  shouldAnimate
                    ? { duration: 0.22, ease: "easeOut" }
                    : { duration: 0 }
                }
                style={{
                  width: "min(420px, calc(100vw - 32px))",
                  outline: "none",
                  pointerEvents: "auto",
                  color: sketch.ink,
                  ...style,
                }}
              >
                <SketchBox
                  roughness={sketch.roughness}
                  seed={sketch.resolvedSeed}
                  sketchColor={sketch.ink}
                  bowing={sketch.bowing}
                  fillStyle={sketch.fillStyle ?? "solid"}
                  fill={fill ?? sketch.paper}
                  strokeWidth={sketch.strokeWidth ?? 2}
                  hachureGap={sketch.hachureGap}
                  hachureAngle={sketch.hachureAngle}
                  fillWeight={sketch.fillWeight}
                  animate={sketch.animate}
                  contentStyle={{ padding: 20, color: sketch.ink, ...contentStyle }}
                >
                  {children}
                </SketchBox>
              </motion.div>
            </AlertDialogPrimitive.Content>
          </div>
        </AlertDialogPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  );
});

export interface AlertDialogHeaderProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function AlertDialogHeader({
  children,
  className,
  style,
}: AlertDialogHeaderProps) {
  return (
    <div
      className={cn(className)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        marginBottom: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface AlertDialogFooterProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function AlertDialogFooter({
  children,
  className,
  style,
}: AlertDialogFooterProps) {
  return (
    <div
      className={cn(className)}
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 8,
        marginTop: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface AlertDialogTitleProps
  extends Omit<AlertDialogPrimitive.AlertDialogTitleProps, "asChild"> {}

export const AlertDialogTitle = forwardRef<
  HTMLHeadingElement,
  AlertDialogTitleProps
>(function AlertDialogTitle({ style, ...rest }, ref) {
  const sketch = useAlertDialogSketch();
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      style={{
        margin: 0,
        fontSize: 18,
        fontWeight: doodleUiFontWeight(700),
        fontFamily: doodleUiFontFamily,
        color: sketch.ink,
        ...style,
      }}
      {...rest}
    />
  );
});

export interface AlertDialogDescriptionProps
  extends Omit<AlertDialogPrimitive.AlertDialogDescriptionProps, "asChild"> {}

export const AlertDialogDescription = forwardRef<
  HTMLParagraphElement,
  AlertDialogDescriptionProps
>(function AlertDialogDescription({ style, ...rest }, ref) {
  const sketch = useAlertDialogSketch();
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      style={{
        margin: 0,
        fontSize: 14,
        lineHeight: 1.5,
        fontFamily: doodleUiFontFamily,
        color: sketch.ink,
        opacity: 0.8,
        ...style,
      }}
      {...rest}
    />
  );
});

export interface AlertDialogActionProps
  extends Omit<AlertDialogPrimitive.AlertDialogActionProps, "asChild"> {}

export const AlertDialogAction = forwardRef<
  HTMLButtonElement,
  AlertDialogActionProps
>(function AlertDialogAction({ children, ...rest }, ref) {
  const sketch = useAlertDialogSketch();
  return (
    <AlertDialogPrimitive.Action asChild>
      <Button
        ref={ref}
        variant="primary"
        sketchColor={sketch.sketchColor}
        roughness={sketch.roughness}
        seed={sketch.resolvedSeed}
        bowing={sketch.bowing}
        animate={sketch.animate}
        {...rest}
      >
        {children}
      </Button>
    </AlertDialogPrimitive.Action>
  );
});

export interface AlertDialogCancelProps
  extends Omit<AlertDialogPrimitive.AlertDialogCancelProps, "asChild"> {}

export const AlertDialogCancel = forwardRef<
  HTMLButtonElement,
  AlertDialogCancelProps
>(function AlertDialogCancel({ children, ...rest }, ref) {
  const sketch = useAlertDialogSketch();
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Button
        ref={ref}
        variant="outline"
        sketchColor={sketch.sketchColor}
        roughness={sketch.roughness}
        seed={sketch.resolvedSeed}
        bowing={sketch.bowing}
        animate={sketch.animate}
        {...rest}
      >
        {children}
      </Button>
    </AlertDialogPrimitive.Cancel>
  );
});
