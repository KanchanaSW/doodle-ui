import Link from "next/link";
import { Badge, Divider } from "doodleui-react";
import { BentoShowcase, HeroSection } from "@/components/home";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <BentoShowcase />

      <footer className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 flex flex-wrap items-center justify-between gap-3 text-sm text-mute">
        <span className="font-hand text-2xl text-ink">doodle-ui</span>
        <div className="flex items-center gap-2">
          <Badge>MIT</Badge>
          <Divider orientation="vertical" style={{ height: 24, minHeight: 24 }} />
          <Link href="/install" className="hover:text-accent">
            Quickstart
          </Link>
          <Divider orientation="vertical" style={{ height: 24, minHeight: 24 }} />
          <a
            href="https://github.com/KanchanaSW/doodle-ui"
            className="hover:text-accent"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
