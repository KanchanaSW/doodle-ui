"use client";

import {
  forwardRef,
  memo,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { SketchBox, type SketchBoxProps } from "../primitives/SketchBox";
import { useSketchTheme } from "../hooks/useSketchTheme";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

type SketchPartProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> &
  Pick<SketchProps, "roughness" | "seed" | "sketchColor">;

/**
 * Props for {@link Card}.
 */
export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color" | "title">,
    SketchProps {
  shadow?: boolean;
  fill?: string;
  /** @deprecated Prefer `<Card.Header><Card.Title>` compound parts. */
  title?: ReactNode;
  /** @deprecated Prefer `<Card.Footer>` compound part. */
  footer?: ReactNode;
  /**
   * Merge props onto the single child instead of rendering a `<div>`.
   * @default false
   */
  asChild?: boolean;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Content container with optional offset shadow.
 *
 * @example
 * <Card>
 *   <Card.Header><Card.Title>Notes</Card.Title></Card.Header>
 *   <Card.Content>Body</Card.Content>
 * </Card>
 */
const CardRoot = memo(
  forwardRef<HTMLDivElement, CardProps>(function Card(
    {
      children,
      className,
      style,
      shadow = true,
      fill,
      title,
      footer,
      asChild = false,
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

    const boxProps: SketchBoxProps = {
      shadow,
      fill,
      roughness,
      seed,
      sketchColor: ink,
      bowing,
      fillStyle,
      strokeWidth,
      hachureGap,
      hachureAngle,
      fillWeight,
      animate,
      asChild,
    };

    return (
      <SketchBox
        ref={ref}
        className={cn(className)}
        style={{
          color: ink,
          ...style,
        }}
        contentStyle={{ padding: "16px 18px" }}
        {...boxProps}
        {...rest}
      >
        {asChild ? (
          children
        ) : (
          <>
            {title ? (
              <div
                style={{
                  fontWeight: doodleUiFontWeight(700),
                  fontSize: 16,
                  marginBottom: 10,
                  color: ink,
                }}
              >
                {title}
              </div>
            ) : null}
            {children}
            {footer ? (
              <div
                style={{ marginTop: 14, fontSize: 13, opacity: 0.8, color: ink }}
              >
                {footer}
              </div>
            ) : null}
          </>
        )}
      </SketchBox>
    );
  }),
);
CardRoot.displayName = "Card";

export const CardHeader = memo(
  forwardRef<HTMLDivElement, SketchPartProps>(function CardHeader(
    { className, style, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          marginBottom: 10,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = memo(
  forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    function CardTitle({ className, style, children, ...rest }, ref) {
      return (
        <h3
          ref={ref}
          className={cn(className)}
          style={{
            margin: 0,
            fontFamily: doodleUiFontFamily,
            fontWeight: doodleUiFontWeight(700),
            fontSize: 16,
            lineHeight: 1.3,
            ...style,
          }}
          {...rest}
        >
          {children}
        </h3>
      );
    },
  ),
);
CardTitle.displayName = "CardTitle";

export const CardDescription = memo(
  forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    function CardDescription({ className, style, children, ...rest }, ref) {
      return (
        <p
          ref={ref}
          className={cn(className)}
          style={{
            margin: 0,
            fontFamily: doodleUiFontFamily,
            fontSize: 13,
            lineHeight: 1.45,
            opacity: 0.75,
            ...style,
          }}
          {...rest}
        >
          {children}
        </p>
      );
    },
  ),
);
CardDescription.displayName = "CardDescription";

export const CardContent = memo(
  forwardRef<HTMLDivElement, SketchPartProps>(function CardContent(
    { className, style, children, ...rest },
    ref,
  ) {
    return (
      <div ref={ref} className={cn(className)} style={style} {...rest}>
        {children}
      </div>
    );
  }),
);
CardContent.displayName = "CardContent";

export const CardFooter = memo(
  forwardRef<HTMLDivElement, SketchPartProps>(function CardFooter(
    { className, style, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 14,
          fontSize: 13,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }),
);
CardFooter.displayName = "CardFooter";

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
