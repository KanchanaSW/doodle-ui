"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useAnimate } from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

interface DialogSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  paper: string;
  isDark: boolean;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
  open: boolean;
}

const DialogSketchContext = createContext<DialogSketchContextValue | null>(
  null,
);

function useDialogSketch(): DialogSketchContextValue {
  const ctx = useContext(DialogSketchContext);
  if (!ctx) {
    throw new Error("Dialog parts must be used inside <Dialog>.");
  }
  return ctx;
}

/**
 * Props for {@link Dialog}.
 */
export interface DialogProps
  extends Omit<DialogPrimitive.DialogProps, "children">,
    SketchProps {
  children?: ReactNode;
  fill?: string;
  /**
   * Backdrop fade, panel enter/exit, and border draw-in on open.
   * Defaults to the DoodleUIProvider value (true).
   */
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Lighter-weight sibling to `Modal`: a composable, shadcn-style dialog built
 * from `Dialog` / `DialogTrigger` / `DialogContent` / `DialogHeader` /
 * `DialogFooter` / `DialogTitle` / `DialogDescription` / `DialogClose`. Unlike
 * `Modal`, `DialogContent` has no forced width or shadow and no built-in
 * close button — compose your own layout inside it.
 */
/**
 * Composable dialog with sketch framing.
 *
 * @example
 * <Dialog />
 */
export function Dialog({
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
}: DialogProps) {
  const resolvedSeed = useResolvedSeed(seed);
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;
  const [uncontrolled, setUncontrolled] = useState(defaultOpen === true);
  const isOpen = open ?? uncontrolled;

  return (
    <DialogSketchContext.Provider
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
      <DialogPrimitive.Root
        open={isOpen}
        onOpenChange={(next) => {
          setUncontrolled(next);
          onOpenChange?.(next);
        }}
        {...rest}
      >
        {children}
      </DialogPrimitive.Root>
    </DialogSketchContext.Provider>
  );
}

export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

/**
 * Props for {@link DialogOverlay}.
 */
export interface DialogOverlayProps
  extends Omit<DialogPrimitive.DialogOverlayProps, "asChild" | "forceMount"> {}

export const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProps>(
  function DialogOverlay({ style, ...rest }, ref) {
    const sketch = useDialogSketch();
    const shouldAnimate = useAnimate(sketch.animate);

    return (
      <DialogPrimitive.Overlay ref={ref} asChild forceMount {...rest}>
        <motion.div
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          exit={shouldAnimate ? { opacity: 0 } : undefined}
          transition={
            shouldAnimate
              ? { duration: 0.2, ease: "easeOut" }
              : { duration: 0 }
          }
          style={{
            position: "fixed",
            inset: 0,
            background: sketch.isDark ? "rgba(0, 0, 0, 0.65)" : "rgba(31, 29, 26, 0.38)",
            zIndex: 70,
            ...style,
          }}
        />
      </DialogPrimitive.Overlay>
    );
  },
);

/**
 * Props for {@link DialogContent}.
 */
export interface DialogContentProps
  extends Omit<DialogPrimitive.DialogContentProps, "asChild" | "forceMount"> {
  children?: ReactNode;
  fill?: string;
  /** Panel width. Defaults to `min(420px, calc(100vw - 32px))`. */
  contentStyle?: CSSProperties;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(
    { className, style, contentStyle, fill, children, ...rest },
    ref,
  ) {
    const sketch = useDialogSketch();
    const shouldAnimate = useAnimate(sketch.animate);

    return (
      <AnimatePresence>
        {sketch.open ? (
          <DialogPrimitive.Portal forceMount>
            <DialogOverlay />
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
              <DialogPrimitive.Content ref={ref} asChild forceMount {...rest}>
                <motion.div
                  className={cn(className)}
                  initial={
                    shouldAnimate ? { opacity: 0, scale: 0.96, y: 10 } : false
                  }
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={
                    shouldAnimate
                      ? { opacity: 0, scale: 0.96, y: 8 }
                      : undefined
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
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    );
  },
);

/**
 * Props for {@link DialogHeader}.
 */
export interface DialogHeaderProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function DialogHeader({ children, className, style }: DialogHeaderProps) {
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

/**
 * Props for {@link DialogFooter}.
 */
export interface DialogFooterProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function DialogFooter({ children, className, style }: DialogFooterProps) {
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

/**
 * Props for {@link DialogTitle}.
 */
export interface DialogTitleProps
  extends Omit<DialogPrimitive.DialogTitleProps, "asChild"> {}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle({ style, ...rest }, ref) {
    const sketch = useDialogSketch();
    return (
      <DialogPrimitive.Title
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
  },
);

/**
 * Props for {@link DialogDescription}.
 */
export interface DialogDescriptionProps
  extends Omit<DialogPrimitive.DialogDescriptionProps, "asChild"> {}

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(function DialogDescription({ style, ...rest }, ref) {
  const sketch = useDialogSketch();
  return (
    <DialogPrimitive.Description
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
