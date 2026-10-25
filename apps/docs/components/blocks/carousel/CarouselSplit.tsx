"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselProps,
} from "doodleui-react";

type CarouselApi = Parameters<NonNullable<CarouselProps["setApi"]>>[0];

export interface CaseStudySlide {
  client: string;
  title: string;
  caption: string;
  result: string;
}

export interface CarouselSplitAction {
  label: string;
  href: string;
}

export interface CarouselSplitProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
  primaryAction?: CarouselSplitAction;
  slides?: CaseStudySlide[];
  className?: string;
}

const defaultAction: CarouselSplitAction = { label: "Read the notes", href: "#" };

const defaultSlides: CaseStudySlide[] = [
  {
    client: "Fieldnote",
    title: "A homepage that sounds like the studio",
    caption: "They replaced a stock hero with a sketched one and kept the same headline.",
    result: "Time on the first screen doubled.",
  },
  {
    client: "Paper Co",
    title: "A waitlist that looked handmade",
    caption: "The form stayed one field. The border did the inviting.",
    result: "Signups up, without a new incentive.",
  },
  {
    client: "Northwind",
    title: "Docs people finish",
    caption: "Install steps moved into a terminal block. The rest of the page got quieter.",
    result: "Support tickets about setup dropped.",
  },
  {
    client: "Inkwell",
    title: "A status page with a pulse",
    caption: "Gauges and a short sentence, instead of a table of green dots.",
    result: "Fewer 'is it down?' pings.",
  },
  {
    client: "Sketch week",
    title: "A workshop landing in an afternoon",
    caption: "Five sections, copied and rewritten. No design file in between.",
    result: "The page shipped the day it was written.",
  },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Copy on the left, a case-study slide on the right, with a counter and caption.
 * Built only from doodle-ui components and theme tokens.
 */
export function CarouselSplit({
  eyebrow = "Case studies",
  title = "Pages that kept the pencil marks",
  intro = "Each slide is one project: who it was for, what changed, and the sentence we wrote down after.",
  primaryAction = defaultAction,
  slides = defaultSlides,
  className,
}: CarouselSplitProps) {
  const [api, setApi] = useState<CarouselApi>(undefined);
  const [index, setIndex] = useState(0);
  const count = api?.scrollSnapList().length ?? slides.length;
  const active = slides[index] ?? slides[0];

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
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <Badge variant="outline">{eyebrow}</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          <p className="mt-4 max-w-[46ch] leading-relaxed text-mute">{intro}</p>
          <div className="mt-8">
            <Button size="lg" asChild style={{ lineHeight: 1.45 }}>
              <a href={primaryAction.href}>
                <span className="relative z-[1]">{primaryAction.label}</span>
              </a>
            </Button>
          </div>
        </div>
        <div className="px-14">
          <Carousel setApi={setApi} opts={{ loop: true }} seed={42}>
            <CarouselContent>
              {slides.map((slide) => (
                <CarouselItem key={slide.client}>
                  <Card seed={42}>
                    <p className="text-xs uppercase tracking-[0.16em] text-mute">{slide.client}</p>
                    <h3 className="mt-3 text-xl font-semibold leading-snug text-ink">{slide.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-mute">{slide.caption}</p>
                    <p className="mt-5 border-t border-ink/20 pt-4 text-sm font-semibold text-ink">
                      {slide.result}
                    </p>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          {active ? (
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <p className="font-mono text-sm text-ink" aria-live="polite">
                {pad(index + 1)} / {pad(count)}
              </p>
              <p className="text-right text-sm text-mute">{active.client}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
