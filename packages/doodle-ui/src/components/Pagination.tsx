"use client";

import { useSketchDefaults } from "../hooks/useSketchDefaults";
import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from "react";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import type { SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

const PREV_PATH = "M 12 4 L 6 10 L 12 16";
const NEXT_PATH = "M 6 4 L 12 10 L 6 16";

function pageItems(page: number, count: number): Array<number | "ellipsis"> {
  if (count <= 7) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(count - 1, page + 1);
  if (start > 2) items.push("ellipsis");
  for (let n = start; n <= end; n += 1) items.push(n);
  if (end < count - 1) items.push("ellipsis");
  items.push(count);
  return items;
}

/**
 * Props for {@link Pagination}.
 */
export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, "color" | "onChange">,
    SketchProps {
  page: number;
  count: number;
  onPageChange?: (page: number) => void;
}

/**
 * Page number controls with circled buttons.
 *
 * @example
 * <Pagination />
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
    {
      className,
      style,
      page,
      count,
      onPageChange,
      roughness,
      seed,
      sketchColor,
      bowing,
      strokeWidth,
      ...rest
    },
    ref,
  ) {
    const { roughness: baseRoughness } = useSketchDefaults();
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const accent = sketchColor ?? theme.accent;
    const accentFill = theme.isDark
      ? (sketchColor ? `${sketchColor}25` : theme.accentFill)
      : theme.accentFill;
    const resolvedSeed = useResolvedSeed(seed);
    const items = pageItems(page, count);

    return (
      <nav
        ref={ref}
        className={cn(className)}
        aria-label="Pagination"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          color: ink,
          ...style,
        }}
        {...rest}
      >
        <PageButton
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange?.(Math.max(1, page - 1))}
          roughness={roughness}
          seed={deriveSeed(resolvedSeed, "prev")}
          ink={ink}
          accent={accent}
          accentFill={accentFill}
          isDark={theme.isDark}
          bowing={bowing}
          strokeWidth={strokeWidth}
        >
          <span style={{ position: "relative", width: 16, height: 16, display: "block" }}>
            <RoughSvg
              shape="path"
              path={PREV_PATH}
              roughness={(roughness ?? baseRoughness) * 0.7}
              seed={deriveSeed(resolvedSeed, "prev-arrow")}
              sketchColor={ink}
              strokeWidth={(strokeWidth ?? 1.5) + 0.2}
              inset={0}
            />
          </span>
        </PageButton>
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`e-${index}`}
              style={{
                width: 28,
                textAlign: "center",
                fontFamily: doodleUiFontFamily,
                color: ink,
              }}
            >
              …
            </span>
          ) : (
            <PageButton
              key={item}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              active={item === page}
              onClick={() => onPageChange?.(item)}
              roughness={roughness}
              seed={deriveSeed(resolvedSeed, `page-${item}`)}
              ink={ink}
              accent={accent}
              accentFill={accentFill}
              isDark={theme.isDark}
              bowing={bowing}
              strokeWidth={strokeWidth}
            >
              {item}
            </PageButton>
          ),
        )}
        <PageButton
          aria-label="Next page"
          disabled={page >= count}
          onClick={() => onPageChange?.(Math.min(count, page + 1))}
          roughness={roughness}
          seed={deriveSeed(resolvedSeed, "next")}
          ink={ink}
          accent={accent}
          accentFill={accentFill}
          isDark={theme.isDark}
          bowing={bowing}
          strokeWidth={strokeWidth}
        >
          <span style={{ position: "relative", width: 16, height: 16, display: "block" }}>
            <RoughSvg
              shape="path"
              path={NEXT_PATH}
              roughness={(roughness ?? baseRoughness) * 0.7}
              seed={deriveSeed(resolvedSeed, "next-arrow")}
              sketchColor={ink}
              strokeWidth={(strokeWidth ?? 1.5) + 0.2}
              inset={0}
            />
          </span>
        </PageButton>
      </nav>
    );
  },
);

interface PageButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  active?: boolean;
  roughness?: number;
  seed?: number;
  ink: string;
  accent?: string;
  accentFill?: string;
  isDark?: boolean;
  bowing?: number;
  strokeWidth?: number;
}

function PageButton({
  children,
  className,
  style,
  active,
  disabled,
  roughness,
  seed,
  ink,
  accent,
  accentFill,
  isDark,
  bowing,
  strokeWidth,
  ...rest
}: PageButtonProps) {
  const { roughness: baseRoughness } = useSketchDefaults();
  const activeColor = accent ?? ink;
  const textColor = active ? (isDark ? "#ffffff" : activeColor) : ink;

  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(className)}
      style={{
        position: "relative",
        width: 36,
        height: 36,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        color: textColor,
        fontFamily: doodleUiFontFamily,
        fontWeight: active ? doodleUiFontWeight(700) : doodleUiFontWeight(400),
        fontSize: 14,
        outline: "none",
        opacity: disabled ? 0.4 : 1,
        ...style,
      }}
      {...rest}
    >
      <RoughSvg
        shape="ellipse"
        roughness={roughness}
        seed={seed}
        sketchColor={active ? activeColor : ink}
        bowing={bowing}
        fill={active ? accentFill : undefined}
        fillStyle={active ? "hachure" : undefined}
        strokeWidth={active ? (strokeWidth ?? 1.6) + 0.3 : strokeWidth ?? 1.4}
        inset={1.5}
      />
      {active ? (
        <RoughSvg
          shape="ellipse"
          roughness={(roughness ?? baseRoughness) + 0.45}
          seed={seed}
          sketchColor={activeColor}
          bowing={bowing ?? 1.6}
          strokeWidth={1.1}
          inset={-1.5}
          style={{ opacity: 0.7 }}
        />
      ) : null}
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </button>
  );
}
