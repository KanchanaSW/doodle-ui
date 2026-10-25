"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Blockquote,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselProps,
} from "doodleui-react";

type CarouselApi = Parameters<NonNullable<CarouselProps["setApi"]>>[0];

export interface TestimonialSlide {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export interface CarouselTestimonialsProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
  slides?: TestimonialSlide[];
  className?: string;
}

const defaultSlides: TestimonialSlide[] = [
  {
    quote:
      "The third slide is the one people used to skip. With the draw-in, they stay long enough to read it.",
    name: "Jules Hart",
    role: "Editor, Northwind",
    initials: "JH",
  },
  {
    quote:
      "I pasted the file, changed the names, and it still looked like someone on our team had sketched it.",
    name: "Sam Ortega",
    role: "Founder, Paper Co",
    initials: "SO",
  },
  {
    quote:
      "Stakeholders stopped asking for more polish and started asking what the next page should say.",
    name: "Lena Voss",
    role: "Brand, Fieldnote",
    initials: "LV",
  },
  {
    quote:
      "We used to hide quotes in a grid. One at a time, they finally sound like a person talking.",
    name: "Priya Nair",
    role: "Product, Inkwell",
    initials: "PN",
  },
];

/**
 * One quote per slide, with sketch arrows and dots that jump to a person.
 * Built only from doodle-ui components and theme tokens.
 */
export function CarouselTestimonials({
  eyebrow = "From the margin",
  title = "Notes people actually finished",
  intro = "A single quote fills the slide. The dots underneath are the index — click one to hear someone else.",
  slides = defaultSlides,
  className,
}: CarouselTestimonialsProps) {
  const [api, setApi] = useState<CarouselApi>(undefined);
  const [index, setIndex] = useState(0);
  const count = api?.scrollSnapList().length ?? slides.length;

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
    <section
      className={`bg-paper px-6 py-16 text-ink md:py-24 ${className ?? ""}`.trim()}
    >
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="accent">{eyebrow}</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-[52ch] leading-relaxed text-mute">{intro}</p>
      </div>
      <div className="mx-auto mt-10 max-w-2xl px-14">
        <Carousel bordered setApi={setApi} opts={{ loop: true }} seed={42}>
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.name}>
                <figure className="px-2 py-6 text-center md:px-8">
                  <Blockquote>
                    <span className="text-left text-xl !leading-[1.4] md:text-2xl">
                      {slide.quote}
                    </span>
                  </Blockquote>
                  <figcaption className="mt-6 flex items-center justify-center gap-3">
                    <Avatar size="md" fallback={slide.initials} alt="" />
                    <span className="text-left text-sm">
                      <span className="block font-semibold text-ink">{slide.name}</span>
                      <span className="block text-mute">{slide.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="mt-6 flex justify-center gap-2" role="group" aria-label="Choose a quote">
          {slides.map((slide, slideIndex) => {
            const active = slideIndex === index;
            return (
              <button
                key={slide.name}
                type="button"
                aria-label={`Show quote from ${slide.name}`}
                aria-current={active ? "true" : undefined}
                onClick={() => api?.scrollTo(slideIndex)}
                className={`h-2.5 w-2.5 border-2 border-ink ${active ? "bg-accent" : "bg-transparent"}`}
              />
            );
          })}
        </div>
        <p className="mt-3 text-center font-mono text-xs text-mute">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}
