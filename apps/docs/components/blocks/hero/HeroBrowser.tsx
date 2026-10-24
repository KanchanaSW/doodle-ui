import { Badge, Button, Input, Skeleton, SketchBox } from "doodleui-react";

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroBrowserProps {
  badge?: string;
  title?: string;
  description?: string;
  address?: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  className?: string;
}

const defaultPrimary: HeroAction = { label: "Open the app", href: "#" };
const defaultSecondary: HeroAction = { label: "Watch a tour", href: "#" };

/**
 * Product-shot hero: centered copy above a sketched browser window.
 * The address field is read-only. Built only from doodle-ui components and theme tokens.
 */
export function HeroBrowser({
  badge = "Now in the browser",
  title = "The product, still looking like a drawing",
  description = "A window frame, an address bar, and a page that has not finished loading. Swap the skeletons for your own screenshot.",
  address = "doodleui.dev/app",
  primaryAction = defaultPrimary,
  secondaryAction = defaultSecondary,
  className,
}: HeroBrowserProps) {
  return (
    <section
      className={`bg-paper px-6 py-16 text-center text-ink md:py-24 ${className ?? ""}`.trim()}
    >
      <div className="mx-auto max-w-5xl">
        <div className="inline-flex">
          <Badge variant="accent">{badge}</Badge>
        </div>
        <h1 className="doodle-shuffle-type mx-auto mt-5 max-w-[16ch] text-4xl font-semibold !leading-[1.35] tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-[48ch] text-base leading-relaxed text-mute md:text-lg">
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

        <div className="relative mx-auto mt-12 max-w-4xl text-left">
          <SketchBox shadow contentStyle={{ padding: 12 }}>
            <div className="flex items-center gap-3">
              <span className="flex shrink-0 gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full border-2 border-ink" />
                <span className="h-2.5 w-2.5 rounded-full border-2 border-ink" />
                <span className="h-2.5 w-2.5 rounded-full border-2 border-ink" />
              </span>
              <div className="min-w-0 flex-1">
                <Input
                  id="hero-browser-address"
                  readOnly
                  defaultValue={address}
                  aria-label="Address"
                />
              </div>
            </div>
            <div className="mt-3 flex gap-3">
              <div className="hidden w-28 shrink-0 flex-col gap-2 sm:flex">
                <Skeleton variant="text" height={14} pulse={false} />
                <Skeleton variant="text" height={14} pulse={false} />
                <Skeleton variant="text" height={14} pulse={false} />
                <Skeleton variant="text" height={14} pulse={false} />
              </div>
              <div className="grid min-w-0 flex-1 grid-cols-2 gap-3">
                <Skeleton variant="rect" height={88} pulse={false} />
                <Skeleton variant="rect" height={88} pulse={false} />
                <Skeleton variant="rect" height={72} className="col-span-2" pulse={false} />
              </div>
            </div>
          </SketchBox>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-paper to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
