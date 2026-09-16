"use client";

import { useSketchDefaults } from "../hooks/useSketchDefaults";
import { forwardRef } from "react";
import { RoughSvg } from "../primitives/RoughSvg";
import {
  SlidingPanelClose,
  SlidingPanelContent,
  SlidingPanelDescription,
  SlidingPanelFooter,
  SlidingPanelHeader,
  SlidingPanelRoot,
  SlidingPanelTitle,
  SlidingPanelTrigger,
  useSlidingPanelSketch,
  type SlidingPanelContentProps,
  type SlidingPanelRootProps,
} from "../primitives/SlidingPanel";
import { deriveSeed } from "../utils";

export type DrawerProps = Omit<SlidingPanelRootProps, "side">;

/**
 * Bottom sheet drawer with drag handle.
 *
 * @example
 * <Drawer />
 */
export function Drawer(props: DrawerProps) {
  return <SlidingPanelRoot side="bottom" {...props} />;
}

export const DrawerTrigger = SlidingPanelTrigger;
export const DrawerClose = SlidingPanelClose;

export const DrawerHandle = forwardRef<HTMLDivElement, { className?: string }>(
  function DrawerHandle({ className }, ref) {
    const { roughness: baseRoughness } = useSketchDefaults();
    const sketch = useSlidingPanelSketch();
    return (
      <div
        ref={ref}
        className={className}
        style={{
          position: "relative",
          width: 48,
          height: 10,
          margin: "0 auto 12px",
        }}
        aria-hidden
      >
        <RoughSvg
          shape="line"
          roughness={(sketch.roughness ?? baseRoughness) + 0.3}
          seed={deriveSeed(sketch.resolvedSeed, "drawer-handle")}
          sketchColor={sketch.sketchColor ?? sketch.ink}
          bowing={sketch.bowing ?? 1.6}
          strokeWidth={2.4}
          width={48}
          height={10}
          inset={2}
        />
      </div>
    );
  },
);

export type DrawerContentProps = Omit<SlidingPanelContentProps, "chrome">;

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  function DrawerContent({ children, ...rest }, ref) {
    return (
      <SlidingPanelContent
        ref={ref}
        chrome={<DrawerHandle />}
        contentStyle={{ paddingTop: 8 }}
        {...rest}
      >
        {children}
      </SlidingPanelContent>
    );
  },
);

export const DrawerHeader = SlidingPanelHeader;
export const DrawerFooter = SlidingPanelFooter;
export const DrawerTitle = SlidingPanelTitle;
export const DrawerDescription = SlidingPanelDescription;
