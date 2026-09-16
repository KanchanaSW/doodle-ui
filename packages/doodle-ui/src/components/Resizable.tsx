"use client";

import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";
import * as ResizablePrimitive from "react-resizable-panels";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import type { SketchProps } from "../types";
import { cn, deriveSeed } from "../utils";

export type ResizablePanelGroupProps = ComponentPropsWithoutRef<
  typeof ResizablePrimitive.PanelGroup
> &
  SketchProps;

export function ResizablePanelGroup({
  className,
  style,
  ...rest
}: ResizablePanelGroupProps) {
  return (
    <ResizablePrimitive.PanelGroup
      className={cn(className)}
      style={{ display: "flex", width: "100%", height: "100%", ...style }}
      {...rest}
    />
  );
}

export const ResizablePanel = ResizablePrimitive.Panel;

export interface ResizableHandleProps
  extends ComponentPropsWithoutRef<typeof ResizablePrimitive.PanelResizeHandle>,
    SketchProps {
  withHandle?: boolean;
}

export function ResizableHandle({
  className,
  style,
  withHandle = true,
  roughness,
  seed,
  sketchColor,
  bowing,
  strokeWidth,
  ...rest
}: ResizableHandleProps) {
  const resolvedSeed = useResolvedSeed(seed);
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;
  const handleSeed = deriveSeed(resolvedSeed, "handle");

  const base: CSSProperties = {
    position: "relative",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    touchAction: "none",
    ...style,
  };

  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(className)}
      style={base}
      {...rest}
    >
      {withHandle ? (
        <div
          style={{
            position: "relative",
            width: 14,
            height: 28,
            zIndex: 1,
          }}
        >
          <RoughSvg
            shape="line-vertical"
            roughness={roughness ?? 1.8}
            seed={handleSeed}
            sketchColor={ink}
            bowing={bowing ?? 1.5}
            strokeWidth={strokeWidth ?? 2.4}
            width={14}
            height={28}
            inset={2}
          />
          <RoughSvg
            shape="ellipse"
            roughness={(roughness ?? 1.5) + 0.2}
            seed={deriveSeed(handleSeed, "dot-a")}
            sketchColor={ink}
            width={14}
            height={28}
            strokeWidth={1.2}
            inset={5}
            style={{ opacity: 0.55 }}
          />
        </div>
      ) : null}
    </ResizablePrimitive.PanelResizeHandle>
  );
}
