"use client";

import {
  forwardRef,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import {
  DRAW_IN_DURATION_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useBaseRoughness } from "../hooks/useSketchDefaults";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import type { SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily } from "../utils";

export type RadialMenuSize = "sm" | "md" | "lg";

const SIZE_PX: Record<RadialMenuSize, { trigger: number; item: number; radius: number }> = {
  sm: { trigger: 40, item: 32, radius: 72 },
  md: { trigger: 52, item: 40, radius: 88 },
  lg: { trigger: 64, item: 48, radius: 108 },
};

/** Degrees: 0 = right, 90 = up. Arc from ~200° to ~-20° (above). */
function itemOffset(
  index: number,
  count: number,
  radius: number,
): { x: number; y: number } {
  if (count <= 0) return { x: 0, y: 0 };
  const startDeg = 200;
  const endDeg = -20;
  const t = count === 1 ? 0.5 : index / (count - 1);
  const deg = startDeg + (endDeg - startDeg) * t;
  const rad = (deg * Math.PI) / 180;
  return { x: Math.cos(rad) * radius, y: -Math.sin(rad) * radius };
}

export interface RadialMenuItem {
  id: string;
  icon: ReactNode;
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface RadialMenuProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "color" | "onSelect">,
    SketchProps {
  items: RadialMenuItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  radius?: number;
  size?: RadialMenuSize;
  animate?: boolean;
  /** Accessible name for the trigger button. @default "Open menu" */
  "aria-label"?: string;
}

/**
 * Sketch-styled radial action menu with a rotating `+` trigger and semicircle fan-out.
 */
export const RadialMenu = forwardRef<HTMLDivElement, RadialMenuProps>(
  function RadialMenu(
    {
      className,
      style,
      items,
      open,
      defaultOpen,
      onOpenChange,
      radius: radiusProp,
      size = "md",
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      hachureGap: _hachureGap,
      hachureAngle: _hachureAngle,
      fillWeight: _fillWeight,
      animate,
      "aria-label": ariaLabel = "Open menu",
      ...rest
    },
    ref,
  ) {
    const sizeTokens = SIZE_PX[size];
    const triggerPx = sizeTokens.trigger;
    const itemPx = sizeTokens.item;
    const radius = radiusProp ?? sizeTokens.radius;

    const [uncontrolled, setUncontrolled] = useState(defaultOpen ?? false);
    const isOpen = open ?? uncontrolled;

    const menuId = useId();
    const triggerSketchRef = useRef<HTMLSpanElement>(null);
    const resolvedSeed = useResolvedSeed(seed);
    const baseRoughness = useBaseRoughness();
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const shouldAnimate = useAnimate(animate);

    useDrawIn(triggerSketchRef, DRAW_IN_DURATION_MS, shouldAnimate, resolvedSeed);

    const outerPad = 8;
    const spread = radius + itemPx / 2 + outerPad;
    const boxW = Math.max(triggerPx, spread * 2);
    const boxH = spread + triggerPx / 2 + outerPad;

    const handleToggle = () => {
      const next = !isOpen;
      setUncontrolled(next);
      onOpenChange?.(next);
    };

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          position: "relative",
          width: boxW,
          height: boxH,
          color: ink,
          fontFamily: doodleUiFontFamily,
          ...style,
        }}
        {...rest}
      >
        <div
          id={menuId}
          role="menu"
          aria-hidden={!isOpen}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          {items.map((item, index) => {
            const { x, y } = itemOffset(index, items.length, radius);
            const itemSeed = deriveSeed(resolvedSeed, item.id);
            return (
              <motion.div
                key={item.id}
                initial={false}
                animate={
                  isOpen
                    ? { x, y, scale: 1, opacity: 1 }
                    : { x: 0, y: 0, scale: 0, opacity: 0 }
                }
                transition={{
                  delay: shouldAnimate && isOpen ? index * 0.035 : 0,
                  duration: shouldAnimate ? 0.32 : 0,
                  ease: "easeOut",
                }}
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: triggerPx / 2,
                  width: itemPx,
                  height: itemPx,
                  marginLeft: -itemPx / 2,
                  marginBottom: -itemPx / 2,
                  zIndex: 1,
                }}
              >
                <button
                  type="button"
                  role="menuitem"
                  aria-label={item.label}
                  tabIndex={isOpen && !item.disabled ? 0 : -1}
                  disabled={item.disabled}
                  onClick={() => item.onSelect?.()}
                  style={{
                    position: "relative",
                    width: itemPx,
                    height: itemPx,
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    cursor: item.disabled ? "not-allowed" : "pointer",
                    color: ink,
                    outline: "none",
                    opacity: item.disabled ? 0.4 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RoughSvg
                    shape="ellipse"
                    roughness={roughness ?? baseRoughness}
                    seed={itemSeed}
                    sketchColor={ink}
                    bowing={bowing}
                    fill={theme.paper}
                    fillStyle={fillStyle ?? "solid"}
                    strokeWidth={strokeWidth ?? 1.4}
                    inset={1.5}
                  />
                  <span style={{ position: "relative", zIndex: 1 }}>{item.icon}</span>
                </button>
              </motion.div>
            );
          })}
        </div>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-controls={menuId}
          aria-label={ariaLabel}
          onClick={handleToggle}
          style={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            width: triggerPx,
            height: triggerPx,
            marginLeft: -triggerPx / 2,
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: ink,
            outline: "none",
            zIndex: 2,
          }}
        >
          <span
            ref={triggerSketchRef}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            <RoughSvg
              shape="ellipse"
              roughness={roughness ?? baseRoughness}
              seed={resolvedSeed}
              sketchColor={ink}
              bowing={bowing}
              fill={theme.paper}
              fillStyle={fillStyle ?? "solid"}
              strokeWidth={strokeWidth ?? 1.5}
              inset={1.5}
            />
          </span>
          <motion.span
            initial={false}
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={
              shouldAnimate
                ? { type: "spring", stiffness: 420, damping: 30 }
                : { duration: 0 }
            }
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <svg
              width={triggerPx * 0.42}
              height={triggerPx * 0.42}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <rect x="11" y="5" width="2" height="14" rx="0.5" />
              <rect x="5" y="11" width="14" height="2" rx="0.5" />
            </svg>
          </motion.span>
        </button>
      </div>
    );
  },
);

RadialMenu.displayName = "RadialMenu";
