"use client";

import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { SketchBox } from "../primitives/SketchBox";
import { Button } from "./Button";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn } from "../utils";

export interface ModalProps extends SketchProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
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
  roughness,
  seed,
  sketchColor,
  bowing,
  fillStyle,
  strokeWidth,
}: ModalProps) {
  const ink = sketchColor ?? SKETCH_COLORS.ink;

  return (
    <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(31, 29, 26, 0.38)",
            zIndex: 70,
          }}
        />
        <Dialog.Content
          className={cn(className)}
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 80,
            width: "min(480px, calc(100vw - 32px))",
            outline: "none",
          }}
        >
          <SketchBox
            roughness={roughness}
            seed={seed}
            sketchColor={ink}
            bowing={bowing}
            fillStyle={fillStyle ?? "solid"}
            fill="#f7f6f2"
            strokeWidth={strokeWidth ?? 2}
            shadow
            contentStyle={{ padding: "20px 22px 18px" }}
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
                    fontWeight: 700,
                    color: ink,
                  }}
                >
                  {title}
                </Dialog.Title>
              ) : (
                <Dialog.Title style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                  Dialog
                </Dialog.Title>
              )}
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  roughness={roughness}
                  seed={seed}
                  sketchColor={ink}
                  aria-label="Close"
                >
                  Close
                </Button>
              </Dialog.Close>
            </div>
            {description ? (
              <Dialog.Description
                style={{
                  margin: "0 0 14px",
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: ink,
                  opacity: 0.8,
                }}
              >
                {description}
              </Dialog.Description>
            ) : null}
            <div>{children}</div>
          </SketchBox>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const ModalRoot = Dialog.Root;
export const ModalTrigger = Dialog.Trigger;
export const ModalClose = Dialog.Close;
export const ModalTitle = Dialog.Title;
export const ModalDescription = Dialog.Description;
