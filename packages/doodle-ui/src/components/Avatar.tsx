"use client";

import { useBaseRoughness } from "../hooks/useSketchDefaults";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import { resolveAvatarPx, type DoodleSize } from "../primitives/size";
import type { RoughShape, SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

export type AvatarStatus = "online" | "offline" | "busy";
export type AvatarShape = "circle" | "square";

/**
 * Props for {@link Avatar}.
 */
export interface AvatarProps
  extends Omit<AvatarPrimitive.AvatarProps, "asChild">,
    SketchProps {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  /**
   * Avatar size preset or exact pixel dimension.
   * @default "md"
   */
  size?: DoodleSize | number;
  shape?: AvatarShape;
  status?: AvatarStatus;
  fill?: string;
}

/**
 * Profile image or initials in a sketch frame.
 *
 * @example
 * <Avatar />
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  function Avatar(
    {
      className,
      style,
      src,
      alt,
      fallback,
      size: sizeProp = "md",
      shape = "circle",
      status,
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
      ...rest
    },
    ref,
  ) {
    const baseRoughness = useBaseRoughness();
    const sizePx = resolveAvatarPx(sizeProp);
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const resolvedSeed = useResolvedSeed(seed);
    const roughShape: RoughShape = shape === "circle" ? "ellipse" : "rectangle";
    const badge = 12;

    const statusColors: Record<AvatarStatus, string> = {
      online: theme.success,
      offline: theme.isDark ? "#9ca3af" : "#8a8680",
      busy: theme.accent,
    };

    const rootStyle: CSSProperties = {
      position: "relative",
      display: "inline-flex",
      width: sizePx,
      height: sizePx,
      flexShrink: 0,
      verticalAlign: "middle",
      ...style,
    };

    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(className)}
        style={rootStyle}
        {...rest}
      >
        <RoughSvg
          shape={roughShape}
          roughness={roughness}
          seed={resolvedSeed}
          sketchColor={ink}
          bowing={bowing}
          fillStyle={fillStyle ?? "solid"}
          fill={fill ?? theme.paper}
          strokeWidth={strokeWidth ?? 1.6}
          hachureGap={hachureGap}
          hachureAngle={hachureAngle}
          fillWeight={fillWeight}
          inset={1.5}
        />
        <span
          style={{
            position: "absolute",
            inset: 4,
            overflow: "hidden",
            borderRadius: shape === "circle" ? "50%" : 4,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {src ? (
            <AvatarPrimitive.Image
              src={src}
              alt={alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : null}
          <AvatarPrimitive.Fallback
            delayMs={src ? 400 : 0}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: doodleUiFontFamily,
              fontWeight: doodleUiFontWeight(650),
              fontSize: Math.max(12, sizePx * 0.36),
              color: ink,
              background: theme.secondaryFill,
            }}
          >
            {fallback}
          </AvatarPrimitive.Fallback>
        </span>
        {status ? (
          <span
            style={{
              position: "absolute",
              width: badge,
              height: badge,
              right: -1,
              bottom: -1,
              zIndex: 2,
            }}
          >
            <RoughSvg
              shape="ellipse"
              roughness={(roughness ?? baseRoughness) * 0.8}
              seed={deriveSeed(resolvedSeed, "status")}
              sketchColor={statusColors[status]}
              fill={statusColors[status]}
              fillStyle="solid"
              bowing={bowing}
              strokeWidth={1}
              inset={0.5}
            />
          </span>
        ) : null}
      </AvatarPrimitive.Root>
    );
  },
);
