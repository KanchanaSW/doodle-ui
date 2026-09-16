import type { CSSProperties, HTMLAttributes } from "react";
import type { Options } from "roughjs/bin/core";

export type FillStyle =
  | "hachure"
  | "solid"
  | "zigzag"
  | "cross-hatch"
  | "dots"
  | "dashed"
  | "zigzag-line";

export type RoughShape = "rectangle" | "ellipse" | "line" | "line-vertical" | "path";

export interface SketchProps {
  /** Sketchiness intensity. Default 1.5 */
  roughness?: number;
  /** Lock the wobble. Omit to follow SketchSeedProvider or randomize on mount */
  seed?: number;
  /** Stroke color override */
  sketchColor?: string;
  /** Line curvature. Default 1 */
  bowing?: number;
  fillStyle?: FillStyle;
  strokeWidth?: number;
  /** Spacing between hatch lines for patterned fills. Defaults to 4 in roughjs, higher = airier */
  hachureGap?: number;
  /** Angle in degrees of the hatch lines */
  hachureAngle?: number;
  /** Weight/thickness of the hatch lines */
  fillWeight?: number;
}

export interface RoughSvgProps extends SketchProps {
  shape?: RoughShape;
  /** Explicit width. Falls back to the parent box via ResizeObserver */
  width?: number;
  height?: number;
  fill?: string;
  /** Inset the drawing from the box edge so strokes are not clipped */
  inset?: number;
  path?: string;
  className?: string;
  style?: CSSProperties;
}

export type PolymorphicClassName = Pick<HTMLAttributes<HTMLElement>, "className" | "style">;

export function toRoughOptions(
  props: SketchProps & { fill?: string; stroke?: string },
): Options {
  const stroke = props.stroke ?? props.sketchColor ?? DEFAULT_INK;
  const options: Options = {
    roughness: props.roughness ?? DEFAULT_ROUGHNESS,
    bowing: props.bowing ?? DEFAULT_BOWING,
    stroke,
    strokeWidth: props.strokeWidth ?? DEFAULT_STROKE_WIDTH,
    seed: props.seed,
  };
  if (props.fill) {
    options.fill = props.fill;
    options.fillStyle = props.fillStyle ?? "hachure";
    if (props.hachureGap !== undefined) options.hachureGap = props.hachureGap;
    if (props.hachureAngle !== undefined) options.hachureAngle = props.hachureAngle;
    if (props.fillWeight !== undefined) options.fillWeight = props.fillWeight;
  }
  return options;
}

export const DEFAULT_ROUGHNESS = 1.5;
export const DEFAULT_BOWING = 1;
export const DEFAULT_STROKE_WIDTH = 1.75;
export const DEFAULT_INK = "#1f1d1a";
export const DEFAULT_DARK_INK = "#f3f4f6";
export const DEFAULT_PAPER = "#f7f6f2";
export const DEFAULT_DARK_PAPER = "#131923";
export const DEFAULT_DARK_CARD_BG = "#131923";
export const DEFAULT_INSET = 3;

export const SKETCH_COLORS = {
  ink: DEFAULT_INK,
  accent: "#e24b3b",
  accentFill: "#f4c4bc",
  secondaryFill: "#d7e3d4",
  paper: "#eef0ea",
  info: "#1d4e89",
  warning: "#c47b17",
  error: "#c0392b",
  success: "#2d6a4f",
} as const;

export const DARK_SKETCH_COLORS = {
  ink: DEFAULT_DARK_INK,
  accent: "#f87171",
  accentFill: "rgba(248, 113, 113, 0.22)",
  secondaryFill: "rgba(255, 255, 255, 0.08)",
  paper: DEFAULT_DARK_PAPER,
  cardBg: DEFAULT_DARK_CARD_BG,
  shadow: "#000000",
  info: "#60a5fa",
  warning: "#fbbf24",
  error: "#f87171",
  success: "#34d399",
} as const;
