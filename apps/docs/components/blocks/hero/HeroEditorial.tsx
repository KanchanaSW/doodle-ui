import { Blockquote, Divider } from "doodleui-react";

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroEditorialProps {
  issue?: string;
  date?: string;
  title?: string;
  lead?: string;
  quote?: string;
  quoteBy?: string;
  primaryAction?: HeroAction;
  className?: string;
}

const defaultLead =
  "Most interface kits arrive polished and identical. This one keeps the wobble: rules that wander, type that leans, and buttons that look like they were inked after lunch.";
const defaultAction: HeroAction = { label: "Continue reading", href: "#" };

/**
 * Magazine hero: a masthead, a display headline, a drop cap, and a pull quote.
 * The call to action is a text link. Built only from doodle-ui components and theme tokens.
 */
export function HeroEditorial({
  issue = "Issue No. 07",
  date = "Autumn 2026",
  title = "Ink, paper, and the case for a crooked line",
  lead = defaultLead,
  quote = "A straight box is a decision. A crooked one is a person.",
  quoteBy = "From the editor's desk",
  primaryAction = defaultAction,
  className,
}: HeroEditorialProps) {
  const [first, ...rest] = lead;

  return (
    <section className={`bg-paper px-6 py-16 text-ink md:py-24 ${className ?? ""}`.trim()}>
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.22em] text-mute">
          <span className="min-w-0 flex-1">
            <Divider />
          </span>
          <p className="shrink-0">
            {issue}
            <span aria-hidden> / </span>
            {date}
          </p>
          <span className="min-w-0 flex-1">
            <Divider />
          </span>
        </div>
        <h1 className="doodle-shuffle-type mt-8 max-w-[18ch] text-5xl font-semibold !leading-[1.15] tracking-tight sm:text-6xl md:text-8xl">
          {title}
        </h1>
        <div className="mt-10 grid items-start gap-10 md:grid-cols-2">
          <p className="text-base leading-relaxed text-ink md:text-lg">
            <span className="doodle-shuffle-type float-left mr-3 mt-1 text-6xl font-semibold leading-none text-accent">
              {first}
            </span>
            {rest.join("")}
          </p>
          <div>
            <Blockquote>{quote}</Blockquote>
            <p className="mt-3 text-sm text-mute">{quoteBy}</p>
            <a
              href={primaryAction.href}
              className="mt-6 inline-block text-base text-ink underline decoration-accent decoration-2 underline-offset-4"
            >
              {primaryAction.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
