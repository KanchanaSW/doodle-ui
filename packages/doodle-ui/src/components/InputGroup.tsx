"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { useAnimate } from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { SketchBox } from "../primitives/SketchBox";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily } from "../utils";

interface InputGroupSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  animate?: boolean;
  focused: boolean;
  setFocused: (next: boolean) => void;
}

const InputGroupSketchContext =
  createContext<InputGroupSketchContextValue | null>(null);

function useInputGroupSketch(): InputGroupSketchContextValue {
  const ctx = useContext(InputGroupSketchContext);
  if (!ctx) {
    throw new Error("InputGroup parts must be used inside <InputGroup>.");
  }
  return ctx;
}

export interface InputGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    SketchProps {
  children?: ReactNode;
  animate?: boolean;
}

export function InputGroup({
  children,
  className,
  style,
  roughness,
  seed,
  sketchColor,
  bowing,
  fillStyle,
  strokeWidth,
  animate,
  onFocus,
  onBlur,
  ...rest
}: InputGroupProps) {
  const resolvedSeed = useResolvedSeed(seed);
  const ink = sketchColor ?? SKETCH_COLORS.ink;
  const [focused, setFocused] = useState(false);
  const shouldAnimate = useAnimate(animate);
  const focusSeed = deriveSeed(resolvedSeed, "focus");
  const sketchSeed = shouldAnimate && focused ? focusSeed : resolvedSeed;

  return (
    <InputGroupSketchContext.Provider
      value={{
        roughness,
        seed: resolvedSeed,
        sketchColor,
        bowing,
        fillStyle,
        strokeWidth,
        resolvedSeed,
        ink,
        animate,
        focused,
        setFocused,
      }}
    >
      <div
        className={cn(className)}
        style={{ position: "relative", width: "100%", ...style }}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setFocused(false);
          }
          onBlur?.(event);
        }}
        {...rest}
      >
        <SketchBox
          roughness={roughness}
          seed={sketchSeed}
          sketchColor={focused ? SKETCH_COLORS.accent : ink}
          bowing={bowing}
          fillStyle={fillStyle}
          strokeWidth={
            focused && !shouldAnimate
              ? (strokeWidth ?? 1.75) + 0.35
              : strokeWidth
          }
          animate={animate}
          drawInKey={sketchSeed}
          contentStyle={{
            display: "flex",
            alignItems: "stretch",
            minHeight: 38,
          }}
        >
          {children}
        </SketchBox>
      </div>
    </InputGroupSketchContext.Provider>
  );
}

export interface InputGroupAddonProps extends HTMLAttributes<HTMLSpanElement> {
  align?: "inline-start" | "inline-end";
}

export const InputGroupAddon = forwardRef<HTMLSpanElement, InputGroupAddonProps>(
  function InputGroupAddon(
    { className, style, align = "inline-start", children, ...rest },
    ref,
  ) {
    const sketch = useInputGroupSketch();
    return (
      <span
        ref={ref}
        className={cn(className)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: align === "inline-start" ? "0 0 0 10px" : "0 10px 0 0",
          fontFamily: doodleUiFontFamily,
          fontSize: 14,
          color: sketch.ink,
          flexShrink: 0,
          ...style,
        }}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

export interface InputGroupInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size"> {}

export const InputGroupInput = forwardRef<
  HTMLInputElement,
  InputGroupInputProps
>(function InputGroupInput({ className, style, ...rest }, ref) {
  const sketch = useInputGroupSketch();
  return (
    <input
      ref={ref}
      className={cn(className)}
      style={{
        flex: 1,
        minWidth: 0,
        border: "none",
        outline: "none",
        background: "transparent",
        color: sketch.ink,
        fontFamily: doodleUiFontFamily,
        fontSize: 15,
        padding: "8px 10px",
        ...style,
      }}
      {...rest}
    />
  );
});

export interface InputGroupButtonProps extends HTMLAttributes<HTMLSpanElement> {}

export const InputGroupButton = forwardRef<
  HTMLSpanElement,
  InputGroupButtonProps
>(function InputGroupButton({ className, style, children, ...rest }, ref) {
  return (
    <span
      ref={ref}
      className={cn(className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0 6px 0 0",
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
});
