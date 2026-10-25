import { Badge, Button, SketchBox } from "doodleui-react";

export interface BentoBandAction {
  label: string;
  href: string;
}

export interface BentoBandStep {
  glyph: string;
  title: string;
  body: string;
}

export interface BentoBandsProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
  dateLabel?: string;
  dateValue?: string;
  steps?: BentoBandStep[];
  footer?: string;
  primaryAction?: BentoBandAction;
  className?: string;
}

const defaultAction: BentoBandAction = { label: "Read the note", href: "#" };

const defaultSteps: BentoBandStep[] = [
  {
    glyph: "1",
    title: "Draw",
    body: "The border sketches in, then sits still so the words can lead.",
  },
  {
    glyph: "2",
    title: "Type",
    body: "Swap the sentences. The tiles keep their places.",
  },
  {
    glyph: "3",
    title: "Ship",
    body: "One file leaves with the page. No extra stylesheet.",
  },
];

/**
 * Banded bento: a wide-and-narrow row, three equal steps, then a full-width strip.
 * Built only from doodle-ui components and theme tokens.
 */
export function BentoBands({
  eyebrow = "This week",
  title = "Three bands, three different cuts",
  intro = "The first row is uneven. The second row is three equal steps. The last row is one long strip, so the section ends on a single line.",
  dateLabel = "Shipped",
  dateValue = "25 Oct",
  steps = defaultSteps,
  footer = "Copy the file. Change the sentences. Leave the grid alone until the next page needs a different cut.",
  primaryAction = defaultAction,
  className,
}: BentoBandsProps) {
  return (
    <section className={`bg-paper px-6 py-16 text-ink md:py-24 ${className ?? ""}`.trim()}>
      <div className="mx-auto max-w-5xl">
        <Badge variant="accent">{eyebrow}</Badge>
        <h2 className="mt-4 max-w-[18ch] text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-[52ch] leading-relaxed text-mute">{intro}</p>

        <div className="mt-10 grid gap-3">
          <div className="grid gap-3 md:grid-cols-5">
            <SketchBox
              shadow
              seed={42}
              className="md:col-span-3"
              contentStyle={{ padding: 24 }}
            >
              <h3 className="text-2xl font-semibold leading-snug text-ink">
                The wide tile is the note. The narrow one is the date.
              </h3>
              <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-mute">
                Use the long cell for the thing you want read first. Park the fact that would clutter it — a date, a version, a status — in the cell beside it.
              </p>
              <div className="mt-6">
                <Button asChild style={{ lineHeight: 1.45 }}>
                  <a href={primaryAction.href}>
                    <span className="relative z-[1]">{primaryAction.label}</span>
                  </a>
                </Button>
              </div>
            </SketchBox>

            <SketchBox
              shadow
              seed={42}
              className="md:col-span-2"
              contentStyle={{ padding: 24, height: "100%" }}
            >
              <p className="text-sm text-mute">{dateLabel}</p>
              <p className="mt-3 font-hand text-5xl leading-none text-ink">{dateValue}</p>
              <p className="mt-4 text-sm leading-relaxed text-mute">
                A small tile can carry one fact. It does not need a paragraph.
              </p>
            </SketchBox>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {steps.map((step) => (
              <SketchBox key={step.title} shadow seed={42} contentStyle={{ padding: 20 }}>
                <p className="font-hand text-3xl leading-none text-accent" aria-hidden>
                  {step.glyph}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{step.body}</p>
              </SketchBox>
            ))}
          </div>

          <SketchBox shadow seed={42} contentStyle={{ padding: 20 }}>
            <p className="text-base leading-relaxed text-ink md:text-lg">{footer}</p>
          </SketchBox>
        </div>
      </div>
    </section>
  );
}
