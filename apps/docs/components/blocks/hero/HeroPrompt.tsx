import { Badge, Button, Highlight, PromptInput } from "doodleui-react";

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroPromptProps {
  badge?: string;
  titleLead?: string;
  titleMark?: string;
  titleTail?: string;
  description?: string;
  placeholder?: string;
  suggestions?: string[];
  primaryAction?: HeroAction;
  className?: string;
}

const defaultSuggestions = [
  "Draft a pricing page",
  "Sketch a login form",
  "A hero with a ticket stub",
  "Rewrite this in fewer words",
];

const defaultPrimary: HeroAction = { label: "Browse examples", href: "#" };

/**
 * AI-product hero: a marked word, a sketch prompt, and suggestion chips.
 * The prompt is uncontrolled. Built only from doodle-ui components and theme tokens.
 */
export function HeroPrompt({
  badge = "Sketch, then send",
  titleLead = "Describe it.",
  titleMark = "Draw",
  titleTail = "it.",
  description = "A prompt box for products that turn a sentence into an interface. Swap the chips for your own starters.",
  placeholder = "A waitlist page with a hand-drawn progress meter…",
  suggestions = defaultSuggestions,
  primaryAction = defaultPrimary,
  className,
}: HeroPromptProps) {
  return (
    <section
      className={`bg-paper px-6 py-16 text-center text-ink md:py-24 ${className ?? ""}`.trim()}
    >
      <div className="mx-auto max-w-3xl">
        <div className="inline-flex">
          <Badge variant="accent">{badge}</Badge>
        </div>
        <h1 className="doodle-shuffle-type mx-auto mt-5 max-w-[16ch] text-4xl font-semibold !leading-[1.35] tracking-tight md:text-6xl">
          {titleLead} <Highlight>{titleMark}</Highlight> {titleTail}
        </h1>
        <p className="mx-auto mt-5 max-w-[46ch] text-base leading-relaxed text-mute md:text-lg">
          {description}
        </p>
        <div className="mx-auto mt-8 max-w-xl text-left">
          <PromptInput
            variant="sketch"
            size="lg"
            placeholder={placeholder}
            aria-label="Prompt"
            keepOpenOnBlur
          />
        </div>
        <ul className="mx-auto mt-5 flex max-w-xl flex-wrap justify-center gap-2">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <Badge variant="outline">{suggestion}</Badge>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button size="lg" variant="outline" asChild style={{ lineHeight: 1.45 }}>
            <a href={primaryAction.href}>
              <span className="relative z-[1]">{primaryAction.label}</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
