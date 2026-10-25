import { Avatar, Badge, SketchBox } from "doodleui-react";

export interface BentoChapter {
  week: string;
  title: string;
  body: string;
}

export interface BentoSpotlightProps {
  eyebrow?: string;
  quote?: string;
  name?: string;
  role?: string;
  initials?: string;
  chapters?: BentoChapter[];
  className?: string;
}

const defaultChapters: BentoChapter[] = [
  {
    week: "Week 1",
    title: "The borders",
    body: "Every card got the same wobble. The mock stopped looking like a wireframe.",
  },
  {
    week: "Week 3",
    title: "The forms",
    body: "Inputs, checks, and a slider. People could fill the page, not just look at it.",
  },
  {
    week: "Week 6",
    title: "The docs",
    body: "One file per section. The next page was a copy, not a redesign.",
  },
];

/**
 * Spotlight bento: a large quote with a stack of short chapters beside it.
 * Built only from doodle-ui components and theme tokens.
 */
export function BentoSpotlight({
  eyebrow = "Field notes",
  quote = "We stopped redrawing the same border. The page finally looks like it was made by a person.",
  name = "Mina Cole",
  role = "Studio lead",
  initials = "MC",
  chapters = defaultChapters,
  className,
}: BentoSpotlightProps) {
  return (
    <section className={`bg-paper px-6 py-16 text-ink md:py-24 ${className ?? ""}`.trim()}>
      <div className="mx-auto max-w-5xl">
        <Badge variant="accent">{eyebrow}</Badge>
        <h2 className="mt-4 max-w-[18ch] text-3xl font-semibold tracking-tight md:text-4xl">
          One story, three chapters beside it
        </h2>
        <p className="mt-4 max-w-[48ch] leading-relaxed text-mute">
          The quote takes the wide tile. The weeks stack in a narrow column, so the timeline is a list, not another carousel.
        </p>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          <SketchBox
            shadow
            seed={42}
            className="md:col-span-2 md:row-span-3"
            contentStyle={{ padding: 28, height: "100%" }}
          >
            <p className="font-hand text-5xl leading-none text-accent" aria-hidden>
              “
            </p>
            <blockquote className="mt-2 text-2xl font-semibold leading-snug text-ink md:text-3xl">
              {quote}
            </blockquote>
            <footer className="mt-8 flex items-center gap-3">
              <Avatar size="md" fallback={initials} alt="" seed={42} />
              <div>
                <p className="text-sm font-semibold text-ink">{name}</p>
                <p className="text-sm text-mute">{role}</p>
              </div>
            </footer>
          </SketchBox>

          {chapters.map((chapter) => (
            <SketchBox key={chapter.week} shadow seed={42} contentStyle={{ padding: 20 }}>
              <p className="text-sm text-accent">{chapter.week}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">{chapter.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{chapter.body}</p>
            </SketchBox>
          ))}
        </div>
      </div>
    </section>
  );
}
