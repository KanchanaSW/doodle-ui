import { Alert, Avatar, Badge, Kbd, SketchBox } from "doodleui-react";

export interface BentoIssueItem {
  kicker: string;
  title: string;
}

export interface BentoCredit {
  initials: string;
  name: string;
}

export interface BentoMagazineProps {
  issue?: string;
  quote?: string;
  attribution?: string;
  items?: BentoIssueItem[];
  credits?: BentoCredit[];
  className?: string;
}

const defaultItems: BentoIssueItem[] = [
  { kicker: "01", title: "A border that draws itself once" },
  { kicker: "02", title: "Forms that still submit" },
  { kicker: "03", title: "A dark page that keeps the ink" },
];

const defaultCredits: BentoCredit[] = [
  { initials: "AL", name: "Ada" },
  { initials: "OK", name: "Omar" },
  { initials: "SP", name: "Sera" },
];

/**
 * Magazine bento: a pull quote, an issue list, keys, credits, and a note.
 * Built only from doodle-ui components and theme tokens.
 */
export function BentoMagazine({
  issue = "Issue 07",
  quote = "If the border is perfect, it stops looking drawn.",
  attribution = "Margin note, page 12",
  items = defaultItems,
  credits = defaultCredits,
  className,
}: BentoMagazineProps) {
  return (
    <section className={`bg-paper px-6 py-16 text-ink md:py-24 ${className ?? ""}`.trim()}>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge variant="accent">{issue}</Badge>
            <h2 className="mt-4 max-w-[16ch] text-3xl font-semibold tracking-tight md:text-4xl">
              A page laid out like a pamphlet
            </h2>
          </div>
          <p className="max-w-[32ch] text-sm leading-relaxed text-mute">
            Big type on the left. A contents list and a shortcut card stacked on the right. Credits and a note along the bottom.
          </p>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-6">
          <SketchBox
            shadow
            seed={42}
            className="md:col-span-4 md:row-span-2"
            contentStyle={{ padding: 28, height: "100%" }}
          >
            <p className="text-sm uppercase tracking-wide text-mute">Pull quote</p>
            <p className="mt-4 font-hand text-4xl leading-snug text-ink md:text-5xl">{quote}</p>
            <p className="mt-6 text-sm text-mute">{attribution}</p>
          </SketchBox>

          <SketchBox shadow seed={42} className="md:col-span-2" contentStyle={{ padding: 20 }}>
            <p className="text-sm text-mute">In this issue</p>
            <ol className="mt-3 flex flex-col gap-3">
              {items.map((item) => (
                <li key={item.kicker} className="flex items-start gap-2">
                  <span className="font-hand text-lg leading-none text-accent">{item.kicker}</span>
                  <span className="text-sm leading-snug text-ink">{item.title}</span>
                </li>
              ))}
            </ol>
          </SketchBox>

          <SketchBox shadow seed={42} className="md:col-span-2" contentStyle={{ padding: 20 }}>
            <p className="text-sm text-mute">On this page</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink">
              <li className="flex items-center justify-between gap-2">
                <span>Next tile</span>
                <Kbd seed={42}>J</Kbd>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span>Previous</span>
                <Kbd seed={42}>K</Kbd>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span>Copy source</span>
                <span className="flex gap-1">
                  <Kbd seed={42}>⌘</Kbd>
                  <Kbd seed={42}>C</Kbd>
                </span>
              </li>
            </ul>
          </SketchBox>

          <SketchBox
            shadow
            seed={42}
            className="md:col-span-3"
            contentStyle={{ padding: 20 }}
          >
            <p className="text-sm text-mute">Drawn by</p>
            <ul className="mt-4 flex flex-wrap gap-4">
              {credits.map((credit) => (
                <li key={credit.initials} className="flex items-center gap-2">
                  <Avatar size="sm" fallback={credit.initials} alt="" seed={42} />
                  <span className="text-sm text-ink">{credit.name}</span>
                </li>
              ))}
            </ul>
          </SketchBox>

          <Alert className="md:col-span-3" variant="info" seed={42} title="Next pamphlet">
            Friday. Same grid, new sentences. Bring a sharper pull quote.
          </Alert>
        </div>
      </div>
    </section>
  );
}
