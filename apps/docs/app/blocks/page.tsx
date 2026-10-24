import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { BlockPreview } from "@/components/blocks/BlockPreview";
import { BLOCK_COMPONENTS } from "@/components/blocks";
import { BLOCK_CATEGORIES } from "@/lib/blocks";

export const metadata: Metadata = {
  title: "Blocks",
  description: "Copy-paste page sections built from doodle-ui components.",
};

function readBlockSource(file: string) {
  return fs.readFileSync(path.join(process.cwd(), file), "utf8");
}

export default function BlocksPage() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-12 font-sans md:px-8 md:py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Blocks</h1>
      <p className="mt-4 max-w-[62ch] leading-relaxed text-mute">
        Page sections you can preview, copy, and edit. Each block is one file
        of doodle-ui components. More heroes will land in this list.
      </p>

      {BLOCK_CATEGORIES.map((category) => (
        <section key={category.slug} className="mt-12">
          <h2 className="text-2xl font-semibold text-ink">{category.title}</h2>
          <div className="mt-6 space-y-12">
            {category.blocks.map((block) => {
              const Component = BLOCK_COMPONENTS[block.id];
              if (!Component) {
                throw new Error(`No preview component registered for block "${block.id}".`);
              }
              return (
                <BlockPreview
                  key={block.id}
                  title={block.title}
                  source={readBlockSource(block.file)}
                >
                  <Component />
                </BlockPreview>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
