"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { deriveSeed } from "../utils";

export type StepperOrientation = "horizontal" | "vertical";

export interface StepperStep {
  label: ReactNode;
  description?: ReactNode;
}

export interface StepperProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    SketchProps {
  steps: Array<StepperStep | ReactNode>;
  current?: number;
  orientation?: StepperOrientation;
}

function normalizeSteps(steps: Array<StepperStep | ReactNode>): StepperStep[] {
  return steps.map((step) =>
    step !== null && typeof step === "object" && "label" in step
      ? (step as StepperStep)
      : { label: step },
  );
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  function Stepper(
    {
      className,
      style,
      steps,
      current = 0,
      orientation = "horizontal",
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
    const items = normalizeSteps(steps);
    const horizontal = orientation === "horizontal";

    return (
      <div
        ref={ref}
        role="list"
        className={cn(className)}
        style={{
          display: "flex",
          flexDirection: horizontal ? "row" : "column",
          alignItems: horizontal ? "flex-start" : "stretch",
          ...style,
        }}
        {...rest}
      >
        {items.map((step, index) => {
          const complete = index < current;
          const active = index === current;
          const markerColor = complete || active ? SKETCH_COLORS.accent : ink;

          return (
            <div
              key={index}
              role="listitem"
              aria-current={active ? "step" : undefined}
              style={{
                display: "flex",
                flex: horizontal ? 1 : undefined,
                flexDirection: horizontal ? "column" : "row",
                alignItems: horizontal ? "center" : "flex-start",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: horizontal ? "row" : "column",
                  alignItems: "center",
                  width: horizontal ? "100%" : undefined,
                }}
              >
                <span
                  style={{
                    position: "relative",
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: doodleUiFontFamily,
                    fontWeight: doodleUiFontWeight(700),
                    fontSize: 13,
                    color: markerColor,
                  }}
                >
                  <RoughSvg
                    shape="ellipse"
                    roughness={roughness}
                    seed={deriveSeed(resolvedSeed, `step-${index}`)}
                    sketchColor={markerColor}
                    fill={
                      complete
                        ? SKETCH_COLORS.accentFill
                        : active
                          ? "#f7f6f2"
                          : undefined
                    }
                    fillStyle={
                      complete || active ? fillStyle ?? "hachure" : undefined
                    }
                    bowing={bowing}
                    strokeWidth={
                      active
                        ? (strokeWidth ?? 1.6) + 0.4
                        : strokeWidth ?? 1.5
                    }
                    inset={1.5}
                  />
                  <span style={{ position: "relative", zIndex: 1 }}>
                    {complete ? "✓" : index + 1}
                  </span>
                </span>
                {index < items.length - 1 ? (
                  <span
                    style={{
                      position: "relative",
                      flex: 1,
                      width: horizontal ? undefined : 12,
                      height: horizontal ? 12 : 28,
                      minWidth: horizontal ? 16 : 12,
                      alignSelf: "center",
                    }}
                  >
                    <RoughSvg
                      shape={horizontal ? "line" : "line-vertical"}
                      roughness={(roughness ?? 1.5) + 0.3}
                      seed={deriveSeed(resolvedSeed, `connector-${index}`)}
                      sketchColor={complete ? SKETCH_COLORS.accent : ink}
                      bowing={bowing ?? 2}
                      strokeWidth={strokeWidth ?? 1.4}
                      inset={2}
                    />
                  </span>
                ) : null}
              </div>
              <div
                style={{
                  marginTop: horizontal ? 8 : 0,
                  marginLeft: horizontal ? 0 : 10,
                  paddingBottom: horizontal ? 0 : 8,
                  textAlign: horizontal ? "center" : "left",
                  fontFamily: doodleUiFontFamily,
                  fontSize: 13,
                  color: ink,
                }}
              >
                <div style={{ fontWeight: doodleUiFontWeight(600) }}>
                  {step.label}
                </div>
                {step.description ? (
                  <div style={{ opacity: 0.7, fontSize: 12, marginTop: 2 }}>
                    {step.description}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
