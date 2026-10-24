import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { BlockGallery } from "@/components/blocks/BlockGallery";
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
        Page sections you can preview, copy, and edit. Pick a layout, then copy
        that file. Each block is one file of doodle-ui components.
      </p>

      {BLOCK_CATEGORIES.map((category) => (
        <section key={category.slug} className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl font-semibold text-ink">{category.title}</h2>
            <p className="text-sm text-mute">
              {category.blocks.length}{" "}
              {category.blocks.length === 1 ? "layout" : "layouts"}
            </p>
          </div>
          <BlockGallery
            label={category.title}
            blocks={category.blocks.map((block) => {
              const Component = BLOCK_COMPONENTS[block.id];
              if (!Component) {
                throw new Error(`No preview component registered for block "${block.id}".`);
              }
              return {
                id: block.id,
                title: block.title,
                summary: block.summary,
                layout: block.layout,
                source: readBlockSource(block.file),
                preview: <Component />,
              };
            })}
          />
        </section>
      ))}
    </main>
  );
}
