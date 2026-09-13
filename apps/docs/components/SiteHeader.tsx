import Link from "next/link";
import { ShuffleButton } from "@/components/ShuffleButton";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 h-16 bg-paper/90 dark:bg-chalk/90 backdrop-blur-md border-b border-ink/10 dark:border-white/10">
      <div className="max-w-[1400px] mx-auto h-full px-4 md:px-8 flex items-center justify-between gap-4">
        <Link href="/" className="font-hand text-[28px] leading-none text-ink dark:text-chalkink">
          doodle-ui
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium font-sans">
          <Link href="/install" className="hover:text-accent">
            Install
          </Link>
          <Link href="/docs/button" className="hover:text-accent hidden sm:inline">
            Components
          </Link>
          <ShuffleButton size="sm" />
        </nav>
      </div>
    </header>
  );
}
