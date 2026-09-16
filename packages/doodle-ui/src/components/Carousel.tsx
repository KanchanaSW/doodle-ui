"use client";

import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { SketchBox } from "../primitives/SketchBox";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { cn, deriveSeed } from "../utils";
import { Button } from "./Button";

type CarouselApi = UseEmblaCarouselType[1];

interface CarouselContextValue {
  emblaRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: "horizontal" | "vertical";
  sketch: SketchProps & { animate?: boolean };
  bordered: boolean;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarousel(): CarouselContextValue {
  const ctx = useContext(CarouselContext);
  if (!ctx) {
    throw new Error("Carousel parts must be used inside <Carousel>.");
  }
  return ctx;
}

export type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];

export interface CarouselProps extends SketchProps {
  opts?: CarouselOptions;
  plugins?: Parameters<typeof useEmblaCarousel>[1];
  orientation?: "horizontal" | "vertical";
  bordered?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  setApi?: (api: CarouselApi) => void;
  animate?: boolean;
}

export function Carousel({
  opts,
  plugins,
  orientation = "horizontal",
  bordered = true,
  className,
  style,
  children,
  setApi,
  roughness,
  seed,
  sketchColor,
  bowing,
  strokeWidth,
  fillStyle,
  animate,
}: CarouselProps) {
  const [emblaRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    setApi?.(api);
    onSelect();
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api.off("reInit", onSelect);
      api.off("select", onSelect);
    };
  }, [api, onSelect, setApi]);

  const value: CarouselContextValue = {
    emblaRef,
    api,
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
    orientation,
    sketch: {
      roughness,
      seed,
      sketchColor,
      bowing,
      strokeWidth,
      animate,
    },
    bordered,
  };

  const frame = (
    <CarouselContext.Provider value={value}>
      <div
        className={cn(className)}
        style={{
          position: "relative",
          width: "100%",
          ...(!bordered ? style : undefined),
        }}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );

  if (!bordered) {
    return frame;
  }

  return (
    <SketchBox
      style={{ width: "100%", ...style }}
      contentStyle={{ padding: 12 }}
      fill={SKETCH_COLORS.paper}
      fillStyle={fillStyle ?? "hachure"}
      roughness={roughness}
      seed={seed}
      sketchColor={sketchColor}
      bowing={bowing}
      strokeWidth={strokeWidth}
      animate={animate}
    >
      {frame}
    </SketchBox>
  );
}

export interface CarouselContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
  function CarouselContent({ className, style, children, ...rest }, ref) {
    const { emblaRef, orientation } = useCarousel();

    return (
      <div ref={emblaRef} style={{ overflow: "hidden" }}>
        <div
          ref={ref}
          className={cn(className)}
          style={{
            display: "flex",
            flexDirection: orientation === "vertical" ? "column" : "row",
            marginLeft: orientation === "horizontal" ? -4 : 0,
            marginTop: orientation === "vertical" ? -4 : 0,
            ...style,
          }}
          {...rest}
        >
          {children}
        </div>
      </div>
    );
  },
);

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {}

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  function CarouselItem({ className, style, children, ...rest }, ref) {
    const { orientation } = useCarousel();
    return (
      <div
        ref={ref}
        className={cn(className)}
        role="group"
        aria-roledescription="slide"
        style={{
          flex: "0 0 100%",
          minWidth: 0,
          paddingLeft: orientation === "horizontal" ? 4 : 0,
          paddingTop: orientation === "vertical" ? 4 : 0,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

const ARROW_PATH_PREV = "M 14 4 L 6 12 L 14 20";
const ARROW_PATH_NEXT = "M 6 4 L 14 12 L 6 20";

export interface CarouselArrowProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const CarouselPrevious = forwardRef<HTMLButtonElement, CarouselArrowProps>(
  function CarouselPrevious({ className, style, ...rest }, ref) {
    const { scrollPrev, canScrollPrev, sketch } = useCarousel();
    const resolvedSeed = useResolvedSeed(sketch.seed);
    const ink = sketch.sketchColor ?? SKETCH_COLORS.ink;

    return (
      <Button
        ref={ref}
        type="button"
        variant="outline"
        size="sm"
        disabled={!canScrollPrev}
        className={cn(className)}
        style={{
          position: "absolute",
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          width: 36,
          height: 36,
          padding: 0,
          ...style,
        }}
        onClick={scrollPrev}
        roughness={sketch.roughness}
        seed={deriveSeed(resolvedSeed, "prev")}
        sketchColor={ink}
        bowing={sketch.bowing}
        strokeWidth={sketch.strokeWidth}
        animate={sketch.animate}
        aria-label="Previous slide"
        {...rest}
      >
        <span style={{ position: "relative", width: 18, height: 22 }}>
          <RoughSvg
            shape="path"
            path={ARROW_PATH_PREV}
            roughness={sketch.roughness}
            seed={deriveSeed(resolvedSeed, "prev-arrow")}
            sketchColor={ink}
            strokeWidth={sketch.strokeWidth ?? 1.6}
          />
        </span>
      </Button>
    );
  },
);

export const CarouselNext = forwardRef<HTMLButtonElement, CarouselArrowProps>(
  function CarouselNext({ className, style, ...rest }, ref) {
    const { scrollNext, canScrollNext, sketch } = useCarousel();
    const resolvedSeed = useResolvedSeed(sketch.seed);
    const ink = sketch.sketchColor ?? SKETCH_COLORS.ink;

    return (
      <Button
        ref={ref}
        type="button"
        variant="outline"
        size="sm"
        disabled={!canScrollNext}
        className={cn(className)}
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          width: 36,
          height: 36,
          padding: 0,
          ...style,
        }}
        onClick={scrollNext}
        roughness={sketch.roughness}
        seed={deriveSeed(resolvedSeed, "next")}
        sketchColor={ink}
        bowing={sketch.bowing}
        strokeWidth={sketch.strokeWidth}
        animate={sketch.animate}
        aria-label="Next slide"
        {...rest}
      >
        <span style={{ position: "relative", width: 18, height: 22 }}>
          <RoughSvg
            shape="path"
            path={ARROW_PATH_NEXT}
            roughness={sketch.roughness}
            seed={deriveSeed(resolvedSeed, "next-arrow")}
            sketchColor={ink}
            strokeWidth={sketch.strokeWidth ?? 1.6}
          />
        </span>
      </Button>
    );
  },
);
