import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "doodleui-react vs shadcn/ui · Hand-Drawn UI Kit Comparison",
  },
  description:
    "When to reach for a hand-drawn sketch UI kit versus a conventional library like shadcn/ui. Compare philosophy, Radix UI accessibility, theming, and performance.",
  keywords: [
    "doodleui vs shadcn",
    "hand-drawn UI library",
    "sketch style React components",
    "shadcn alternative hand-drawn",
    "excalidraw React components",
    "roughjs UI kit",
  ],
  openGraph: {
    title: "doodleui-react vs shadcn/ui · Hand-Drawn UI Kit Comparison",
    description:
      "When to reach for a hand-drawn sketch UI kit versus a conventional library like shadcn/ui. Compare philosophy, Radix UI accessibility, theming, and performance.",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "doodleui-react vs shadcn/ui · Hand-Drawn UI Kit Comparison",
    description:
      "When to reach for a hand-drawn sketch UI kit versus a conventional library like shadcn/ui.",
  },
};

const COMPARISON_ROWS = [
  {
    dimension: "Visual philosophy",
    shadcn:
      "Neutral modernism — solid lines, crisp edges, designed to disappear into product chrome.",
    doodle:
      "Sketch / organic — rough.js wobble, hachure fills, and draw-in strokes that read as hand-drawn.",
  },
  {
    dimension: "Theming",
    shadcn:
      "CSS variables mapped to Tailwind tokens (--background, --primary, --border, and friends).",
    doodle:
      "CSS variables for sketch + palette (--doodle-ui-roughness, --doodle-ui-stroke-color, …), with optional DoodleUIProvider defaults.",
  },
  {
    dimension: "Accessibility",
    shadcn:
      "Built on Radix UI primitives — keyboard nav, focus management, and WAI-ARIA patterns come with the headless layer.",
    doodle:
      "Same foundation: Radix UI for behavior, real HTML text (not SVG glyphs). A shared strength, not a trade-off.",
  },
  {
    dimension: "Installation",
    shadcn:
      "CLI copies component source into your repo (npx shadcn add …). You own the code.",
    doodle:
      "Same model via CLI (npx doodleui-react add …), plus an optional npm package (doodleui-react) if you prefer a dependency.",
  },
  {
    dimension: "Bundle & runtime",
    shadcn:
      "CSS borders and utilities — no sketch engine. Lean for dense, high-frequency UI.",
    doodle:
      "rough.js generates SVG chrome at runtime. Honest overhead vs solid CSS; mitigated with seed caching and prefers-reduced-motion.",
  },
] as const;

export default function VsShadcnPage() {
  return (
    <div>
      <h1 className="text-4xl md:text-[2.75rem] font-semibold tracking-tight leading-[1.1] mb-4">
        doodleui-react vs shadcn/ui
      </h1>
      <p className="text-base leading-relaxed text-mute mb-4 max-w-[65ch]">
        This is not a “better than” page. shadcn/ui and doodleui-react solve different
        visual jobs. One leans formal and invisible; the other leans sketchy and
        characterful. The useful question is{" "}
        <em className="not-italic text-ink">when</em> a hand-drawn aesthetic is the
        right choice — and when it isn&apos;t.
      </p>

      <h2 className="text-2xl font-semibold tracking-tight mt-12 mb-3">
        When a hand-drawn UI kit fits
      </h2>
      <p className="text-base leading-relaxed text-mute mb-4 max-w-[65ch]">
        Reach for sketch chrome when the product should feel provisional, playful, or
        educational — closer to a whiteboard than a bank statement:
      </p>
      <ul className="list-disc pl-5 mb-4 space-y-1 text-mute max-w-[65ch]">
        <li>Whiteboarding, brainstorming, and mind-mapping tools</li>
        <li>Educational platforms, tutorials, and interactive learning</li>
        <li>Playful consumer apps, journals, and hobbyist tools</li>
        <li>Prototyping, wireframing, and design-sprint surfaces</li>
        <li>Creative portfolios and design showcases</li>
        <li>Kids&apos; products, casual games, and light quizzes</li>
      </ul>

      <h2 className="text-2xl font-semibold tracking-tight mt-12 mb-3">
        When it usually doesn&apos;t
      </h2>
      <p className="text-base leading-relaxed text-mute mb-4 max-w-[65ch]">
        Prefer a conventional kit (shadcn/ui or similar) when trust, density, and a
        formal visual tone matter more than personality:
      </p>
      <ul className="list-disc pl-5 mb-4 space-y-1 text-mute max-w-[65ch]">
        <li>Enterprise dashboards, ERPs, and mission-critical admin consoles</li>
        <li>Fintech, banking, trading, and other high-trust money UIs</li>
        <li>Regulated healthcare or legal workflows</li>
        <li>Any product that needs to look solid, precise, and institutional</li>
      </ul>
      <p className="text-base leading-relaxed text-mute mb-4 max-w-[65ch]">
        Wobbly borders on a balance sheet read as unfinished, not friendly. That
        mismatch is the most common adoption miss — not missing features.
      </p>

      <h2 className="text-2xl font-semibold tracking-tight mt-12 mb-3">
        Side-by-side
      </h2>
      <p className="text-base leading-relaxed text-mute mb-4 max-w-[65ch]">
        A handful of substantive distinctions — not a feature checklist war:
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-left text-sm border-collapse min-w-[40rem]">
          <thead>
            <tr className="border-b border-ink/20">
              <th className="py-2 pr-4 font-semibold w-[18%]">Dimension</th>
              <th className="py-2 pr-4 font-semibold w-[41%]">shadcn/ui</th>
              <th className="py-2 font-semibold w-[41%]">doodleui-react</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.dimension} className="border-b border-ink/10 align-top">
                <td className="py-3 pr-4 font-medium text-ink whitespace-nowrap">
                  {row.dimension}
                </td>
                <td className="py-3 pr-4 text-mute leading-relaxed">{row.shadcn}</td>
                <td className="py-3 text-mute leading-relaxed">{row.doodle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold tracking-tight mt-12 mb-3">
        Using both in one app
      </h2>
      <p className="text-base leading-relaxed text-mute mb-4 max-w-[65ch]">
        Because both libraries lean on Radix UI and CSS variables, they can sit side
        by side. You do not have to rip out shadcn/ui to try a sketch section.
      </p>
      <p className="text-base leading-relaxed text-mute mb-4 max-w-[65ch]">
        A common pattern: keep shadcn for the dense shell (nav, tables, settings) and
        use doodleui-react for a playful slice — onboarding, empty states, milestone
        modals, or a brainstorming canvas. Scope the sketch tree with{" "}
        <code className="font-mono text-[13px] bg-ink/5 px-1.5 py-0.5 rounded-sm">
          DoodleUIProvider
        </code>
        :
      </p>
      <pre className="font-mono text-[13px] leading-relaxed bg-chalkboard text-chalkink p-4 overflow-x-auto mb-6">{`import { DoodleUIProvider, Button, Card } from "doodleui-react";
import "doodleui-react/styles.css";

export function OnboardingStep() {
  return (
    <DoodleUIProvider>
      <Card title="Welcome">
        <p>Sketch UI for this flow only.</p>
        <Button>Continue</Button>
      </Card>
    </DoodleUIProvider>
  );
}`}</pre>
      <p className="text-base leading-relaxed text-mute mb-4 max-w-[65ch]">
        Install either as a package or via the{" "}
        <Link href="/install" className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent">
          CLI
        </Link>{" "}
        (<code className="font-mono text-[13px] bg-ink/5 px-1.5 py-0.5 rounded-sm">
          npx doodleui-react add …
        </code>
        ), the same source-copy idea as shadcn. Then tune sketch tokens under{" "}
        <Link href="/docs/theming" className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent">
          Theming
        </Link>
        .
      </p>
    </div>
  );
}
