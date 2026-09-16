"use client";

import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useAnimate } from "../animations";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";
import { Button } from "./Button";

export interface ModalProps extends SketchProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
  fill?: string;
  /**
   * Backdrop fade, panel enter/exit, and border draw-in on open.
   * Defaults to the DoodleUIProvider value (true).
   */
  animate?: boolean;
}

export function Modal({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  className,
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
}: ModalProps) {
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;
  const [uncontrolled, setUncontrolled] = useState(defaultOpen === true);
  const isOpen = open ?? uncontrolled;
  const shouldAnimate = useAnimate(animate);

  function handleOpenChange(next: boolean) {
    setUncontrolled(next);
    onOpenChange?.(next);
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <AnimatePresence>
        {isOpen ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
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
                  background: theme.isDark ? "rgba(0, 0, 0, 0.65)" : "rgba(31, 29, 26, 0.38)",
                  zIndex: 70,
                }}
              />
            </Dialog.Overlay>
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
              <Dialog.Content asChild forceMount>
                <motion.div
                  className={cn(className)}
                  initial={
                    shouldAnimate
                      ? { opacity: 0, scale: 0.96, y: 10 }
                      : false
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
                    width: "min(480px, calc(100vw - 32px))",
                    outline: "none",
                    pointerEvents: "auto",
                    color: ink,
                  }}
                >
                  <SketchBox
                    roughness={roughness}
                    seed={seed}
                    sketchColor={ink}
                    bowing={bowing}
                    fillStyle={fillStyle ?? "solid"}
                    fill={fill ?? theme.paper}
                    strokeWidth={strokeWidth ?? 2}
                    hachureGap={hachureGap}
                    hachureAngle={hachureAngle}
                    fillWeight={fillWeight}
                    shadow
                    animate={animate}
                    contentStyle={{ padding: "20px 22px 18px", color: ink }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: title ? 10 : 0,
                      }}
                    >
                      {title ? (
                        <Dialog.Title
                          style={{
                            margin: 0,
                            fontSize: 18,
                            fontWeight: doodleUiFontWeight(700),
                            fontFamily: doodleUiFontFamily,
                            color: ink,
                          }}
                        >
                          {title}
                        </Dialog.Title>
                      ) : (
                        <Dialog.Title
                          style={{
                            position: "absolute",
                            width: 1,
                            height: 1,
                            overflow: "hidden",
                            clip: "rect(0 0 0 0)",
                          }}
                        >
                          Dialog
                        </Dialog.Title>
                      )}
                      <Dialog.Close asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          sketchColor={ink}
                          aria-label="Close dialog"
                          style={{ padding: "2px 8px", minHeight: 26 }}
                        >
                          ✕
                        </Button>
                      </Dialog.Close>
                    </div>
                    {description ? (
                      <Dialog.Description
                        style={{
                          margin: 0,
                          marginBottom: 14,
                          fontSize: 14,
                          lineHeight: 1.4,
                          opacity: 0.78,
                          fontFamily: doodleUiFontFamily,
                          color: ink,
                        }}
                      >
                        {description}
                      </Dialog.Description>
                    ) : null}
                    <div>{children}</div>
                  </SketchBox>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export const ModalRoot = Dialog.Root;
export const ModalTrigger = Dialog.Trigger;
export const ModalClose = Dialog.Close;
export const ModalTitle = Dialog.Title;
export const ModalDescription = Dialog.Description;
