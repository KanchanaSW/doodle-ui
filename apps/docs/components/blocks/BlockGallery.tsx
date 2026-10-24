"use client";

import { useState, type ReactNode } from "react";
import type { BlockLayout } from "@/lib/blocks";
import { BlockPreview } from "./BlockPreview";

export interface GalleryBlock {
  id: string;
  title: string;
  summary: string;
  layout: BlockLayout;
  source: string;
  preview: ReactNode;
}

function LayoutThumb({ layout }: { layout: BlockLayout }) {
  const bar = "h-1.5 bg-ink";
  const button = "mt-1 h-3 w-9 border-2 border-ink";
  return (
    <div
      aria-hidden
      className="flex h-20 w-full items-center gap-3 border border-ink/30 bg-white/70 px-3 dark:bg-white/5"
    >
      {layout === "split" ? (
        <>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className={`${bar} w-4/5`} />
            <span className={`${bar} w-3/5 opacity-40`} />
            <span className={button} />
          </div>
          <div className="h-14 w-[38%] shrink-0 border-2 border-ink" />
        </>
      ) : (
        <div className="flex w-full flex-col items-center gap-1.5">
          <span className={`${bar} w-2/5`} />
          <span className={`${bar} w-3/5 opacity-40`} />
          <span className={button} />
        </div>
      )}
    </div>
  );
}

export function BlockGallery({
  label,
  blocks,
}: {
  label: string;
  blocks: GalleryBlock[];
}) {
  const [selectedId, setSelectedId] = useState(blocks[0]?.id ?? "");
  const selected = blocks.find((block) => block.id === selectedId) ?? blocks[0];

  if (!selected) return null;

  return (
    <div className="mt-6">
      <div
        role="radiogroup"
        aria-label={`${label} layouts`}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {blocks.map((block) => {
          const selectedCard = block.id === selected.id;
          return (
            <button
              key={block.id}
              type="button"
              role="radio"
              aria-checked={selectedCard}
              onClick={() => setSelectedId(block.id)}
              className={`flex flex-col gap-3 border p-3 text-left transition-colors hover:bg-ink/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                selectedCard ? "border-accent bg-ink/[0.03]" : "border-ink/25 bg-paper"
              }`}
            >
              <LayoutThumb layout={block.layout} />
              <span>
                <span className="block text-base font-semibold text-ink">{block.title}</span>
                <span className="mt-1 block text-sm leading-snug text-mute">{block.summary}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-8">
        <BlockPreview title={selected.title} source={selected.source}>
          {selected.preview}
        </BlockPreview>
      </div>
    </div>
  );
}
