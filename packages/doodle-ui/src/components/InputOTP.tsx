"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useRef,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { motion } from "framer-motion";
import {
  DRAW_IN_DURATION_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import type { SketchProps } from "../types";
import { cn, assignRef, deriveSeed, doodleUiFontFamily } from "../utils";

interface InputOTPSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  accent: string;
  paper: string;
  fill?: string;
  animate?: boolean;
}

const InputOTPSketchContext = createContext<InputOTPSketchContextValue | null>(
  null,
);

function useInputOTPSketch(): InputOTPSketchContextValue {
  const ctx = useContext(InputOTPSketchContext);
  if (!ctx) {
    throw new Error("InputOTP parts must be used inside <InputOTP>.");
  }
  return ctx;
}

export interface InputOTPProps
  extends Omit<ComponentPropsWithoutRef<typeof OTPInput>, "render">,
    SketchProps {
  fill?: string;
  animate?: boolean;
}

export const InputOTP = forwardRef<HTMLInputElement, InputOTPProps>(
  function InputOTP(
    {
      className,
      containerClassName,
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      hachureGap,
      hachureAngle,
      fillWeight,
      fill,
      animate,
      children,
      ...rest
    },
    ref,
  ) {
    const resolvedSeed = useResolvedSeed(seed);
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;

    return (
      <InputOTPSketchContext.Provider
        value={{
          roughness,
          seed: resolvedSeed,
          sketchColor: ink,
          bowing,
          fillStyle,
          strokeWidth,
          hachureGap,
          hachureAngle,
          fillWeight,
          fill,
          resolvedSeed,
          ink,
          accent: theme.accent,
          paper: theme.paper,
          animate,
        }}
      >
        <OTPInput
          ref={ref}
          containerClassName={cn(className, containerClassName)}
          {...rest}
        >
          {children}
        </OTPInput>
      </InputOTPSketchContext.Provider>
    );
  },
);

export interface InputOTPGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const InputOTPGroup = forwardRef<HTMLDivElement, InputOTPGroupProps>(
  function InputOTPGroup({ className, style, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{ display: "flex", alignItems: "center", gap: 8, ...style }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export interface InputOTPSlotProps extends HTMLAttributes<HTMLDivElement> {
  index: number;
}

export const InputOTPSlot = forwardRef<HTMLDivElement, InputOTPSlotProps>(
  function InputOTPSlot({ index, className, style, ...rest }, ref) {
    const inputContext = useContext(OTPInputContext);
    const sketch = useInputOTPSketch();
    const slotRef = useRef<HTMLDivElement>(null);
    const shouldAnimate = useAnimate(sketch.animate);

    const { char, isActive, hasFakeCaret } = inputContext?.slots[index] ?? {
      char: null,
      isActive: false,
      hasFakeCaret: false,
    };
    const slotSeed = deriveSeed(
      sketch.resolvedSeed,
      `slot-${index}-${isActive ? "active" : "idle"}`,
    );

    useDrawIn(slotRef, DRAW_IN_DURATION_MS, shouldAnimate, slotSeed);

    if (!inputContext) {
      throw new Error("InputOTPSlot must be used inside <InputOTP>.");
    }

    return (
      <div
        ref={(node) => {
          (slotRef as MutableRefObject<HTMLDivElement | null>).current = node;
          assignRef(ref, node);
        }}
        className={cn(className)}
        style={{
          position: "relative",
          width: 40,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: doodleUiFontFamily,
          fontSize: 18,
          color: sketch.ink,
          ...style,
        }}
        {...rest}
      >
        <RoughSvg
          shape="rectangle"
          roughness={sketch.roughness}
          seed={slotSeed}
          sketchColor={isActive ? sketch.accent : sketch.ink}
          bowing={sketch.bowing}
          fillStyle={sketch.fillStyle}
          fill={sketch.fill}
          hachureGap={sketch.hachureGap}
          hachureAngle={sketch.hachureAngle}
          fillWeight={sketch.fillWeight}
          strokeWidth={
            isActive ? (sketch.strokeWidth ?? 1.75) + 0.15 : sketch.strokeWidth
          }
        />
        <span style={{ position: "relative", zIndex: 1 }}>
          {char}
          {hasFakeCaret ? (
            <motion.span
              aria-hidden
              style={{
                display: "inline-block",
                width: 2,
                height: "0.85em",
                marginLeft: 2,
                background: sketch.ink,
                verticalAlign: "middle",
              }}
              animate={shouldAnimate ? { opacity: [1, 0, 1] } : { opacity: 1 }}
              transition={
                shouldAnimate
                  ? { duration: 1, repeat: Infinity, ease: "linear" }
                  : undefined
              }
            />
          ) : null}
        </span>
      </div>
    );
  },
);

export interface InputOTPSeparatorProps extends HTMLAttributes<HTMLSpanElement> {}

export const InputOTPSeparator = forwardRef<
  HTMLSpanElement,
  InputOTPSeparatorProps
>(function InputOTPSeparator({ children = "–", className, style, ...rest }, ref) {
  const sketch = useInputOTPSketch();
  return (
    <span
      ref={ref}
      role="separator"
      className={cn(className)}
      style={{
        fontFamily: doodleUiFontFamily,
        color: sketch.ink,
        opacity: 0.5,
        userSelect: "none",
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
});
