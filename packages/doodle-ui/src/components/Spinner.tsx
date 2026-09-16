"use client";

import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { useAnimate } from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn } from "../utils";

/** Partial circle arc for a 24×24 viewBox */
const SPINNER_ARC = "M 12 3 A 9 9 0 1 1 11.5 3";

export type SpinnerSize = "sm" | "md" | "lg";

const SIZE_PX: Record<SpinnerSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
};

export interface SpinnerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    SketchProps {
  size?: SpinnerSize;
  /**
   * Continuous rotation. Defaults to the DoodleUIProvider value (true).
   * Reduced motion shows a static arc.
   */
  animate?: boolean;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  function Spinner(
    {
      className,
      style,
      size = "md",
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      animate,
      ...rest
    },
    ref,
  ) {
    const px = SIZE_PX[size];
    const resolvedSeed = useResolvedSeed(seed);
    const ink = sketchColor ?? SKETCH_COLORS.ink;
    const shouldSpin = useAnimate(animate);

    const boxStyle: CSSProperties = {
      position: "relative",
      width: px,
      height: px,
      flexShrink: 0,
      display: "inline-block",
      ...style,
    };

    const arc = (
      <RoughSvg
        shape="path"
        path={SPINNER_ARC}
        width={px}
        height={px}
        roughness={roughness ?? 1.6}
        seed={resolvedSeed}
        sketchColor={ink}
        bowing={bowing ?? 1.2}
        fillStyle={fillStyle}
        strokeWidth={strokeWidth ?? 2}
        inset={2}
      />
    );

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn(className)}
        style={boxStyle}
        {...rest}
      >
        {shouldSpin ? (
          <motion.div
            style={{ position: "absolute", inset: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.9,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {arc}
          </motion.div>
        ) : (
          arc
        )}
      </div>
    );
  },
);
