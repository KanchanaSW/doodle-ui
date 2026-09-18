import Link from "next/link";
import { Alert, Button, Card } from "doodleui-react";
import {
  CliInstallTabs,
  PackageInstallTabs,
} from "@/components/InstallCommands";

export default function InstallPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16 font-sans">
      <h1 className="text-4xl font-semibold tracking-tight mb-4">Install</h1>
      <p className="text-mute leading-relaxed mb-8 max-w-[65ch]">
        doodle-ui is a React 18+ library. rough.js ships with the package. React stays a peer dependency.
      </p>

      <h2 className="text-2xl font-semibold mb-3">CLI (shadcn-style installer)</h2>
      <p className="text-mute mb-3 max-w-[65ch]">
        Copy component source code directly into your project so you own the styling, hooks, and sketch parameters.
        The CLI detects your package manager from lockfiles (
        <code className="font-mono">package-lock.json</code>,{" "}
        <code className="font-mono">pnpm-lock.yaml</code>,{" "}
        <code className="font-mono">yarn.lock</code>,{" "}
        <code className="font-mono">bun.lockb</code> / <code className="font-mono">bun.lock</code>
        ).
      </p>
      <CliInstallTabs />

      <h2 className="text-2xl font-semibold mt-10 mb-3">Package (npm dependency)</h2>
      <PackageInstallTabs />
      <Alert variant="info" title="Package name" className="mb-10">
        Install <code className="font-mono">doodleui-react</code>. The name doodle-ui is blocked on npm by an unpublished 2023 stub.
      </Alert>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Quickstart</h2>
      <p className="text-mute mb-3 max-w-[65ch]">
        Wrap the tree once. TooltipProvider is required for tooltips. ToastProvider is required for toasts. SketchSeedProvider is required for Shuffle. DoodleUIProvider is optional — animations default on, and you can pass `animate={false}` on a component or on the provider.
      </p>
      <pre className="font-mono text-sm bg-chalkboard text-chalkink p-4 mb-8 overflow-x-auto">{`import {
  DoodleUIProvider,
  SketchSeedProvider,
  TooltipProvider,
  Button,
  useSketchSeed,
} from "doodleui-react";

function Shuffle() {
  const { shuffle } = useSketchSeed();
  return <Button onClick={shuffle}>Shuffle</Button>;
}

export function App() {
  return (
    <DoodleUIProvider>
      <SketchSeedProvider>
        <TooltipProvider>
          <Shuffle />
          <Button variant="primary">Hello</Button>
        </TooltipProvider>
      </SketchSeedProvider>
    </DoodleUIProvider>
  );
}`}</pre>

      <p className="text-mute mb-6 max-w-[65ch] leading-relaxed">
        Global theming: import{" "}
        <code className="font-mono">doodleui-react/styles.css</code> and override{" "}
        <code className="font-mono">--doodle-ui-*</code> variables. See{" "}
        <Link href="/docs/theming" className="text-accent hover:underline">
          Theming
        </Link>{" "}
        or the{" "}
        <Link href="/customize" className="text-accent hover:underline">
          theme generator
        </Link>
        .
      </p>

      <Card title="Lock a sketch" className="mb-10">
        <p className="text-sm leading-relaxed m-0">
          Pass <code className="font-mono">seed={"{123}"}</code> to freeze the wobble for visual tests. Omit it to follow the provider seed, which Shuffle increments.
        </p>
      </Card>

      <h2 className="text-2xl font-semibold mt-10 mb-3">SSR / Next.js</h2>
      <p className="text-mute mb-3 max-w-[65ch] leading-relaxed">
        doodleui-react is SSR-safe with the Next.js App Router and Pages Router.
        Uncontrolled sketch seeds use a fixed default on the server and during the
        first client hydration pass, then pick a random seed after mount. That keeps
        React hydration quiet — you will not see mismatch warnings from rough.js wobble.
      </p>
      <p className="text-mute mb-3 max-w-[65ch] leading-relaxed">
        Because of that, the hand-drawn &quot;wobble&quot; for components without an explicit{" "}
        <code className="font-mono">seed</code> may settle only after the page is
        interactive. Pass <code className="font-mono">seed={"{123}"}</code> or wrap with{" "}
        <code className="font-mono">{`<SketchSeedProvider initialSeed={123}>`}</code> when
        you need a stable sketch on first paint (screenshots, Chromatic, marketing pages).
      </p>
      <p className="text-mute mb-10 max-w-[65ch] leading-relaxed">
        Shuffle via <code className="font-mono">useSketchSeed()</code> is user-triggered
        after mount and is unaffected. Import components from a Client Component (
        <code className="font-mono">&apos;use client&apos;</code>) or from a Server Component
        that renders them as children — every public component already ships with the
        client directive.
      </p>

      <Link href="/docs/button">
        <Button>Open the Button docs</Button>
      </Link>
    </main>
  );
}
