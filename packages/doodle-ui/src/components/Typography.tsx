"use client";

import {
  forwardRef,
  useRef,
  type HTMLAttributes,
} from "react";
import { DRAW_IN_MARK_MS, useAnimate, useDrawIn } from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingAccent = "none" | "underline" | "highlight";

const HEADING_SIZES: Record<HeadingLevel, number> = {
  1: 32,
  2: 26,
  3: 22,
  4: 18,
  5: 16,
  6: 14,
};

/**
 * Props for {@link Heading}.
 */
export interface HeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, "color">,
    SketchProps {
  level?: HeadingLevel;
  accent?: HeadingAccent;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(
    {
      level = 2,
      accent = "none",
      className,
      style,
      children,
      roughness,
      seed,
      sketchColor,
      bowing,
      strokeWidth,
      animate,
      ...rest
    },
    ref,
  ) {
    const Tag = `h${level}` as const;
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const accentColor = sketchColor ?? theme.accent;
    const accentFill = theme.isDark
      ? (sketchColor ? `${sketchColor}25` : theme.accentFill)
      : theme.accentFill;
    const resolvedSeed = useResolvedSeed(seed);
    const shouldAnimate = useAnimate(animate);
    const accentRef = useRef<HTMLSpanElement>(null);
    useDrawIn(accentRef, DRAW_IN_MARK_MS, shouldAnimate && accent !== "none");

    const fontSize = HEADING_SIZES[level];

    return (
      <Tag
        ref={ref}
        className={cn(className)}
        style={{
          position: "relative",
          margin: 0,
          fontFamily: doodleUiFontFamily,
          fontSize,
          fontWeight: doodleUiFontWeight(700),
          color: ink,
          lineHeight: 1.2,
          ...style,
        }}
        {...rest}
      >
        {accent === "highlight" ? (
          <span style={{ position: "relative", display: "inline" }}>
            <span
              ref={accentRef}
              aria-hidden
              style={{
                position: "absolute",
                left: -4,
                right: -4,
                bottom: 2,
                height: "0.45em",
                zIndex: 0,
              }}
            >
              <RoughSvg
                shape="rectangle"
                roughness={roughness}
                seed={resolvedSeed}
                sketchColor={accentColor}
                fill={accentFill}
                fillStyle="solid"
                bowing={bowing}
                strokeWidth={strokeWidth ?? 1.2}
              />
            </span>
            <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
          </span>
        ) : (
          children
        )}
        {accent === "underline" ? (
          <span
            ref={accentRef}
            aria-hidden
            style={{
              display: "block",
              position: "relative",
              height: 6,
              marginTop: 4,
              maxWidth: "100%",
            }}
          >
            <RoughSvg
              shape="path"
              path="M 2 4 Q 40 1 80 5 T 160 3"
              roughness={roughness}
              seed={resolvedSeed}
              sketchColor={accentColor}
              bowing={bowing}
              strokeWidth={strokeWidth ?? 1.5}
            />
          </span>
        ) : null}
      </Tag>
    );
  },
);

/**
 * Props for {@link Text}.
 */
export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: "body" | "lead" | "muted";
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(function Text(
  { variant = "body", className, style, children, ...rest },
  ref,
) {
  const theme = useSketchTheme();
  const sizes = { body: 14, lead: 17, muted: 13 };
  const opacity = variant === "muted" ? 0.75 : 1;
  return (
    <p
      ref={ref}
      className={cn(className)}
      style={{
        margin: 0,
        fontFamily: doodleUiFontFamily,
        fontSize: sizes[variant],
        fontWeight: doodleUiFontWeight(variant === "lead" ? 500 : 400),
        lineHeight: 1.55,
        color: theme.ink,
        opacity,
        ...style,
      }}
      {...rest}
    >
      {children}
    </p>
  );
});

export const Paragraph = Text;

/**
 * Props for {@link Blockquote}.
 */
export interface BlockquoteProps
  extends Omit<HTMLAttributes<HTMLQuoteElement>, "color">,
    SketchProps {
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

export const Blockquote = forwardRef<HTMLQuoteElement, BlockquoteProps>(
  function Blockquote(
    {
      className,
      style,
      children,
      roughness,
      seed,
      sketchColor,
      bowing,
      strokeWidth,
      animate,
      ...rest
    },
    ref,
  ) {
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const accent = sketchColor ?? theme.accent;
    const resolvedSeed = useResolvedSeed(seed);
    const shouldAnimate = useAnimate(animate);
    const ruleRef = useRef<HTMLSpanElement>(null);
    useDrawIn(ruleRef, DRAW_IN_MARK_MS, shouldAnimate);

    return (
      <blockquote
        ref={ref}
        className={cn(className)}
        style={{
          display: "flex",
          gap: 12,
          margin: 0,
          padding: "8px 0 8px 4px",
          fontFamily: doodleUiFontFamily,
          fontSize: 15,
          fontStyle: "italic",
          lineHeight: 1.5,
          color: ink,
          ...style,
        }}
        {...rest}
      >
        <span
          ref={ruleRef}
          aria-hidden
          style={{ position: "relative", width: 6, flexShrink: 0, minHeight: 40 }}
        >
          <RoughSvg
            shape="line-vertical"
            roughness={roughness}
            seed={resolvedSeed}
            sketchColor={accent}
            bowing={bowing}
            strokeWidth={strokeWidth ?? 2}
          />
        </span>
        <span>{children}</span>
      </blockquote>
    );
  },
);

/**
 * Props for {@link InlineCode}.
 */
export interface InlineCodeProps
  extends Omit<HTMLAttributes<HTMLElement>, "color">,
    SketchProps {
  fill?: string;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

export const InlineCode = forwardRef<HTMLElement, InlineCodeProps>(
  function InlineCode(
    {
      className,
      style,
      children,
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

    return (
      <SketchBox
        className={cn(className)}
        style={{ display: "inline-flex", verticalAlign: "baseline", color: ink, ...style }}
        contentStyle={{
          padding: "1px 6px",
          fontSize: "0.9em",
          fontFamily: "ui-monospace, monospace",
          color: ink,
        }}
        fill={fill ?? theme.paper}
        fillStyle={fillStyle ?? "solid"}
        roughness={roughness}
        seed={seed}
        sketchColor={ink}
        bowing={bowing}
        strokeWidth={strokeWidth ?? 1.2}
        hachureGap={hachureGap}
        hachureAngle={hachureAngle}
        fillWeight={fillWeight}
        animate={animate}
        {...rest}
      >
        <code
          ref={ref}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            font: "inherit",
            color: ink,
          }}
        >
          {children}
        </code>
      </SketchBox>
    );
  },
);

/**
 * Props for {@link Highlight}.
 */
export interface HighlightProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color">,
    SketchProps {
  fill?: string;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

export const Highlight = forwardRef<HTMLSpanElement, HighlightProps>(
  function Highlight(
    {
      className,
      style,
      children,
      fill,
      roughness,
      seed,
      sketchColor,
      bowing,
      strokeWidth,
      animate,
      ...rest
    },
    ref,
  ) {
    const resolvedSeed = useResolvedSeed(seed);
    const theme = useSketchTheme(sketchColor);
    const accent = sketchColor ?? theme.accent;
    const accentFill = fill ?? (theme.isDark
      ? (sketchColor ? `${sketchColor}25` : theme.accentFill)
      : theme.accentFill);
    const shouldAnimate = useAnimate(animate);
    const markRef = useRef<HTMLSpanElement>(null);
    useDrawIn(markRef, DRAW_IN_MARK_MS, shouldAnimate);

    return (
      <span
        ref={ref}
        className={cn(className)}
        style={{ position: "relative", display: "inline", ...style }}
        {...rest}
      >
        <span
          ref={markRef}
          aria-hidden
          style={{
            position: "absolute",
            left: -2,
            right: -2,
            bottom: 0,
            top: "35%",
            zIndex: 0,
          }}
        >
          <RoughSvg
            shape="rectangle"
            roughness={roughness}
            seed={resolvedSeed}
            sketchColor={accent}
            fill={accentFill}
            fillStyle="solid"
            bowing={bowing}
            strokeWidth={strokeWidth ?? 1}
          />
        </span>
        <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      </span>
    );
  },
);
