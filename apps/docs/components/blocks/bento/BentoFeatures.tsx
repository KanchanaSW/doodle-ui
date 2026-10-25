import { Badge, Button, Kbd, SketchBox } from "doodleui-react";

export interface BentoFeatureAction {
  label: string;
  href: string;
}

export interface BentoFeaturesProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
  primaryAction?: BentoFeatureAction;
  className?: string;
}

const defaultAction: BentoFeatureAction = { label: "Steal this section", href: "#" };

/**
 * Asymmetric feature bento: one tall promise, two short proofs, and a wide key row.
 * Built only from doodle-ui components and theme tokens.
 */
export function BentoFeatures({
  eyebrow = "On the page",
  title = "A grid that refuses to line up",
  intro = "The tall tile holds the promise. The short ones hold the proof. Nothing in the row is the same size.",
  primaryAction = defaultAction,
  className,
}: BentoFeaturesProps) {
  return (
    <section className={`bg-paper px-6 py-16 text-ink md:py-24 ${className ?? ""}`.trim()}>
      <div className="mx-auto max-w-5xl">
        <Badge variant="accent">{eyebrow}</Badge>
        <h2 className="mt-4 max-w-[16ch] text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-[48ch] leading-relaxed text-mute">{intro}</p>

        <div className="mt-10 grid gap-3 md:grid-cols-4">
          <SketchBox
            shadow
            seed={42}
            className="md:col-span-2 md:row-span-2"
            contentStyle={{ padding: 24, height: "100%" }}
          >
            <p className="font-hand text-3xl leading-none text-accent">✎</p>
            <h3 className="mt-4 text-2xl font-semibold leading-snug text-ink">
              Sketch the chrome. Leave the behavior alone.
            </h3>
            <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-mute">
              Borders wobble. Buttons, tabs, and forms still do the job they always did. The ink is decoration you can point at.
            </p>
            <div className="mt-6">
              <Button asChild style={{ lineHeight: 1.45 }}>
                <a href={primaryAction.href}>
                  <span className="relative z-[1]">{primaryAction.label}</span>
                </a>
              </Button>
            </div>
          </SketchBox>

          <SketchBox shadow seed={42} contentStyle={{ padding: 20 }}>
            <p className="text-sm text-mute">Seeds</p>
            <h3 className="mt-2 text-lg font-semibold text-ink">The wobble stays put</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              Pin a number and the stroke does not jump on the next reload.
            </p>
          </SketchBox>

          <SketchBox shadow seed={42} contentStyle={{ padding: 20 }}>
            <p className="text-sm text-mute">Themes</p>
            <h3 className="mt-2 text-lg font-semibold text-ink">Night paper, same ink</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              Flip the page dark. The stroke follows. You do not repaint the tiles.
            </p>
          </SketchBox>

          <SketchBox
            shadow
            seed={42}
            className="md:col-span-2"
            contentStyle={{ padding: 20 }}
          >
            <p className="text-sm text-mute">From the keyboard</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink">
              <li className="flex items-center justify-between gap-3">
                <span>Move between tiles</span>
                <Kbd seed={42}>Tab</Kbd>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span>Open the one you want</span>
                <Kbd seed={42}>Enter</Kbd>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span>Leave without a click</span>
                <Kbd seed={42}>Esc</Kbd>
              </li>
            </ul>
          </SketchBox>
        </div>
      </div>
    </section>
  );
}
