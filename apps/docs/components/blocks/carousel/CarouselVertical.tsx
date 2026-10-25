import { Badge, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "doodleui-react";

export interface ReleaseNote {
  version: string;
  date: string;
  title: string;
  notes: string[];
}

export interface CarouselVerticalProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
  releases?: ReleaseNote[];
  className?: string;
}

const defaultReleases: ReleaseNote[] = [
  {
    version: "0.8.0",
    date: "Sep 2026",
    title: "An agent can read the registry",
    notes: [
      "MCP server ships with the package.",
      "Install, theming, and conventions are tools, not a README hunt.",
    ],
  },
  {
    version: "0.7.0",
    date: "Aug 2026",
    title: "The page can be a pile of blocks",
    notes: [
      "Hero sections you copy as one file.",
      "Preview and source sit on the same screen.",
    ],
  },
  {
    version: "0.6.0",
    date: "Jul 2026",
    title: "Theme without a stylesheet fight",
    notes: [
      "Ink, paper, and accent come from CSS variables.",
      "Dark mode follows the page, then the component.",
    ],
  },
  {
    version: "0.5.0",
    date: "Jun 2026",
    title: "Slides with arrows drawn on",
    notes: [
      "Carousel joins the set, horizontal or vertical.",
      "The arrows sit outside the frame, like a sketchbook tab.",
    ],
  },
  {
    version: "0.4.0",
    date: "May 2026",
    title: "Seeds that survive a refresh",
    notes: [
      "The first paint is deterministic.",
      "A random wobble arrives only after mount.",
    ],
  },
];

/**
 * A vertical changelog: one release in the frame, arrows above and below.
 * Built only from doodle-ui components and theme tokens.
 */
export function CarouselVertical({
  eyebrow = "Changelog",
  title = "What landed, one release at a time",
  intro = "Scroll up or down. Each frame is a version: the number, the month, and the two lines worth keeping.",
  releases = defaultReleases,
  className,
}: CarouselVerticalProps) {
  return (
    <section className={`bg-paper px-6 py-16 text-ink md:py-24 ${className ?? ""}`.trim()}>
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <Badge variant="accent">{eyebrow}</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          <p className="mt-4 max-w-[46ch] leading-relaxed text-mute">{intro}</p>
        </div>
        <div className="mx-auto w-full max-w-md py-16">
          <Carousel
            orientation="vertical"
            bordered
            seed={42}
            opts={{ align: "start" }}
            // The sketch frame is the first child. Pin it, the content wrapper,
            // the Embla viewport, and the track so one release fills the frame.
            className="h-72 [&>div:first-child]:h-full [&>div:first-child>div:nth-child(2)]:h-full [&>div:first-child>div:nth-child(2)>div]:h-full [&>div:first-child>div:nth-child(2)>div>div]:h-full"
          >
            <CarouselContent>
              {releases.map((release) => (
                <CarouselItem key={release.version}>
                  <article className="flex h-full flex-col justify-center px-4 py-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline">{release.version}</Badge>
                      <p className="font-mono text-xs text-mute">{release.date}</p>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-ink">{release.title}</h3>
                    <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-mute">
                      {release.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </article>
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
