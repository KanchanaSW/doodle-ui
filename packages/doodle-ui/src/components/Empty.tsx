"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

interface EmptyContextValue {
  ink: string;
}

const EmptyContext = createContext<EmptyContextValue | null>(null);

function useEmptyInk(): string {
  const ctx = useContext(EmptyContext);
  const theme = useSketchTheme();
  return ctx?.ink ?? theme.ink;
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

/**
 * Props for {@link Empty}.
 */
export interface EmptyProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    SketchProps {
  bordered?: boolean;
  fill?: string;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Empty state placeholder.
 *
 * @example
 * <Empty />
 */
export const Empty = forwardRef<HTMLDivElement, EmptyProps>(function Empty(
  {
    className,
    style,
    children,
    bordered = true,
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
  },
  ref,
) {
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;

  const inner = (
    <EmptyContext.Provider value={{ ink }}>
      <div
        ref={bordered ? undefined : ref}
        className={cn(className)}
        style={{ ...emptyContentStyle, color: ink, ...style }}
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
      style={{ width: "100%", color: ink, ...style }}
      contentStyle={{ ...emptyContentStyle, color: ink }}
      fill={fill ?? theme.secondaryFill}
      fillStyle={fillStyle ?? "hachure"}
      hachureGap={hachureGap ?? 8}
      hachureAngle={hachureAngle}
      fillWeight={fillWeight ?? 0.85}
      roughness={roughness}
      seed={seed}
      sketchColor={ink}
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
