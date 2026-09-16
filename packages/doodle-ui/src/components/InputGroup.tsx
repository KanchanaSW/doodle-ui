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
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily } from "../utils";

interface InputGroupSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  accent: string;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
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

/**
 * Props for {@link InputGroup}.
 */
export interface InputGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    SketchProps {
  children?: ReactNode;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Single sketch frame around input and addons.
 *
 * @example
 * <InputGroup />
 */
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
  hachureGap,
  hachureAngle,
  fillWeight,
  animate,
  onFocus,
  onBlur,
  ...rest
}: InputGroupProps) {
  const resolvedSeed = useResolvedSeed(seed);
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;
  const [focused, setFocused] = useState(false);
  const shouldAnimate = useAnimate(animate);
  const focusSeed = deriveSeed(resolvedSeed, "focus");
  const sketchSeed = shouldAnimate && focused ? focusSeed : resolvedSeed;

  return (
    <InputGroupSketchContext.Provider
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
        resolvedSeed,
        ink,
        accent: theme.accent,
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
          sketchColor={focused ? theme.accent : ink}
          bowing={bowing}
          fillStyle={fillStyle}
          strokeWidth={
            focused && !shouldAnimate
              ? (strokeWidth ?? 1.75) + 0.35
              : strokeWidth
          }
          hachureGap={hachureGap}
          hachureAngle={hachureAngle}
          fillWeight={fillWeight}
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

/**
 * Props for {@link InputGroupAddon}.
 */
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

/**
 * Props for {@link InputGroupInput}.
 */
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

/**
 * Props for {@link InputGroupButton}.
 */
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
