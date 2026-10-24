export interface BlockEntry {
  id: string;
  title: string;
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
        file: "components/blocks/hero/HeroMinimal.tsx",
      },
      {
        id: "hero-split",
        title: "Split hero",
        file: "components/blocks/hero/HeroSplit.tsx",
      },
    ],
  },
];
