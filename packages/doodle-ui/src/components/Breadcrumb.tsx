"use client";

import { useBaseRoughness } from "../hooks/useSketchDefaults";
import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { RoughSvg } from "../primitives/RoughSvg";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily } from "../utils";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { deriveSeed } from "../utils";

const SLASH_PATH = "M 10 3 L 6 15";
const CHEVRON_PATH = "M 5 4 L 11 9 L 5 14";

export type BreadcrumbSeparator = "slash" | "chevron";

interface BreadcrumbSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  separator: BreadcrumbSeparator;
}

const BreadcrumbSketchContext =
  createContext<BreadcrumbSketchContextValue | null>(null);

function useBreadcrumbSketch(): BreadcrumbSketchContextValue {
  const ctx = useContext(BreadcrumbSketchContext);
  if (!ctx) {
    throw new Error("BreadcrumbItem must be used inside <Breadcrumb>.");
  }
  return ctx;
}

/**
 * Props for {@link Breadcrumb}.
 */
export interface BreadcrumbProps
  extends Omit<HTMLAttributes<HTMLElement>, "color">,
    SketchProps {
  separator?: BreadcrumbSeparator;
  children?: ReactNode;
}

/**
 * Navigation trail with sketch separators.
 *
 * @example
 * <Breadcrumb />
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  function Breadcrumb(
    {
      className,
      style,
      children,
      separator = "slash",
      roughness,
      seed,
      sketchColor,
      bowing,
      strokeWidth,
      hachureGap,
      hachureAngle,
      fillWeight,
      ...rest
    },
    ref,
  ) {
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const resolvedSeed = useResolvedSeed(seed);
    const items = Children.toArray(children).filter(isValidElement);

    return (
      <BreadcrumbSketchContext.Provider
        value={{
          roughness,
          seed: resolvedSeed,
          sketchColor: ink,
          bowing,
          strokeWidth,
          hachureGap,
          hachureAngle,
          fillWeight,
          resolvedSeed,
          ink,
          separator,
        }}
      >
        <nav
          ref={ref}
          className={cn(className)}
          aria-label="Breadcrumb"
          style={style}
          {...rest}
        >
          <ol
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 4,
              listStyle: "none",
              margin: 0,
              padding: 0,
              fontFamily: doodleUiFontFamily,
              color: ink,
              fontSize: 14,
            }}
          >
            {items.map((child, index) => (
              <li
                key={index}
                style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
              >
                {cloneElement(child as ReactElement<{ index?: number }>, {
                  index,
                })}
                {index < items.length - 1 ? (
                  <SeparatorMark
                    index={index}
                    separator={separator}
                    resolvedSeed={resolvedSeed}
                    roughness={roughness}
                    ink={ink}
                    bowing={bowing}
                    strokeWidth={strokeWidth}
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </nav>
      </BreadcrumbSketchContext.Provider>
    );
  },
);

function SeparatorMark({
  index,
  separator,
  resolvedSeed,
  roughness,
  ink,
  bowing,
  strokeWidth,
}: {
  index: number;
  separator: BreadcrumbSeparator;
  resolvedSeed: number;
  roughness?: number;
  ink: string;
  bowing?: number;
  strokeWidth?: number;
}) {
  const baseRoughness = useBaseRoughness();
  return (
    <span
      aria-hidden="true"
      style={{ position: "relative", width: 16, height: 18, display: "inline-block" }}
    >
      <RoughSvg
        shape="path"
        path={separator === "chevron" ? CHEVRON_PATH : SLASH_PATH}
        roughness={(roughness ?? baseRoughness) * 0.85}
        seed={deriveSeed(resolvedSeed, `sep-${index}`)}
        sketchColor={ink}
        bowing={bowing ?? 1.6}
        strokeWidth={strokeWidth ?? 1.4}
        inset={0}
      />
    </span>
  );
}

/**
 * Props for {@link BreadcrumbItem}.
 */
export interface BreadcrumbItemProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  href?: string;
  current?: boolean;
  index?: number;
  children?: ReactNode;
}

export const BreadcrumbItem = forwardRef<HTMLSpanElement, BreadcrumbItemProps>(
  function BreadcrumbItem(
    { className, style, href, current, children, index: _index, ...rest },
    ref,
  ) {
    const sketch = useBreadcrumbSketch();
    const contentStyle = {
      color: current ? sketch.ink : sketch.ink,
      opacity: current ? 1 : 0.75,
      textDecoration: "none",
      fontFamily: doodleUiFontFamily,
      ...style,
    };

    if (href && !current) {
      return (
        <a
          href={href}
          className={cn(className)}
          style={contentStyle}
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(className)}
        aria-current={current ? "page" : undefined}
        style={contentStyle}
        {...rest}
      >
        {children}
      </span>
    );
  },
);
