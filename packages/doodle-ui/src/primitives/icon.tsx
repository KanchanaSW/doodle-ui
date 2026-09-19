"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { SIZE_TOKENS, resolveSize, type DoodleSize } from "./size";

export interface IconSlotProps {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export interface DoodleIconProps {
  children: ReactNode;
  size?: DoodleSize;
  className?: string;
  style?: CSSProperties;
}

/**
 * Wraps an icon node and forces SVG/`width`/`height` to match the shared
 * size scale so leading/trailing icons stay proportional across components.
 */
export function DoodleIcon({
  children,
  size = "md",
  className,
  style,
}: DoodleIconProps) {
  const px = SIZE_TOKENS[resolveSize(size)].iconSize;

  if (isValidElement(children)) {
    const el = children as ReactElement<{
      width?: number | string;
      height?: number | string;
      style?: CSSProperties;
      className?: string;
    }>;
    return cloneElement(el, {
      width: el.props.width ?? px,
      height: el.props.height ?? px,
      className:
        [el.props.className, className].filter(Boolean).join(" ") || undefined,
      style: {
        width: px,
        height: px,
        flexShrink: 0,
        display: "inline-block",
        verticalAlign: "middle",
        fontSize: px,
        ...el.props.style,
        ...style,
      },
    });
  }

  return (
    <span
      className={className}
      aria-hidden
      style={{
        width: px,
        height: px,
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: px,
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/**
 * Dev-mode warning when an interactive icon-only control lacks an accessible name.
 */
export function warnIfMissingAriaLabel(
  componentName: string,
  opts: {
    hasTextContent: boolean;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    hasIcon: boolean;
  },
): void {
  if (process.env.NODE_ENV === "production") return;
  if (!opts.hasIcon || opts.hasTextContent) return;
  if (opts["aria-label"] || opts["aria-labelledby"]) return;
  // eslint-disable-next-line no-console
  console.warn(
    `[doodleui-react] <${componentName}> is icon-only but missing aria-label / aria-labelledby. ` +
      "Icon-only interactive elements need an accessible name.",
  );
}

/** True when children contain visible text (not just icons / whitespace). */
export function hasVisibleTextContent(children: ReactNode): boolean {
  let found = false;
  Children.forEach(children, (child) => {
    if (found) return;
    if (typeof child === "string" && child.trim().length > 0) found = true;
    else if (typeof child === "number") found = true;
  });
  return found;
}

/** Shared spacing between icon and text content. */
export function iconGap(size?: DoodleSize): number {
  return SIZE_TOKENS[resolveSize(size)].gap;
}
