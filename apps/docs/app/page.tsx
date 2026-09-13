import Link from "next/link";
import { Badge, Button, Card, Divider } from "doodleui-react";
import { HeroSketch } from "@/components/HeroSketch";
import { ShuffleButton } from "@/components/ShuffleButton";
import { COMPONENT_PAGES } from "@/lib/nav";

export default function HomePage() {
  return (
    <main>
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,460px)] items-center min-h-[calc(100dvh-4rem)]">
        <div>
          <h1 className="doodle-shuffle-type text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] max-w-[16ch]">
            UI that looks like you drew it
          </h1>
          <p className="mt-5 text-lg text-mute dark:text-chalkink/75 max-w-[42ch] leading-relaxed">
            React components with Excalidraw-like chrome. Text stays HTML. Shuffle redraws the wobble.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ShuffleButton size="lg" />
            <Link href="/docs/button">
              <Button size="lg" variant="outline">
                Components
              </Button>
            </Link>
          </div>
        </div>
        <HeroSketch />
      </section>

      <section className="max-w-[1400px] mx-auto px-4 md:px-8 pb-20">
        <p className="font-mono text-[13px] text-mute mb-3">Install</p>
        <pre className="font-mono text-sm md:text-base bg-ink text-chalkink px-5 py-4 inline-block">
          npm install doodleui-react
        </pre>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 md:px-8 pb-24">
        <h2 className="doodle-shuffle-type text-3xl font-semibold tracking-tight mb-8">
          Twelve pieces, one pencil
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMPONENT_PAGES.map((item) => (
            <Link key={item.slug} href={`/docs/${item.slug}`} className="block">
              <Card title={item.title} shadow={false} style={{ height: "100%" }}>
                <p className="text-sm text-mute dark:text-chalkink/70 m-0">{item.blurb}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 md:px-8 pb-24">
        <h2 className="doodle-shuffle-type text-3xl md:text-4xl font-semibold tracking-tight leading-tight max-w-[20ch]">
          Sketch the frame. Keep the accessibility.
        </h2>
        <p className="mt-4 max-w-[65ch] text-[15px] leading-relaxed text-mute dark:text-chalkink/80">
          Modal, tooltip, checkbox, and radio sit on Radix primitives. Focus traps, Escape, and ARIA come for free. rough.js only draws the SVG layer behind the real controls. Pass a seed to lock a doodle for tests or screenshots. Skip it and Shuffle gives every line a new wobble.
        </p>
        <div className="mt-6">
          <Link href="/docs/button">
            <Button variant="secondary">Browse components</Button>
          </Link>
        </div>
      </section>

      <footer className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 flex flex-wrap items-center justify-between gap-3 text-sm text-mute">
        <span className="font-hand text-2xl text-ink dark:text-chalkink">doodle-ui</span>
        <div className="flex items-center gap-2">
          <Badge>MIT</Badge>
          <Divider orientation="vertical" style={{ height: 24, minHeight: 24 }} />
          <Link href="/install" className="hover:text-accent">
            Quickstart
          </Link>
        </div>
      </footer>
    </main>
  );
}
