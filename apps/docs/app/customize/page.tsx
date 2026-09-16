import type { Metadata } from "next";
import { ThemeGenerator } from "@/components/ThemeGenerator";

export const metadata: Metadata = {
  title: "Theme generator",
  description:
    "Tune global sketch roughness, stroke, fill, and fonts — copy a ready-to-paste config.",
};

export default function CustomizePage() {
  return (
    <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-14 font-sans">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
        Theme generator
      </h1>
      <p className="text-mute max-w-[60ch] leading-relaxed mb-10">
        Adjust global sketch parameters and preview Button, Card, Input, Checkbox, and Badge.
        Copy a <code className="font-mono text-sm">DoodleUIProvider</code> block or CSS variables
        for projects that do not wrap everything in React context.
      </p>
      <ThemeGenerator />
    </main>
  );
}
