import { Badge, Button, InlineCode, Stepper, Tab, TabList, TabPanel, Tabs } from "doodleui-react";

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroStep {
  id: string;
  label: string;
  description: string;
  code: string;
}

export interface HeroStepsProps {
  badge?: string;
  title?: string;
  description?: string;
  steps?: HeroStep[];
  primaryAction?: HeroAction;
  className?: string;
}

const defaultSteps: HeroStep[] = [
  {
    id: "install",
    label: "Install",
    description: "Pull the kit into the project you already have.",
    code: "pnpm add doodleui-react",
  },
  {
    id: "compose",
    label: "Compose",
    description: "Drop a block on the page and change the words.",
    code: "<HeroSteps />",
  },
  {
    id: "ship",
    label: "Ship",
    description: "The sketch tokens follow light and dark on their own.",
    code: "git push",
  },
];

const defaultPrimary: HeroAction = { label: "Start at step one", href: "#" };

/**
 * How-it-works hero: a stepper beside tabs for each step.
 * Tabs start on the middle step. Built only from doodle-ui components and theme tokens.
 */
export function HeroSteps({
  badge = "Three moves",
  title = "From a blank file to a page with a pulse",
  description = "Install the package, compose a section, ship it. The open tab matches the current step.",
  steps = defaultSteps,
  primaryAction = defaultPrimary,
  className,
}: HeroStepsProps) {
  const current = Math.min(1, Math.max(0, steps.length - 1));

  return (
    <section className={`bg-paper px-6 py-16 text-ink md:py-24 ${className ?? ""}`.trim()}>
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
        <div>
          <Badge variant="accent">{badge}</Badge>
          <h1 className="doodle-shuffle-type mt-5 max-w-[14ch] text-4xl font-semibold !leading-[1.35] tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-[40ch] text-base leading-relaxed text-mute md:text-lg">
            {description}
          </p>
          <div className="mt-8">
            <Button size="lg" asChild style={{ lineHeight: 1.45 }}>
              <a href={primaryAction.href}>
                <span className="relative z-[1]">{primaryAction.label}</span>
              </a>
            </Button>
          </div>
        </div>

        <div>
          <Stepper
            current={current}
            steps={steps.map((step) => ({ label: step.label }))}
            aria-label="How it ships"
          />
          <div className="mt-6">
            <Tabs defaultValue={steps[current]?.id ?? steps[0]?.id}>
              <TabList>
                {steps.map((step) => (
                  <Tab key={step.id} value={step.id}>
                    {step.label}
                  </Tab>
                ))}
              </TabList>
              {steps.map((step) => (
                <TabPanel key={step.id} value={step.id}>
                  <p className="text-base leading-relaxed text-mute">{step.description}</p>
                  <p className="mt-3">
                    <InlineCode>{step.code}</InlineCode>
                  </p>
                </TabPanel>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
