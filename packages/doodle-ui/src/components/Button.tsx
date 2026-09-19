"use client";

import {
  forwardRef,
  memo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import {
  DRAW_IN_DURATION_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import {
  DoodleIcon,
  hasVisibleTextContent,
  warnIfMissingAriaLabel,
} from "../primitives/icon";
import { resolveInteractiveState } from "../primitives/interactive";
import {
  CONTROL_SIZE_STYLES,
  resolveSize,
  type DoodleSize,
} from "../primitives/size";
import type { SketchProps } from "../types";
import { assignRef, cn, deriveSeed, doodleUiFontFamily, doodleUiFontWeight } from "../utils";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = DoodleSize;

/**
 * Props for {@link Button}.
 */
export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    SketchProps {
  /**
   * Visual style preset.
   * @default "primary"
   */
  variant?: ButtonVariant;
  /**
   * Control size preset.
   * @default "md"
   */
  size?: ButtonSize;
  /**
   * Merge props onto the single child instead of rendering a `<button>`.
   * @default false
   */
  asChild?: boolean;
  /** Leading icon (any ReactNode — lucide, SVG, emoji, etc.). */
  startIcon?: ReactNode;
  /** Trailing icon. */
  endIcon?: ReactNode;
  /**
   * Show a sketchy spinner and disable interaction.
   * @default false
   */
  loading?: boolean;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Clickable control with rough.js border and HTML label.
 *
 * @example
 * <Button variant="primary">Save</Button>
 * <Button asChild><a href="/docs">Docs</a></Button>
 *
 * @see Input
 */
export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
      children,
      className,
      style,
      variant = "primary",
      size: sizeProp = "md",
      asChild = false,
      startIcon,
      endIcon,
      loading = false,
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      hachureGap,
      hachureAngle,
      fillWeight,
      disabled,
      animate,
      onMouseEnter,
      onMouseLeave,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...rest
    },
    ref,
  ) {
    const size = resolveSize(sizeProp);
    const rootRef = useRef<HTMLButtonElement>(null);
    const [hovered, setHovered] = useState(false);
    const theme = useSketchTheme(sketchColor);
    const shouldAnimate = useAnimate(animate);
    const resolvedSeed = useResolvedSeed(seed);
    const hoverSeed = deriveSeed(resolvedSeed, "hover");
    const interactive = resolveInteractiveState({ disabled, loading });
    const sketchSeed =
      shouldAnimate && hovered && !interactive.isDisabled
        ? hoverSeed
        : resolvedSeed;
    const ink = sketchColor ?? theme.ink;

    const fill =
      variant === "primary"
        ? theme.isDark
          ? sketchColor
            ? `${sketchColor}28`
            : theme.accentFill
          : theme.accentFill
        : variant === "secondary"
          ? theme.secondaryFill
          : hovered && variant === "ghost"
            ? theme.isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(31,29,26,0.05)"
            : undefined;

    const stroke =
      variant === "ghost" && !hovered
        ? "transparent"
        : variant === "primary"
          ? (sketchColor ?? theme.accent)
          : ink;

    const textColor =
      variant === "primary"
        ? (sketchColor ?? (theme.isDark ? "#ffffff" : ink))
        : ink;

    useDrawIn(rootRef, DRAW_IN_DURATION_MS, shouldAnimate, sketchSeed);

    const hasIcon = Boolean(startIcon || endIcon || loading);
    const hasText = hasVisibleTextContent(children);
    warnIfMissingAriaLabel("Button", {
      hasTextContent: hasText,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      hasIcon,
    });

    const Comp = asChild ? Slot : "button";

    const leading = loading ? (
      <Spinner
        size={size}
        sketchColor={textColor}
        animate={shouldAnimate}
        aria-hidden
        style={{ position: "relative", zIndex: 1 }}
      />
    ) : startIcon ? (
      <DoodleIcon size={size} style={{ position: "relative", zIndex: 1 }}>
        {startIcon}
      </DoodleIcon>
    ) : null;

    const trailing =
      !loading && endIcon ? (
        <DoodleIcon size={size} style={{ position: "relative", zIndex: 1 }}>
          {endIcon}
        </DoodleIcon>
      ) : null;

    return (
      <Comp
        ref={(node: HTMLButtonElement | null) => {
          (rootRef as MutableRefObject<HTMLButtonElement | null>).current =
            node;
          assignRef(ref, node);
        }}
        type={asChild ? undefined : "button"}
        className={cn(className)}
        disabled={asChild ? undefined : interactive.isDisabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-disabled={interactive.aria["aria-disabled"]}
        aria-busy={interactive.aria["aria-busy"]}
        onMouseEnter={(event: MouseEvent<HTMLButtonElement>) => {
          if (!interactive.isDisabled) setHovered(true);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event: MouseEvent<HTMLButtonElement>) => {
          setHovered(false);
          onMouseLeave?.(event);
        }}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          background: "transparent",
          color: textColor,
          fontFamily: doodleUiFontFamily,
          fontWeight: doodleUiFontWeight(600),
          lineHeight: 1.2,
          ...CONTROL_SIZE_STYLES[size],
          ...interactive.style,
          cursor: interactive.isDisabled
            ? "not-allowed"
            : ((style as CSSProperties | undefined)?.cursor ?? "pointer"),
          ...style,
        }}
        {...rest}
      >
        <RoughSvg
          shape="rectangle"
          roughness={roughness}
          seed={sketchSeed}
          sketchColor={stroke}
          bowing={bowing}
          fillStyle={fillStyle ?? (fill ? "hachure" : undefined)}
          fill={fill}
          hachureGap={hachureGap ?? 7}
          hachureAngle={hachureAngle}
          fillWeight={fillWeight ?? 1}
          strokeWidth={
            !shouldAnimate && hovered
              ? (strokeWidth ?? 1.75) + 0.4
              : strokeWidth
          }
        />
        {leading}
        {asChild ? (
          <Slottable>{children}</Slottable>
        ) : (
          <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
        )}
        {trailing}
      </Comp>
    );
  }),
);
Button.displayName = "Button";
