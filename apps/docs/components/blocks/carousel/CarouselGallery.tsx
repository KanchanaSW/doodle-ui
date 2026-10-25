"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselProps,
} from "doodleui-react";

type CarouselApi = Parameters<NonNullable<CarouselProps["setApi"]>>[0];

export interface GallerySlide {
  indexLabel: string;
  title: string;
  caption: string;
  kicker: string;
}

export interface CarouselGalleryProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
  slides?: GallerySlide[];
  className?: string;
}

const defaultSlides: GallerySlide[] = [
  {
    indexLabel: "01",
    kicker: "Home",
    title: "A first screen with room to breathe",
    caption: "Badge, headline, two actions. The sketch frame is the only decoration.",
  },
  {
    indexLabel: "02",
    kicker: "Docs",
    title: "Props beside a live example",
    caption: "Change roughness and the border redraws. The sentence underneath stays put.",
  },
  {
    indexLabel: "03",
    kicker: "Blocks",
    title: "Sections you can lift out",
    caption: "Pick a layout, read the preview, copy the file. Then edit the words.",
  },
  {
    indexLabel: "04",
    kicker: "Customize",
    title: "Ink, paper, accent",
    caption: "Three colors and a font. The rest of the library follows.",
  },
  {
    indexLabel: "05",
    kicker: "Install",
    title: "One command, then the import",
    caption: "The CLI drops the component in. You write the sentence it wraps.",
  },
];

/**
 * A large slide with a row of numbered thumbnails that stay in sync.
 * Built only from doodle-ui components and theme tokens.
 */
export function CarouselGallery({
  eyebrow = "Lookbook",
  title = "Five screens, one frame",
  intro = "The big panel is the page. The numbered row underneath is the same carousel — pick a number or use the arrows.",
  slides = defaultSlides,
  className,
}: CarouselGalleryProps) {
  const [api, setApi] = useState<CarouselApi>(undefined);
  const [index, setIndex] = useState(0);
  const active = slides[index];

  useEffect(() => {
    if (!api) return;
    const sync = () => setIndex(api.selectedScrollSnap());
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  return (
    <section className={`bg-paper px-6 py-16 text-ink md:py-24 ${className ?? ""}`.trim()}>
      <div className="mx-auto max-w-4xl">
        <div className="max-w-2xl">
          <Badge variant="accent">{eyebrow}</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          <p className="mt-4 max-w-[52ch] leading-relaxed text-mute">{intro}</p>
        </div>
        <div className="mt-10 px-14">
          <Carousel setApi={setApi} opts={{ loop: true }} seed={42}>
            <CarouselContent>
              {slides.map((slide) => (
                <CarouselItem key={slide.indexLabel}>
                  <div className="border-2 border-ink bg-ink/[0.04] px-6 py-10 md:px-10 md:py-14">
                    <p className="font-mono text-xs text-mute">{slide.indexLabel}</p>
                    <p className="mt-4 font-hand text-5xl leading-none text-ink md:text-6xl">
                      {slide.kicker}
                    </p>
                    <div className="mt-8 flex flex-col gap-2" aria-hidden>
                      <span className="h-2 w-2/3 bg-ink/80" />
                      <span className="h-2 w-1/2 bg-ink/30" />
                      <span className="mt-3 h-8 w-24 border-2 border-ink" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          {active ? (
            <div className="mt-5">
              <h3 className="text-lg font-semibold text-ink">{active.title}</h3>
              <p className="mt-1 max-w-[56ch] text-sm leading-relaxed text-mute">{active.caption}</p>
            </div>
          ) : null}
          <div className="mt-5 grid grid-cols-5 gap-2" role="group" aria-label="Screens">
            {slides.map((slide, slideIndex) => {
              const current = slideIndex === index;
              return (
                <button
                  key={slide.indexLabel}
                  type="button"
                  aria-label={`Show ${slide.kicker}`}
                  aria-current={current ? "true" : undefined}
                  onClick={() => api?.scrollTo(slideIndex)}
                  className={`border-2 px-1 py-2 text-center font-mono text-xs ${
                    current ? "border-accent bg-accent/15 text-ink" : "border-ink/40 text-mute"
                  }`}
                >
                  {slide.indexLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
