import {
  Avatar,
  Badge,
  Button,
  Label,
  RadialProgress,
  SketchBox,
  Slider,
  Switch,
  ToggleGroup,
  ToggleGroupItem,
} from "doodleui-react";

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroBentoProps {
  badge?: string;
  title?: string;
  description?: string;
  primaryAction?: HeroAction;
  className?: string;
}

const defaultPrimary: HeroAction = { label: "Open the kit", href: "#" };

/**
 * Feature-grid hero: a headline over a bento of gauges, people, and controls.
 * Controls are uncontrolled. Built only from doodle-ui components and theme tokens.
 */
export function HeroBento({
  badge = "One kit, many tiles",
  title = "Lay the product out like a sketchbook",
  description = "A gauge, a crew, a tool switch, and a slider. Each tile is a component you can lift out.",
  primaryAction = defaultPrimary,
  className,
}: HeroBentoProps) {
  return (
    <section className={`bg-paper px-6 py-16 text-ink md:py-24 ${className ?? ""}`.trim()}>
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex">
            <Badge variant="accent">{badge}</Badge>
          </div>
          <h1 className="doodle-shuffle-type mx-auto mt-5 max-w-[16ch] text-4xl font-semibold !leading-[1.35] tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-[46ch] text-base leading-relaxed text-mute md:text-lg">
            {description}
          </p>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-4">
          <SketchBox shadow className="md:col-span-1 md:row-span-2" contentStyle={{ padding: 16 }}>
            <p className="text-sm text-mute">Sketch coverage</p>
            <div className="mt-3 flex justify-center">
              <RadialProgress value={86} size={120} aria-label="Sketch coverage" />
            </div>
          </SketchBox>

          <SketchBox shadow contentStyle={{ padding: 16 }}>
            <p className="text-sm text-mute">In the room</p>
            <ul className="mt-3 flex flex-col gap-2">
              {[
                ["AL", "Ada"],
                ["OK", "Omar"],
                ["SP", "Sera"],
              ].map(([initials, name]) => (
                <li key={initials} className="flex items-center gap-2">
                  <Avatar size="sm" fallback={initials} alt="" />
                  <span className="text-sm">{name}</span>
                </li>
              ))}
            </ul>
          </SketchBox>

          <SketchBox shadow className="md:col-span-2" contentStyle={{ padding: 16 }}>
            <p className="text-sm text-mute">Today&apos;s tool</p>
            <div className="mt-3">
              <ToggleGroup type="single" defaultValue="draw" aria-label="Tool">
                <ToggleGroupItem value="draw">Draw</ToggleGroupItem>
                <ToggleGroupItem value="type">Type</ToggleGroupItem>
                <ToggleGroupItem value="erase">Erase</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </SketchBox>

          <SketchBox shadow className="md:col-span-3" contentStyle={{ padding: 16 }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Switch id="hero-bento-rough" defaultChecked />
                <Label htmlFor="hero-bento-rough">Keep the wobble</Label>
              </div>
              <div className="min-w-0 flex-1 sm:max-w-xs">
                <Label htmlFor="hero-bento-ink" className="mb-2 block text-sm text-mute">
                  Ink weight
                </Label>
                <Slider id="hero-bento-ink" defaultValue={[62]} aria-label="Ink weight" />
              </div>
            </div>
          </SketchBox>
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" asChild style={{ lineHeight: 1.45 }}>
            <a href={primaryAction.href}>
              <span className="relative z-[1]">{primaryAction.label}</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
