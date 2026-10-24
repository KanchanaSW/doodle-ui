import { Avatar, Badge, Button, Input, Label, Progress } from "doodleui-react";

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroWaitlistProps {
  badge?: string;
  title?: string;
  description?: string;
  emailLabel?: string;
  submitLabel?: string;
  people?: string[];
  socialProof?: string;
  progressLabel?: string;
  progressValue?: number;
  secondaryAction?: HeroAction;
  className?: string;
}

const defaultPeople = ["AL", "MK", "JR", "TS"];
const defaultSecondary: HeroAction = { label: "See the roadmap", href: "#" };

/**
 * Pre-launch hero: an email field, overlapping avatars, and a seat meter.
 * The field is uncontrolled. Built only from doodle-ui components and theme tokens.
 */
export function HeroWaitlist({
  badge = "Beta is almost full",
  title = "Get a seat before the ink dries",
  description = "Leave an email. We'll send one note when a beta seat opens, and nothing else.",
  emailLabel = "Email",
  submitLabel = "Join the list",
  people = defaultPeople,
  socialProof = "1,204 makers on the list",
  progressLabel = "Beta seats",
  progressValue = 82,
  secondaryAction = defaultSecondary,
  className,
}: HeroWaitlistProps) {
  return (
    <section
      className={`bg-paper px-6 py-16 text-center text-ink md:py-24 ${className ?? ""}`.trim()}
    >
      <div className="mx-auto max-w-2xl">
        <div className="inline-flex">
          <Badge variant="accent">{badge}</Badge>
        </div>
        <h1 className="doodle-shuffle-type mx-auto mt-5 max-w-[14ch] text-4xl font-semibold !leading-[1.35] tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-[46ch] text-base leading-relaxed text-mute md:text-lg">
          {description}
        </p>
        <div className="mx-auto mt-8 flex max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-2 text-left">
            <Label htmlFor="hero-waitlist-email">{emailLabel}</Label>
            <Input
              id="hero-waitlist-email"
              type="email"
              placeholder="you@studio.test"
              autoComplete="email"
            />
          </div>
          <Button size="lg" style={{ lineHeight: 1.45 }}>
            {submitLabel}
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <div className="flex">
            {people.map((initials, index) => (
              <span key={initials} className={index === 0 ? "" : "-ml-2"}>
                <Avatar size="sm" fallback={initials} alt="" />
              </span>
            ))}
          </div>
          <p className="text-sm text-mute">{socialProof}</p>
        </div>
        <div className="mx-auto mt-6 max-w-xs text-left">
          <div className="mb-2 flex items-center justify-between text-sm text-mute">
            <span>{progressLabel}</span>
            <span>{progressValue}% claimed</span>
          </div>
          <Progress value={progressValue} aria-label={progressLabel} />
        </div>
        <div className="mt-8">
          <Button variant="ghost" asChild style={{ lineHeight: 1.45 }}>
            <a href={secondaryAction.href}>
              <span className="relative z-[1]">{secondaryAction.label}</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
