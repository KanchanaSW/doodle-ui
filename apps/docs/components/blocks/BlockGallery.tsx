"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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

function ThumbFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`flex h-14 w-full items-center gap-2 overflow-hidden border border-ink/30 bg-white/70 px-2 dark:bg-white/5 ${className ?? ""}`.trim()}
    >
      {children}
    </div>
  );
}

function LayoutThumb({ layout }: { layout: BlockLayout }) {
  const bar = "h-1 bg-ink";
  const faint = `${bar} opacity-40`;
  const button = "h-2.5 w-7 border-2 border-ink";
  const box = "border-2 border-ink";

  switch (layout) {
    case "split":
      return (
        <ThumbFrame>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className={`${bar} w-4/5`} />
            <span className={`${faint} w-3/5`} />
            <span className={button} />
          </div>
          <div className={`${box} h-10 w-[38%] shrink-0`} />
        </ThumbFrame>
      );
    case "terminal":
      return (
        <ThumbFrame className="bg-chalkboard dark:bg-chalkboard">
          <div className="flex w-full flex-col gap-1">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 bg-chalkink" />
              <span className="h-1.5 w-1.5 bg-chalkink opacity-60" />
              <span className="h-1.5 w-1.5 bg-chalkink opacity-30" />
            </span>
            <span className="h-1 w-4/5 bg-chalkink" />
            <span className="h-1 w-1/2 bg-chalkink opacity-60" />
          </div>
        </ThumbFrame>
      );
    case "prompt":
      return (
        <ThumbFrame>
          <div className="flex w-full flex-col items-center gap-1.5">
            <span className={`${bar} w-1/2`} />
            <span className="h-4 w-4/5 rounded-full border-2 border-ink" />
          </div>
        </ThumbFrame>
      );
    case "form":
      return (
        <ThumbFrame>
          <div className="flex w-full flex-col items-center gap-1.5">
            <span className={`${bar} w-2/5`} />
            <span className="flex w-4/5 items-center gap-1">
              <span className="h-3 flex-1 border-2 border-ink" />
              <span className={button} />
            </span>
            <span className={`${faint} w-1/2`} />
          </div>
        </ThumbFrame>
      );
    case "editorial":
      return (
        <ThumbFrame>
          <div className="flex w-full flex-col gap-1">
            <span className={`${faint} w-full`} />
            <span className="h-2.5 w-full bg-ink" />
            <span className="h-2.5 w-3/5 bg-ink" />
          </div>
        </ThumbFrame>
      );
    case "bento":
      return (
        <ThumbFrame>
          <div className="grid h-10 w-full grid-cols-4 grid-rows-2 gap-1">
            <span className={`${box} col-span-1 row-span-2`} />
            <span className={box} />
            <span className={`${box} col-span-2`} />
            <span className={`${box} col-span-3`} />
          </div>
        </ThumbFrame>
      );
    case "scatter":
      return (
        <ThumbFrame>
          <div className="relative h-10 w-full">
            <span className={`${box} absolute left-1 top-1 h-5 w-7 -rotate-6 bg-accent/30`} />
            <span className={`${box} absolute right-2 top-0 h-5 w-8 rotate-3`} />
            <span className={`${box} absolute bottom-0 left-1/3 h-5 w-8 rotate-2 bg-ink/10`} />
          </div>
        </ThumbFrame>
      );
    case "quote":
      return (
        <ThumbFrame>
          <div className="flex w-full flex-col items-center gap-1">
            <span className="text-lg font-semibold leading-none text-ink">“</span>
            <span className={`${bar} w-3/5`} />
            <span className={`${faint} w-2/5`} />
          </div>
        </ThumbFrame>
      );
    case "ticket":
      return (
        <ThumbFrame>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className={`${bar} w-3/5`} />
            <span className={`${faint} w-2/5`} />
          </div>
          <div className="flex h-10 w-[46%] shrink-0 border-2 border-ink">
            <span className="flex-1" />
            <span className="w-px bg-ink/50" />
            <span className="w-1/3" />
          </div>
        </ThumbFrame>
      );
    case "browser":
      return (
        <ThumbFrame>
          <div className="flex h-10 w-full flex-col border-2 border-ink">
            <span className="flex h-3 items-center gap-0.5 border-b-2 border-ink px-1">
              <span className="h-1 w-1 bg-ink" />
              <span className="h-1 w-1 bg-ink" />
              <span className="h-1 w-1 bg-ink" />
            </span>
            <span className="flex flex-1 gap-1 p-1">
              <span className="w-1/4 bg-ink/20" />
              <span className="flex-1 bg-ink/10" />
            </span>
          </div>
        </ThumbFrame>
      );
    case "steps":
      return (
        <ThumbFrame>
          <div className="flex w-full items-center">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center border-2 border-ink text-[10px] leading-none text-ink">
              1
            </span>
            <span className="h-px flex-1 bg-ink" />
            <span className="flex h-5 w-5 shrink-0 items-center justify-center border-2 border-accent text-[10px] leading-none text-accent">
              2
            </span>
            <span className="h-px flex-1 bg-ink/30" />
            <span className="flex h-5 w-5 shrink-0 items-center justify-center border-2 border-ink text-[10px] leading-none text-ink">
              3
            </span>
          </div>
        </ThumbFrame>
      );
    case "center":
      return (
        <ThumbFrame>
          <div className="flex w-full flex-col items-center gap-1">
            <span className={`${bar} w-2/5`} />
            <span className={`${faint} w-3/5`} />
            <span className={button} />
          </div>
        </ThumbFrame>
      );
  }
}

export function BlockGallery({
  label,
  blocks,
}: {
  label: string;
  blocks: GalleryBlock[];
}) {
  const [selectedId, setSelectedId] = useState(blocks[0]?.id ?? "");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function fromHash() {
      const id = window.location.hash.replace(/^#/, "");
      if (id && blocks.some((block) => block.id === id)) {
        setSelectedId(id);
      }
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [blocks]);

  const selected = blocks.find((block) => block.id === selectedId) ?? blocks[0];

  if (!selected) return null;

  function select(id: string) {
    setSelectedId(id);
    const next = `${window.location.pathname}${window.location.search}#${id}`;
    window.history.replaceState(null, "", next);
    if (window.matchMedia("(max-width: 1279px)").matches) {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="mt-6">
      <div
        role="radiogroup"
        aria-label={`${label} layouts`}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {blocks.map((block) => {
          const selectedCard = block.id === selected.id;
          return (
            <button
              key={block.id}
              type="button"
              role="radio"
              aria-checked={selectedCard}
              onClick={() => select(block.id)}
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
      <div ref={previewRef} className="mt-8 scroll-mt-24">
        <BlockPreview title={selected.title} source={selected.source}>
          {selected.preview}
        </BlockPreview>
      </div>
    </div>
  );
}
