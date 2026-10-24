import { Badge, Button, Kbd } from "doodleui-react";

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroTerminalProps {
  badge?: string;
  title?: string;
  description?: string;
  command?: string;
  output?: string[];
  hint?: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  className?: string;
}

const defaultPrimary: HeroAction = { label: "Read the docs", href: "#" };
const defaultSecondary: HeroAction = { label: "Browse components", href: "#" };
const defaultOutput = ["added button", "added card", "added input", "ready in 1.2s"];

/**
 * Developer hero: copy on the left, a chalkboard install panel on the right.
 * Built only from doodle-ui components and theme tokens.
 */
export function HeroTerminal({
  badge = "v1.0",
  title = "Add a sketched UI without leaving the terminal",
  description = "One command pulls in buttons, cards, and inputs that already look hand-drawn. Paste the file, keep the ink.",
  command = "npx doodleui add button",
  output = defaultOutput,
  hint = "to search the docs",
  primaryAction = defaultPrimary,
  secondaryAction = defaultSecondary,
  className,
}: HeroTerminalProps) {
  return (
    <section className={`bg-paper px-6 py-16 text-ink md:py-24 ${className ?? ""}`.trim()}>
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
        <div>
          <Badge variant="accent">{badge}</Badge>
          <h1 className="doodle-shuffle-type mt-5 max-w-[16ch] text-4xl font-semibold !leading-[1.35] tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-mute md:text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
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
          <p className="mt-5 flex flex-wrap items-center gap-2 text-sm text-mute">
            <span>Press</span>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
            <span>{hint}</span>
          </p>
        </div>

        <div
          className="bg-chalkboard px-4 py-4 font-mono text-[13px] leading-relaxed text-chalkink md:-rotate-1"
          role="img"
          aria-label={`Terminal showing ${command}`}
        >
          <div className="mb-3 flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-chalkink/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-chalkink/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-chalkink/30" />
          </div>
          <p className="break-all leading-relaxed">
            <span className="text-accent">$</span> {command}
          </p>
          <ul className="mt-3 space-y-1">
            {output.map((line) => (
              <li key={line} style={{ color: "var(--doodle-ui-color-success)" }}>
                ✓ {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
