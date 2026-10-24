import { Button, SketchBox } from "doodleui-react";

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroNote {
  text: string;
  rotate: string;
  place: string;
  fill: string;
}

export interface HeroStickyNotesProps {
  title?: string;
  description?: string;
  notes?: HeroNote[];
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  className?: string;
}

const paperMix = "color-mix(in srgb, var(--ink) 8%, var(--paper))";
const accentMix = "color-mix(in srgb, var(--accent) 32%, var(--paper))";
const chalkMix = "color-mix(in srgb, var(--chalkboard) 14%, var(--paper))";

const defaultNotes: HeroNote[] = [
  {
    text: "ship it friday",
    rotate: "md:-rotate-6",
    place: "md:left-[2%] md:top-[10%]",
    fill: accentMix,
  },
  {
    text: "less boxes, more doodles",
    rotate: "md:rotate-3",
    place: "md:right-[2%] md:top-[6%]",
    fill: paperMix,
  },
  {
    text: "ask mina first",
    rotate: "md:-rotate-3",
    place: "md:left-2 md:bottom-3",
    fill: chalkMix,
  },
  {
    text: "the wobble is the point",
    rotate: "md:rotate-3",
    place: "md:right-2 md:bottom-2",
    fill: accentMix,
  },
  {
    text: "coffee, then pixels",
    rotate: "",
    place: "md:left-1/2 md:top-1 md:[transform:translateX(-50%)_rotate(6deg)]",
    fill: paperMix,
  },
];

const defaultPrimary: HeroAction = { label: "Pin a note", href: "#" };
const defaultSecondary: HeroAction = { label: "See the board", href: "#" };

/**
 * Corkboard hero: tilted sticky notes around a centered headline.
 * On small screens the notes wrap under the buttons.
 * Built only from doodle-ui components and theme tokens.
 */
export function HeroStickyNotes({
  title = "Leave the idea where you can see it",
  description = "Five notes, five angles. They sit in the margins on a wide screen and stack into a row on a phone.",
  notes = defaultNotes,
  primaryAction = defaultPrimary,
  secondaryAction = defaultSecondary,
  className,
}: HeroStickyNotesProps) {
  return (
    <section
      className={`overflow-x-hidden bg-paper px-6 py-16 text-center text-ink md:py-20 ${className ?? ""}`.trim()}
    >
      <div className="relative mx-auto max-w-5xl md:min-h-[28rem]">
        <ul className="mb-8 flex flex-wrap justify-center gap-3 md:pointer-events-none md:absolute md:inset-0 md:mb-0 md:block">
          {notes.map((note) => (
            <li
              key={note.text}
              className={`w-36 md:absolute md:w-40 ${note.rotate} ${note.place}`}
            >
              <SketchBox
                fill={note.fill}
                fillStyle="solid"
                shadow
                contentStyle={{ padding: "14px 12px" }}
              >
                <p className="font-hand text-xl leading-snug text-ink">{note.text}</p>
              </SketchBox>
            </li>
          ))}
        </ul>

        <div className="relative z-10 mx-auto max-w-xl md:pb-40 md:pt-28">
          <h1 className="doodle-shuffle-type mx-auto max-w-[14ch] text-4xl font-semibold !leading-[1.35] tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-[42ch] text-base leading-relaxed text-mute md:text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild style={{ lineHeight: 1.45 }}>
              <a href={primaryAction.href}>
                <span className="relative z-[1]">{primaryAction.label}</span>
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild style={{ lineHeight: 1.45 }}>
              <a href={secondaryAction.href}>
                <span className="relative z-[1]">{secondaryAction.label}</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
