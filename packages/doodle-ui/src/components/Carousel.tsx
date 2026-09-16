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
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MutableRefObject,
  type ReactNode,
} from "react";
import {
  DRAW_IN_DURATION_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { SketchBox } from "../primitives/SketchBox";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { assignRef, cn, deriveSeed } from "../utils";

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
  bordered = false,
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

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (orientation === "horizontal") {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        scrollNext();
      }
    },
    [orientation, scrollPrev, scrollNext],
  );

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
      fillStyle,
      animate,
    },
    bordered,
  };

  return (
    <CarouselContext.Provider value={value}>
      <div
        className={cn(className)}
        role="region"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{
          position: "relative",
          width: "100%",
          ...style,
        }}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export interface CarouselContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
  function CarouselContent({ className, style, children, ...rest }, ref) {
    const { emblaRef, orientation, bordered, sketch } = useCarousel();
    const gap = 16;

    const viewport = (
      <div ref={emblaRef} style={{ overflow: "hidden" }}>
        <div
          ref={ref}
          className={cn(className)}
          style={{
            display: "flex",
            flexDirection: orientation === "vertical" ? "column" : "row",
            marginLeft: orientation === "horizontal" ? -gap : 0,
            marginTop: orientation === "vertical" ? -gap : 0,
            ...style,
          }}
          {...rest}
        >
          {children}
        </div>
      </div>
    );

    if (!bordered) {
      return viewport;
    }

    return (
      <SketchBox
        fill={SKETCH_COLORS.paper}
        fillStyle={sketch.fillStyle ?? "hachure"}
        roughness={sketch.roughness}
        seed={sketch.seed}
        sketchColor={sketch.sketchColor}
        bowing={sketch.bowing}
        strokeWidth={sketch.strokeWidth}
        animate={sketch.animate}
        contentStyle={{ padding: 8 }}
      >
        {viewport}
      </SketchBox>
    );
  },
);

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {}

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  function CarouselItem({ className, style, children, ...rest }, ref) {
    const { orientation } = useCarousel();
    const gap = 16;
    return (
      <div
        ref={ref}
        className={cn(className)}
        role="group"
        aria-roledescription="slide"
        style={{
          flex: "0 0 100%",
          minWidth: 0,
          paddingLeft: orientation === "horizontal" ? gap : 0,
          paddingTop: orientation === "vertical" ? gap : 0,
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
const ARROW_OFFSET = 52;
const ARROW_SIZE = 40;

export interface CarouselArrowProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

const CarouselArrow = forwardRef<
  HTMLButtonElement,
  CarouselArrowProps & { direction: "prev" | "next" }
>(function CarouselArrow(
  { className, style, direction, ...rest },
  ref,
) {
  const {
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
    sketch,
    orientation,
  } = useCarousel();
  const resolvedSeed = useResolvedSeed(sketch.seed);
  const ink = sketch.sketchColor ?? SKETCH_COLORS.ink;
  const isPrev = direction === "prev";
  const disabled = isPrev ? !canScrollPrev : !canScrollNext;
  const shouldAnimate = useAnimate(sketch.animate);
  const rootRef = useRef<HTMLButtonElement>(null);
  const sketchSeed = deriveSeed(resolvedSeed, direction);

  useDrawIn(rootRef, DRAW_IN_DURATION_MS, shouldAnimate, sketchSeed);

  const horizontal = orientation === "horizontal";

  return (
    <button
      ref={(node) => {
        (rootRef as MutableRefObject<HTMLButtonElement | null>).current = node;
        assignRef(ref, node);
      }}
      type="button"
      disabled={disabled}
      className={cn(className)}
      style={{
        position: "absolute",
        zIndex: 2,
        width: ARROW_SIZE,
        height: ARROW_SIZE,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        ...(horizontal
          ? {
              top: "50%",
              transform: "translateY(-50%)",
              left: isPrev ? -ARROW_OFFSET : undefined,
              right: isPrev ? undefined : -ARROW_OFFSET,
            }
          : {
              left: "50%",
              transform: "translateX(-50%) rotate(90deg)",
              top: isPrev ? -ARROW_OFFSET : undefined,
              bottom: isPrev ? undefined : -ARROW_OFFSET,
            }),
        ...style,
      }}
      onClick={isPrev ? scrollPrev : scrollNext}
      aria-label={isPrev ? "Previous slide" : "Next slide"}
      {...rest}
    >
      <RoughSvg
        shape="ellipse"
        roughness={sketch.roughness}
        seed={sketchSeed}
        sketchColor={ink}
        bowing={sketch.bowing}
        fill={SKETCH_COLORS.paper}
        fillStyle="solid"
        strokeWidth={sketch.strokeWidth ?? 1.5}
        inset={1.5}
      />
      <span
        style={{
          position: "relative",
          zIndex: 1,
          width: 18,
          height: 22,
          display: "block",
          margin: "0 auto",
        }}
      >
        <RoughSvg
          shape="path"
          path={isPrev ? ARROW_PATH_PREV : ARROW_PATH_NEXT}
          roughness={sketch.roughness}
          seed={deriveSeed(resolvedSeed, `${direction}-arrow`)}
          sketchColor={ink}
          strokeWidth={sketch.strokeWidth ?? 1.6}
        />
      </span>
    </button>
  );
});

export const CarouselPrevious = forwardRef<HTMLButtonElement, CarouselArrowProps>(
  function CarouselPrevious(props, ref) {
    return <CarouselArrow ref={ref} direction="prev" {...props} />;
  },
);

export const CarouselNext = forwardRef<HTMLButtonElement, CarouselArrowProps>(
  function CarouselNext(props, ref) {
    return <CarouselArrow ref={ref} direction="next" {...props} />;
  },
);
