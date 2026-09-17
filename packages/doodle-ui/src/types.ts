import type { CSSProperties, HTMLAttributes } from "react";
import type { Options } from "roughjs/bin/core";

/**
 * rough.js fill pattern for sketch shapes that have a `fill` color set.
 * @see https://roughjs.com/
 */
export type FillStyle =
  | "hachure"
  | "solid"
  | "zigzag"
  | "cross-hatch"
  | "dots"
  | "dashed"
  | "zigzag-line";

/**
 * Primitive shape drawn by {@link RoughSvg} / rough.js behind HTML content.
 */
export type RoughShape = "rectangle" | "ellipse" | "line" | "line-vertical" | "path";

/**
 * Shared sketch styling props passed to doodle-ui components and {@link RoughSvg}.
 * Unset fields inherit {@link DoodleUIProvider} defaults, then CSS variables
 * (`--doodle-ui-*`), then library constants such as {@link DEFAULT_ROUGHNESS}.
 */
export interface SketchProps {
  /**
   * Sketchiness intensity passed to rough.js. Higher values look messier.
   * Typical range is `0` (smooth) through `3` (very rough).
   * @default 1.5
   * @example
   * <Button roughness={2.2}>Heavy sketch</Button>
   */
  roughness?: number;
  /**
   * Locks the hand-drawn wobble for this instance. When omitted, uses
   * {@link SketchSeedProvider} seed (Shuffle redraws) or a stable random seed on mount.
   * @default undefined (follow provider or mount random)
   * @example
   * <Card seed={42} title="Stable screenshot" />
   */
  seed?: number;
  /**
   * Stroke (outline) color override. Falls back to theme ink from {@link useSketchTheme}.
   * @default undefined (theme ink)
   * @example
   * <Badge sketchColor="#1d4e89">Info</Badge>
   */
  sketchColor?: string;
  /**
   * How much straight lines bow/curve in rough.js.
   * @default 1
   * @example
   * <Divider bowing={0.3} />
   */
  bowing?: number;
  /**
   * Fill pattern when the shape has a `fill` color. Ignored when there is no fill.
   * @default "hachure" when fill is set
   * @example
   * <Card fill="#eef0ea" fillStyle="cross-hatch" />
   */
  fillStyle?: FillStyle;
  /**
   * Width of sketch strokes in pixels.
   * @default 1.75
   * @example
   * <Input strokeWidth={2.5} label="Bold border" />
   */
  strokeWidth?: number;
  /**
   * Spacing between hatch lines for patterned fills. rough.js default is `4`; higher is airier.
   * @default undefined (rough.js default when fill uses hachure)
   */
  hachureGap?: number;
  /**
   * Angle in degrees of hatch lines for patterned fills.
   * @default undefined (rough.js default)
   */
  hachureAngle?: number;
  /**
   * Weight/thickness of individual hatch lines inside patterned fills.
   * @default undefined (rough.js default)
   */
  fillWeight?: number;
}

/**
 * Props for the low-level {@link RoughSvg} sketch layer.
 */
export interface RoughSvgProps extends SketchProps {
  /**
   * Geometry to draw behind content.
   * @default "rectangle"
   */
  shape?: RoughShape;
  /**
   * Explicit SVG width in pixels. When omitted, measured from the parent box.
   * @default undefined (ResizeObserver)
   */
  width?: number;
  /**
   * Explicit SVG height in pixels. When omitted, measured from the parent box.
   * @default undefined (ResizeObserver)
   */
  height?: number;
  /**
   * Fill color for the sketch shape. When set, {@link fillStyle} applies.
   * @default undefined (stroke only)
   */
  fill?: string;
  /**
   * Inset the drawing from the box edge so strokes are not clipped.
   * @default 3 ({@link DEFAULT_INSET})
   */
  inset?: number;
  /**
   * SVG path `d` string when `shape` is `"path"`.
   * @default undefined
   */
  path?: string;
  /** Class name on the overlay wrapper. */
  className?: string;
  /** Inline styles on the overlay wrapper. */
  style?: CSSProperties;
}

export type PolymorphicClassName = Pick<HTMLAttributes<HTMLElement>, "className" | "style">;

/**
 * Maps doodle-ui sketch props to rough.js `Options` for a single draw call.
 */
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

/** Default roughness when no prop, provider, or CSS override is set. */
export const DEFAULT_ROUGHNESS = 1.5;
/** Default bowing when no prop, provider, or CSS override is set. */
export const DEFAULT_BOWING = 1;
/** Default stroke width when no prop, provider, or CSS override is set. */
export const DEFAULT_STROKE_WIDTH = 1.75;
/** Default light-mode ink / stroke color. */
export const DEFAULT_INK = "#1f1d1a";
/** Default dark-mode ink / stroke color. */
export const DEFAULT_DARK_INK = "#f3f4f6";
/** Default light-mode paper background token. */
export const DEFAULT_PAPER = "#f7f6f2";
/** Default dark-mode page background token. */
export const DEFAULT_DARK_PAPER = "#131923";
/** Default dark-mode card surface token. */
export const DEFAULT_DARK_CARD_BG = "#131923";
/** Default inset for {@link RoughSvg} stroke clipping. */
export const DEFAULT_INSET = 3;

/** Semantic sketch colors for light mode (ink, accent, status, paper). */
export const SKETCH_COLORS = {
  ink: DEFAULT_INK,
  accent: "#e24b3b",
  /** Light wash behind accent badges/buttons — keep pale so accent ink stays ≥4.5:1. */
  accentFill: "#fce8e4",
  secondaryFill: "#d7e3d4",
  paper: "#eef0ea",
  info: "#1d4e89",
  /** Darkened for WCAG AA text on paper and alert fills. */
  warning: "#8a5200",
  error: "#b91c1c",
  success: "#2d6a4f",
  /**
   * Darker accent used for Badge `variant="accent"` text/stroke on accentFill
   * (brand `#e24b3b` is only ~2.5:1 on the wash).
   */
  accentInk: "#9b2c20",
} as const;

/** Semantic sketch colors for dark mode. */
export const DARK_SKETCH_COLORS = {
  ink: DEFAULT_DARK_INK,
  accent: "#f87171",
  /** Same as accent — dark paper already yields ≥4.5:1. */
  accentInk: "#f87171",
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
