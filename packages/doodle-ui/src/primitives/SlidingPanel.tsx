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
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useAnimate } from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

export type SlidingPanelSide = "top" | "right" | "bottom" | "left";

interface SlidingPanelSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  paper: string;
  isDark: boolean;
  animate?: boolean;
  open: boolean;
  side: SlidingPanelSide;
}

const SlidingPanelSketchContext =
  createContext<SlidingPanelSketchContextValue | null>(null);

export function useSlidingPanelSketch(): SlidingPanelSketchContextValue {
  const ctx = useContext(SlidingPanelSketchContext);
  if (!ctx) {
    throw new Error("Sliding panel parts must be used inside the panel root.");
  }
  return ctx;
}

export interface SlidingPanelRootProps
  extends Omit<DialogPrimitive.DialogProps, "children">,
    SketchProps {
  children?: ReactNode;
  side?: SlidingPanelSide;
  fill?: string;
  animate?: boolean;
}

export function SlidingPanelRoot({
  children,
  open,
  defaultOpen,
  onOpenChange,
  side = "right",
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
}: SlidingPanelRootProps) {
  const resolvedSeed = useResolvedSeed(seed);
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;
  const [uncontrolled, setUncontrolled] = useState(defaultOpen === true);
  const isOpen = open ?? uncontrolled;

  return (
    <SlidingPanelSketchContext.Provider
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
        side,
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
    </SlidingPanelSketchContext.Provider>
  );
}

export const SlidingPanelTrigger = DialogPrimitive.Trigger;
export const SlidingPanelClose = DialogPrimitive.Close;
export const SlidingPanelPortal = DialogPrimitive.Portal;

function slideVariants(side: SlidingPanelSide, shouldAnimate: boolean): Variants {
  if (!shouldAnimate) {
    return { hidden: {}, visible: {} };
  }
  const offset = 420;
  const hidden =
    side === "left"
      ? { x: -offset }
      : side === "right"
        ? { x: offset }
        : side === "top"
          ? { y: -offset }
          : { y: offset };
  return {
    hidden: { ...hidden, opacity: 0.85 },
    visible: { x: 0, y: 0, opacity: 1 },
  };
}

function panelPosition(side: SlidingPanelSide): CSSProperties {
  switch (side) {
    case "left":
      return {
        top: 0,
        bottom: 0,
        left: 0,
        width: "min(420px, 100vw)",
      };
    case "right":
      return {
        top: 0,
        bottom: 0,
        right: 0,
        width: "min(420px, 100vw)",
      };
    case "top":
      return {
        top: 0,
        left: 0,
        right: 0,
        height: "min(420px, 90vh)",
      };
    default:
      return {
        bottom: 0,
        left: 0,
        right: 0,
        height: "min(420px, 90vh)",
      };
  }
}

export interface SlidingPanelOverlayProps
  extends Omit<DialogPrimitive.DialogOverlayProps, "asChild" | "forceMount"> {}

export const SlidingPanelOverlay = forwardRef<
  HTMLDivElement,
  SlidingPanelOverlayProps
>(function SlidingPanelOverlay({ style, ...rest }, ref) {
  const sketch = useSlidingPanelSketch();
  const shouldAnimate = useAnimate(sketch.animate);

  return (
    <DialogPrimitive.Overlay ref={ref} asChild forceMount {...rest}>
      <motion.div
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        exit={shouldAnimate ? { opacity: 0 } : undefined}
        transition={
          shouldAnimate ? { duration: 0.22, ease: "easeOut" } : { duration: 0 }
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
});

export interface SlidingPanelContentProps
  extends Omit<DialogPrimitive.DialogContentProps, "asChild" | "forceMount"> {
  children?: ReactNode;
  contentStyle?: CSSProperties;
  fill?: string;
  /** Extra chrome above panel content (e.g. drawer handle). */
  chrome?: ReactNode;
}

export const SlidingPanelContent = forwardRef<
  HTMLDivElement,
  SlidingPanelContentProps
>(function SlidingPanelContent(
  { className, style, contentStyle, fill, children, chrome, ...rest },
  ref,
) {
  const sketch = useSlidingPanelSketch();
  const shouldAnimate = useAnimate(sketch.animate);
  const variants = slideVariants(sketch.side, shouldAnimate);

  return (
    <AnimatePresence>
      {sketch.open ? (
        <DialogPrimitive.Portal forceMount>
          <SlidingPanelOverlay />
          <DialogPrimitive.Content ref={ref} asChild forceMount {...rest}>
            <motion.div
              className={cn(className)}
              initial={shouldAnimate ? "hidden" : false}
              animate="visible"
              exit={shouldAnimate ? "hidden" : undefined}
              variants={variants}
              transition={
                shouldAnimate
                  ? { duration: 0.28, ease: "easeOut" }
                  : { duration: 0 }
              }
              style={{
                position: "fixed",
                zIndex: 80,
                outline: "none",
                pointerEvents: "auto",
                ...panelPosition(sketch.side),
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
                contentStyle={{
                  padding: 20,
                  height: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  color: sketch.ink,
                  ...contentStyle,
                }}
                style={{ height: "100%" }}
              >
                {chrome}
                {children}
              </SketchBox>
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  );
});

export interface SlidingPanelHeaderProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function SlidingPanelHeader({
  children,
  className,
  style,
}: SlidingPanelHeaderProps) {
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

export interface SlidingPanelFooterProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function SlidingPanelFooter({
  children,
  className,
  style,
}: SlidingPanelFooterProps) {
  return (
    <div
      className={cn(className)}
      style={{
        display: "flex",
        gap: 8,
        marginTop: "auto",
        paddingTop: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const SlidingPanelTitle = forwardRef<
  HTMLHeadingElement,
  DialogPrimitive.DialogTitleProps
>(function SlidingPanelTitle({ className, style, ...rest }, ref) {
  const sketch = useSlidingPanelSketch();
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(className)}
      style={{
        margin: 0,
        fontFamily: doodleUiFontFamily,
        fontWeight: doodleUiFontWeight(700),
        fontSize: 20,
        color: sketch.ink,
        ...style,
      }}
      {...rest}
    />
  );
});

export const SlidingPanelDescription = forwardRef<
  HTMLParagraphElement,
  DialogPrimitive.DialogDescriptionProps
>(function SlidingPanelDescription({ className, style, ...rest }, ref) {
  const sketch = useSlidingPanelSketch();
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn(className)}
      style={{
        margin: 0,
        fontFamily: doodleUiFontFamily,
        fontSize: 14,
        color: sketch.ink,
        opacity: 0.75,
        ...style,
      }}
      {...rest}
    />
  );
});
