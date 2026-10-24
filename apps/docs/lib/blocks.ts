/** Miniature used in the block picker so layouts stay recognizable in a long list. */
export type BlockLayout = "center" | "split";

export interface BlockEntry {
  id: string;
  title: string;
  /** One line in the picker. The live preview carries the full copy. */
  summary: string;
  layout: BlockLayout;
  /** Path relative to the docs app root (`apps/docs`). */
  file: string;
}

export interface BlockCategory {
  slug: string;
  title: string;
  blocks: BlockEntry[];
}

export const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    slug: "hero",
    title: "Hero",
    blocks: [
      {
        id: "hero-minimal",
        title: "Minimal hero",
        summary: "Centered badge, headline, and two actions.",
        layout: "center",
        file: "components/blocks/hero/HeroMinimal.tsx",
      },
      {
        id: "hero-split",
        title: "Split hero",
        summary: "Headline on the left, a settings card on the right.",
        layout: "split",
        file: "components/blocks/hero/HeroSplit.tsx",
      },
    ],
  },
];
