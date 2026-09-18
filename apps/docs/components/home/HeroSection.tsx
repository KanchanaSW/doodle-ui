import Link from "next/link";
import { Badge, Button } from "doodleui-react";
import { ShuffleButton } from "@/components/ShuffleButton";

export function HeroSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-10 md:pb-14 text-center">
      <div className="inline-flex mb-5">
        <Link href="/docs/button">
          <Badge variant="accent">New · sketch chrome for every control →</Badge>
        </Link>
      </div>
      <h1 className="doodle-shuffle-type text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight leading-[1.08] max-w-[18ch] mx-auto">
        The Hand-Drawn Foundation for your Design System
      </h1>
      <p className="mt-5 text-base md:text-lg text-mute max-w-[48ch] mx-auto leading-relaxed">
        A set of beautifully designed React components that look like you drew
        them. Accessible. Customizable. Open Source. Shuffle redraws the wobble.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/install">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link href="/docs/button">
          <Button size="lg" variant="outline">
            View Components
          </Button>
        </Link>
        <ShuffleButton size="lg" variant="ghost" />
      </div>
    </section>
  );
}
