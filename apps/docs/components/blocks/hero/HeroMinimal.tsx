import { Badge, Button, Divider } from "doodleui-react";

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroMinimalProps {
  badge?: string;
  title?: string;
  description?: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  className?: string;
}

const defaultPrimary: HeroAction = { label: "Get started", href: "#" };
const defaultSecondary: HeroAction = { label: "Learn more", href: "#" };

/**
 * Centered hero built only from doodle-ui components and theme tokens.
 * Pass props to swap the copy, or edit this file and paste it into a project.
 */
export function HeroMinimal({
  badge = "Hand-drawn UI",
  title = "A hero you can drop in and edit",
  description = "Badge, headline, two actions, and a short rule. Change the props or the markup.",
  primaryAction = defaultPrimary,
  secondaryAction = defaultSecondary,
  className,
}: HeroMinimalProps) {
  return (
    <section
      className={`bg-paper px-6 py-16 text-center text-ink md:py-24 ${className ?? ""}`.trim()}
    >
      <div className="inline-flex">
        <Badge variant="accent">{badge}</Badge>
      </div>
      <h1 className="doodle-shuffle-type mx-auto mt-5 max-w-[16ch] text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-5 max-w-[46ch] text-base leading-relaxed text-mute md:text-lg">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" asChild>
          <a href={primaryAction.href}>{primaryAction.label}</a>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href={secondaryAction.href}>{secondaryAction.label}</a>
        </Button>
      </div>
      <div className="mx-auto mt-10 w-24">
        <Divider />
      </div>
    </section>
  );
}
