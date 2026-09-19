"use client";

import {
  forwardRef,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useAnimate, useTweenNumber } from "../animations";
import { useBaseRoughness } from "../hooks/useSketchDefaults";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

export type RadialProgressSize = "sm" | "md" | "lg";

const SIZE_PX: Record<RadialProgressSize, number> = {
  sm: 120,
  md: 180,
  lg: 240,
};

const VIEWBOX = 200;
const CENTER = VIEWBOX / 2;
const BASE_INNER_R = 62;
const BASE_OUTER_R = 88;
const WAVE_AMPLITUDE = 6;
const WAVE_FREQUENCY = 2;

export interface RadialProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color" | "children">,
    SketchProps {
  /**
   * Current progress value (determinate mode).
   * When undefined, operates in indeterminate loading wave mode.
   * @default undefined
   */
  value?: number;
  /**
   * Maximum value for progress calculation.
   * @default 100
   */
  max?: number;
  /**
   * Overall diameter size preset or custom pixel number.
   * @default "md"
   */
  size?: RadialProgressSize | number;
  /**
   * Total number of radial tick bars along the arc.
   * @default 48
   */
  tickCount?: number;
  /**
   * Start angle in degrees (0° = top / 12 o'clock, clockwise).
   * Default `225` starts at bottom-left so the open gap sits at the bottom.
   * @default 225
   */
  startAngle?: number;
  /**
   * Sweep angle in degrees of the open arc.
   * @default 270
   */
  sweepAngle?: number;
  /**
   * Active tick color. Defaults to theme success green.
   */
  activeColor?: string;
  /**
   * Inactive tick color. Defaults to muted track ink.
   */
  trackColor?: string;
  /**
   * Whether to display the center value / children.
   * @default true
   */
  showValue?: boolean;
  /**
   * Custom formatter for center text when `children` is omitted.
   */
  formatValue?: (value: number, max: number) => ReactNode;
  /**
   * Custom center content. Overrides the default percentage label.
   */
  children?: ReactNode;
  /**
   * Play wave animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
  /**
   * Wave animation speed in seconds per full cycle.
   * @default 2
   */
  waveSpeed?: number;
}

// Deterministic 0–1 noise from seed + index (no Math.random in render).
function seededUnit(seed: number, index: number): number {
  const x = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Radial tick-gauge progress and loading indicator with a traveling height wave.
 *
 * @example
 * <RadialProgress value={75} />
 * <RadialProgress />
 */
export const RadialProgress = forwardRef<HTMLDivElement, RadialProgressProps>(
  function RadialProgress(
    {
      className,
      style,
      value,
      max = 100,
      size = "md",
      tickCount = 48,
      startAngle = 225,
      sweepAngle = 270,
      activeColor,
      trackColor,
      showValue = true,
      formatValue,
      children,
      roughness,
      seed,
      sketchColor,
      bowing: _bowing,
      fillStyle: _fillStyle,
      strokeWidth,
      hachureGap: _hachureGap,
      hachureAngle: _hachureAngle,
      fillWeight: _fillWeight,
      animate,
      waveSpeed = 2,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const px = typeof size === "number" ? size : SIZE_PX[size];
    const resolvedSeed = useResolvedSeed(seed);
    const baseRoughness = useBaseRoughness();
    const theme = useSketchTheme(sketchColor);
    const shouldAnimate = useAnimate(animate);

    const ink = activeColor ?? sketchColor ?? theme.success;
    const track =
      trackColor ??
      (theme.isDark ? "rgba(243, 244, 246, 0.28)" : "rgba(31, 29, 26, 0.22)");

    const isDeterminate = value !== undefined;
    const clamped = isDeterminate
      ? Math.min(max, Math.max(0, value))
      : 0;
    const percent = max === 0 ? 0 : (clamped / max) * 100;
    const displayed = useTweenNumber(
      isDeterminate ? percent : 0,
      shouldAnimate && isDeterminate,
      420,
    );

    const [phase, setPhase] = useState(0);

    useEffect(() => {
      if (!shouldAnimate) {
        setPhase(0);
        return;
      }
      let frame = 0;
      const start = performance.now();
      const periodMs = Math.max(0.4, waveSpeed) * 1000;
      const tick = (now: number) => {
        setPhase((((now - start) % periodMs) / periodMs) * Math.PI * 2);
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }, [shouldAnimate, waveSpeed]);

    const rough = roughness ?? baseRoughness;
    const tickStroke = strokeWidth ?? Math.max(2, 2.4 + rough * 0.15);
    const activeTickCount = isDeterminate
      ? Math.round((displayed / 100) * tickCount)
      : tickCount;

    const ticks = useMemo(() => {
      const count = Math.max(2, Math.floor(tickCount));
      const items: Array<{
        key: number;
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        active: boolean;
        opacity: number;
      }> = [];

      for (let i = 0; i < count; i += 1) {
        const u = count === 1 ? 0 : i / (count - 1);
        const jitter =
          (seededUnit(resolvedSeed, i) - 0.5) * rough * 1.8;
        const angleDeg = startAngle + u * sweepAngle + jitter;
        const angle = degToRad(angleDeg - 90); // SVG: 0° = top

        const wave = shouldAnimate
          ? Math.sin(2 * Math.PI * WAVE_FREQUENCY * u - phase)
          : 0;

        let lengthBoost = WAVE_AMPLITUDE * wave;
        let opacity = 1;

        if (isDeterminate) {
          const active = i < activeTickCount;
          if (active) {
            opacity = 0.85 + 0.15 * ((wave + 1) / 2);
          } else {
            lengthBoost *= 0.25;
            opacity = 0.55;
          }
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const outerR = BASE_OUTER_R + lengthBoost;
          items.push({
            key: i,
            x1: CENTER + cos * BASE_INNER_R,
            y1: CENTER + sin * BASE_INNER_R,
            x2: CENTER + cos * outerR,
            y2: CENTER + sin * outerR,
            active,
            opacity,
          });
        } else {
          // Indeterminate: traveling wave packet around the dial
          const packet = (wave + 1) / 2;
          lengthBoost = WAVE_AMPLITUDE * (0.35 + 0.65 * packet);
          opacity = 0.35 + 0.65 * packet;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const outerR = BASE_OUTER_R + lengthBoost;
          items.push({
            key: i,
            x1: CENTER + cos * BASE_INNER_R,
            y1: CENTER + sin * BASE_INNER_R,
            x2: CENTER + cos * outerR,
            y2: CENTER + sin * outerR,
            active: packet > 0.45,
            opacity,
          });
        }
      }
      return items;
    }, [
      tickCount,
      startAngle,
      sweepAngle,
      resolvedSeed,
      rough,
      shouldAnimate,
      phase,
      isDeterminate,
      activeTickCount,
    ]);

    const label = (() => {
      if (!showValue) return null;
      if (children !== undefined) return children;
      if (!isDeterminate) return null;
      if (formatValue) return formatValue(clamped, max);
      return `${Math.round(displayed)}%`;
    })();

    const boxStyle: CSSProperties = {
      position: "relative",
      width: px,
      height: px,
      flexShrink: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    };

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={isDeterminate ? clamped : undefined}
        aria-busy={!isDeterminate || undefined}
        aria-label={ariaLabel ?? (isDeterminate ? undefined : "Loading")}
        className={cn(className)}
        style={boxStyle}
        {...rest}
      >
        <svg
          width={px}
          height={px}
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          aria-hidden="true"
          focusable="false"
          style={{ display: "block", overflow: "visible" }}
        >
          {ticks.map((tick) => (
            <line
              key={tick.key}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={tick.active ? ink : track}
              strokeWidth={tickStroke}
              strokeLinecap="round"
              opacity={tick.opacity}
            />
          ))}
        </svg>
        {label != null ? (
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              fontFamily: doodleUiFontFamily,
              fontWeight: doodleUiFontWeight(600),
              fontSize: px * 0.16,
              lineHeight: 1,
              color: theme.isDark ? "#ffffff" : theme.ink,
              letterSpacing: "-0.02em",
            }}
          >
            {label}
          </span>
        ) : null}
      </div>
    );
  },
);

RadialProgress.displayName = "RadialProgress";
