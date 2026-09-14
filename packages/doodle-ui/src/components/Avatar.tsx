"use client";

import { forwardRef, type CSSProperties, type ReactNode } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type RoughShape, type SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { deriveSeed } from "../utils";

export type AvatarStatus = "online" | "offline" | "busy";
export type AvatarShape = "circle" | "square";

const STATUS_COLOR: Record<AvatarStatus, string> = {
  online: SKETCH_COLORS.success,
  offline: "#8a8680",
  busy: SKETCH_COLORS.accent,
};

export interface AvatarProps
  extends Omit<AvatarPrimitive.AvatarProps, "asChild">,
    SketchProps {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  size?: number;
  shape?: AvatarShape;
  status?: AvatarStatus;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  function Avatar(
    {
      className,
      style,
      src,
      alt,
      fallback,
      size = 40,
      shape = "circle",
      status,
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      ...rest
    },
    ref,
  ) {
    const ink = sketchColor ?? SKETCH_COLORS.ink;
    const resolvedSeed = useResolvedSeed(seed);
    const roughShape: RoughShape = shape === "circle" ? "ellipse" : "rectangle";
    const badge = 12;
    const rootStyle: CSSProperties = {
      position: "relative",
      display: "inline-flex",
      width: size,
      height: size,
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
          fill="#f7f6f2"
          strokeWidth={strokeWidth ?? 1.6}
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
              fontSize: Math.max(12, size * 0.36),
              color: ink,
              background: SKETCH_COLORS.secondaryFill,
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
              roughness={(roughness ?? 1.5) * 0.8}
              seed={deriveSeed(resolvedSeed, "status")}
              sketchColor={STATUS_COLOR[status]}
              fill={STATUS_COLOR[status]}
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
