import { Badge, Card, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "doodleui-react";

export interface FeatureSlide {
  glyph: string;
  title: string;
  body: string;
}

export interface CarouselFeaturesProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
  slides?: FeatureSlide[];
  className?: string;
}

const defaultSlides: FeatureSlide[] = [
  {
    glyph: "✎",
    title: "Draw-in, then stop",
    body: "The border sketches itself once. After that it sits still, so the words can do the work.",
  },
  {
    glyph: "⟳",
    title: "One seed for the row",
    body: "Every card wobbles the same way. Shuffle once and the whole shelf redraws together.",
  },
  {
    glyph: "⎘",
    title: "Copy the file",
    body: "There is no config step. Take the section, change the sentences, and ship it.",
  },
  {
    glyph: "⌨",
    title: "Arrows from the keyboard",
    body: "Left and right move the shelf. The buttons are there for a mouse, not instead of keys.",
  },
  {
    glyph: "◐",
    title: "Ink on either paper",
    body: "Light page or dark page, the stroke follows the theme. You do not repaint the cards.",
  },
];

/**
 * A shelf of feature cards: three across on a wide screen, one on a phone.
 * Built only from doodle-ui components and theme tokens.
 */
export function CarouselFeatures({
  eyebrow = "What you get",
  title = "Five things the shelf is for",
  intro = "Swipe sideways. On a desk you see three cards; on a phone, one. The rest wait just off the page.",
  slides = defaultSlides,
  className,
}: CarouselFeaturesProps) {
  return (
    <section
      className={`bg-paper px-6 py-16 text-ink md:py-24 ${className ?? ""}`.trim()}
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Badge variant="accent">{eyebrow}</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          <p className="mt-4 max-w-[52ch] leading-relaxed text-mute">{intro}</p>
        </div>
        <div className="mt-10 px-14">
          <Carousel opts={{ align: "start" }} seed={42}>
            <CarouselContent>
              {slides.map((slide) => (
                <CarouselItem
                  key={slide.title}
                  className="!basis-full md:!basis-1/2 lg:!basis-1/3"
                >
                  <Card className="h-full" seed={42}>
                    <p aria-hidden className="font-hand text-4xl leading-none text-accent">
                      {slide.glyph}
                    </p>
                    <h3 className="mt-4 text-lg font-semibold text-ink">{slide.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mute">{slide.body}</p>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
