"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { SketchBox } from "../primitives/SketchBox";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

interface EmptyContextValue {
  ink: string;
}

const EmptyContext = createContext<EmptyContextValue | null>(null);

function useEmptyInk(): string {
  const ctx = useContext(EmptyContext);
  return ctx?.ink ?? SKETCH_COLORS.ink;
}

const emptyContentStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: 12,
  padding: "32px 24px",
  minHeight: 160,
  width: "100%",
};

export interface EmptyProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    SketchProps {
  bordered?: boolean;
  animate?: boolean;
}

export const Empty = forwardRef<HTMLDivElement, EmptyProps>(function Empty(
  {
    className,
    style,
    children,
    bordered = true,
    roughness,
    seed,
    sketchColor,
    bowing,
    fillStyle,
    strokeWidth,
    animate,
    ...rest
  },
  ref,
) {
  const ink = sketchColor ?? SKETCH_COLORS.ink;

  const inner = (
    <EmptyContext.Provider value={{ ink }}>
      <div
        ref={bordered ? undefined : ref}
        className={cn(className)}
        style={{ ...emptyContentStyle, ...style }}
        {...(bordered ? {} : rest)}
      >
        {children}
      </div>
    </EmptyContext.Provider>
  );

  if (!bordered) {
    return inner;
  }

  return (
    <SketchBox
      ref={ref}
      className={cn(className)}
      style={{ width: "100%", ...style }}
      contentStyle={emptyContentStyle}
      fill={SKETCH_COLORS.secondaryFill}
      fillStyle={fillStyle ?? "hachure"}
      roughness={roughness}
      seed={seed}
      sketchColor={sketchColor}
      bowing={bowing}
      strokeWidth={strokeWidth}
      animate={animate}
      {...rest}
    >
      <EmptyContext.Provider value={{ ink }}>{children}</EmptyContext.Provider>
    </SketchBox>
  );
});

export function EmptyMedia({
  className,
  style,
  children,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(className)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function EmptyTitle({
  className,
  style,
  children,
}: HTMLAttributes<HTMLHeadingElement>) {
  const ink = useEmptyInk();
  return (
    <h3
      className={cn(className)}
      style={{
        margin: 0,
        fontFamily: doodleUiFontFamily,
        fontSize: 18,
        fontWeight: doodleUiFontWeight(700),
        color: ink,
        ...style,
      }}
    >
      {children}
    </h3>
  );
}

export function EmptyDescription({
  className,
  style,
  children,
}: HTMLAttributes<HTMLParagraphElement>) {
  const ink = useEmptyInk();
  return (
    <p
      className={cn(className)}
      style={{
        margin: 0,
        maxWidth: 360,
        fontFamily: doodleUiFontFamily,
        fontSize: 14,
        lineHeight: 1.5,
        color: ink,
        opacity: 0.85,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

export function EmptyAction({
  className,
  style,
  children,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(className)}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center",
        marginTop: 8,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
