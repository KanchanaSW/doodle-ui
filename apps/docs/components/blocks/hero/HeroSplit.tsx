import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Progress,
  Switch,
} from "doodleui-react";

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroSplitProps {
  badge?: string;
  title?: string;
  description?: string;
  note?: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  className?: string;
}

const defaultPrimary: HeroAction = { label: "Start a project", href: "#" };
const defaultSecondary: HeroAction = { label: "See the docs", href: "#" };

/**
 * Split hero: copy and actions on the left, a decorative settings card on the right.
 * Built only from doodle-ui components and theme tokens. Pass props to swap the copy,
 * or edit this file and paste it into a project.
 */
export function HeroSplit({
  badge = "Hand-drawn UI",
  title = "Sketch the interface, ship the product",
  description = "A two-column hero with a live-looking settings card. Swap the copy, or replace the card with your own markup.",
  note = "No sign-up needed",
  primaryAction = defaultPrimary,
  secondaryAction = defaultSecondary,
  className,
}: HeroSplitProps) {
  return (
    <section
      className={`bg-paper px-6 py-16 text-ink md:py-24 ${className ?? ""}`.trim()}
    >
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
        <div>
          <Badge variant="accent">{badge}</Badge>
          <h1 className="doodle-shuffle-type mt-5 max-w-[14ch] text-4xl font-semibold !leading-[1.35] tracking-tight md:text-5xl">
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
          <p className="mt-4 text-sm text-mute">{note}</p>
        </div>

        <div className="px-2 py-4 md:rotate-1">
          <Card shadow>
            <CardHeader>
              <CardTitle>Project settings</CardTitle>
              <CardDescription>A sample of the components inside.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="hero-split-name">Project name</Label>
                  <Input id="hero-split-name" defaultValue="Field notes" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="hero-split-public">Public link</Label>
                  <Switch id="hero-split-public" defaultChecked />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm text-mute">
                    <span>Setup</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" style={{ lineHeight: 1.45 }}>
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
