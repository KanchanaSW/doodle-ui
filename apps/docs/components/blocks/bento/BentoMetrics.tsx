import { Badge, Progress, RadialProgress, SketchBox } from "doodleui-react";

export interface BentoStat {
  label: string;
  value: string;
  note: string;
}

export interface BentoMeter {
  label: string;
  value: number;
}

export interface BentoMetricsProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
  stats?: BentoStat[];
  meters?: BentoMeter[];
  coverage?: number;
  className?: string;
}

const defaultStats: BentoStat[] = [
  { label: "Parts in the box", value: "56", note: "Each one already sketched." },
  { label: "Files in this section", value: "1", note: "Copy it. Change the sentences." },
  { label: "Themes to maintain", value: "2", note: "Day paper and night paper." },
];

const defaultMeters: BentoMeter[] = [
  { label: "Buttons in real pages", value: 92 },
  { label: "Forms that ship", value: 64 },
  { label: "Nav that stays put", value: 81 },
];

/**
 * Dashboard bento: three counts, a gauge, and a stack of meters.
 * Built only from doodle-ui components and theme tokens.
 */
export function BentoMetrics({
  eyebrow = "The tally",
  title = "How the kit is holding up",
  intro = "Counts on the top row. A gauge in the corner. Meters underneath, so the eye moves down the page instead of across a spreadsheet.",
  stats = defaultStats,
  meters = defaultMeters,
  coverage = 86,
  className,
}: BentoMetricsProps) {
  return (
    <section className={`bg-paper px-6 py-16 text-ink md:py-24 ${className ?? ""}`.trim()}>
      <div className="mx-auto max-w-5xl">
        <Badge variant="accent">{eyebrow}</Badge>
        <h2 className="mt-4 max-w-[18ch] text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-[52ch] leading-relaxed text-mute">{intro}</p>

        <div className="mt-10 grid gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <SketchBox key={stat.label} shadow seed={42} contentStyle={{ padding: 20 }}>
              <p className="text-sm text-mute">{stat.label}</p>
              <p className="mt-3 font-hand text-5xl leading-none text-ink">{stat.value}</p>
              <p className="mt-3 text-sm leading-relaxed text-mute">{stat.note}</p>
            </SketchBox>
          ))}

          <SketchBox
            shadow
            seed={42}
            className="md:row-span-2"
            contentStyle={{ padding: 20 }}
          >
            <p className="text-sm text-mute">Sketch coverage</p>
            <div className="mt-4 flex justify-center">
              <RadialProgress value={coverage} size={132} seed={42} aria-label="Sketch coverage" />
            </div>
            <p className="mt-3 text-center text-sm text-mute">{coverage} of 100 tiles inked</p>
          </SketchBox>

          <SketchBox
            shadow
            seed={42}
            className="md:col-span-3"
            contentStyle={{ padding: 20 }}
          >
            <p className="text-sm text-mute">Where the ink actually lands</p>
            <ul className="mt-4 flex flex-col gap-4">
              {meters.map((meter) => (
                <li key={meter.label}>
                  <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-ink">{meter.label}</span>
                    <span className="font-hand text-lg leading-none text-ink">{meter.value}</span>
                  </div>
                  <Progress value={meter.value} seed={42} aria-label={meter.label} />
                </li>
              ))}
            </ul>
          </SketchBox>
        </div>
      </div>
    </section>
  );
}
