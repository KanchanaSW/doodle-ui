import { Avatar, Badge, Button, Card, Divider } from "doodleui-react";

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroSpeaker {
  initials: string;
  name: string;
}

export interface HeroTicketProps {
  badge?: string;
  title?: string;
  description?: string;
  speakers?: HeroSpeaker[];
  event?: string;
  seat?: string;
  when?: string;
  where?: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  className?: string;
}

const defaultSpeakers: HeroSpeaker[] = [
  { initials: "AL", name: "Ada Lin" },
  { initials: "OK", name: "Omar Khan" },
  { initials: "SP", name: "S. Patel" },
];
const defaultPrimary: HeroAction = { label: "Get a ticket", href: "#" };
const defaultSecondary: HeroAction = { label: "See the schedule", href: "#" };

/**
 * Event hero: speakers on the left, a tilted ticket stub on the right.
 * Built only from doodle-ui components and theme tokens.
 */
export function HeroTicket({
  badge = "24 Oct · Lisbon",
  title = "A day of crooked interfaces",
  description = "Talks, live sketching, and one long lunch. Three hundred seats, no livestream, paper name tags.",
  speakers = defaultSpeakers,
  event = "Doodle Conf",
  seat = "B12",
  when = "10:00 – 18:00",
  where = "Ribeira hall",
  primaryAction = defaultPrimary,
  secondaryAction = defaultSecondary,
  className,
}: HeroTicketProps) {
  return (
    <section className={`bg-paper px-6 py-16 text-ink md:py-24 ${className ?? ""}`.trim()}>
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
        <div>
          <Badge variant="accent">{badge}</Badge>
          <h1 className="doodle-shuffle-type mt-5 max-w-[14ch] text-4xl font-semibold !leading-[1.35] tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-mute md:text-lg">
            {description}
          </p>
          <ul className="mt-8 flex flex-col gap-3">
            {speakers.map((speaker) => (
              <li key={speaker.initials} className="flex items-center gap-3">
                <Avatar size="sm" fallback={speaker.initials} alt="" />
                <span className="text-sm text-ink">{speaker.name}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button variant="outline" asChild style={{ lineHeight: 1.45 }}>
              <a href={secondaryAction.href}>
                <span className="relative z-[1]">{secondaryAction.label}</span>
              </a>
            </Button>
          </div>
        </div>

        <div className="px-2 py-4 md:rotate-1">
          <Card shadow>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-mute">{event}</p>
                <p className="doodle-shuffle-type mt-2 text-3xl font-semibold !leading-[1.35]">
                  Seat {seat}
                </p>
                <p className="mt-2 text-sm text-mute">{where}</p>
              </div>
              <div className="hidden w-4 sm:block">
                <Divider orientation="vertical" />
              </div>
              <div className="sm:hidden">
                <Divider />
              </div>
              <div className="flex flex-col justify-between gap-4 sm:w-36">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-mute">When</p>
                  <p className="mt-1 text-sm text-ink">{when}</p>
                </div>
                <Button size="sm" asChild style={{ lineHeight: 1.45 }}>
                  <a href={primaryAction.href}>
                    <span className="relative z-[1]">{primaryAction.label}</span>
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
