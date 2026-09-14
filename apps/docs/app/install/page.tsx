import Link from "next/link";
import { Alert, Button, Card } from "doodleui-react";

export default function InstallPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16 font-sans">
      <h1 className="text-4xl font-semibold tracking-tight mb-4">Install</h1>
      <p className="text-mute leading-relaxed mb-8 max-w-[65ch]">
        doodle-ui is a React 18+ library. rough.js ships with the package. React stays a peer dependency.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Package</h2>
      <pre className="font-mono text-sm bg-ink text-chalkink p-4 mb-3 overflow-x-auto">{`npm install doodleui-react
pnpm add doodleui-react
yarn add doodleui-react`}</pre>
      <Alert variant="info" title="Package name" className="mb-10">
        Install <code className="font-mono">doodleui-react</code>. The name doodle-ui is blocked on npm by an unpublished 2023 stub.
      </Alert>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Quickstart</h2>
      <p className="text-mute mb-3 max-w-[65ch]">
        Wrap the tree once. TooltipProvider is required for tooltips. SketchSeedProvider is required for Shuffle.
      </p>
      <pre className="font-mono text-sm bg-ink text-chalkink p-4 mb-8 overflow-x-auto">{`import {
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
    <SketchSeedProvider>
      <TooltipProvider>
        <Shuffle />
        <Button variant="primary">Hello</Button>
      </TooltipProvider>
    </SketchSeedProvider>
  );
}`}</pre>

      <Card title="Lock a sketch" className="mb-10">
        <p className="text-sm leading-relaxed m-0">
          Pass <code className="font-mono">seed={"{123}"}</code> to freeze the wobble for visual tests. Omit it to follow the provider seed, which Shuffle increments.
        </p>
      </Card>

      <Link href="/docs/button">
        <Button>Open the Button docs</Button>
      </Link>
    </main>
  );
}
