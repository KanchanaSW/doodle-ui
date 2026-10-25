/** Miniature used in the block picker so layouts stay recognizable in a long list. */
export type BlockLayout =
  | "center"
  | "split"
  | "terminal"
  | "prompt"
  | "form"
  | "editorial"
  | "bento"
  | "scatter"
  | "quote"
  | "ticket"
  | "browser"
  | "steps"
  | "carousel-single"
  | "carousel-multi"
  | "carousel-split"
  | "carousel-vertical"
  | "carousel-thumbs";

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
      {
        id: "hero-terminal",
        title: "Terminal hero",
        summary: "Install command on a chalkboard, with a keyboard hint.",
        layout: "terminal",
        file: "components/blocks/hero/HeroTerminal.tsx",
      },
      {
        id: "hero-prompt",
        title: "Prompt hero",
        summary: "A highlighted headline and a sketch prompt box.",
        layout: "prompt",
        file: "components/blocks/hero/HeroPrompt.tsx",
      },
      {
        id: "hero-waitlist",
        title: "Waitlist hero",
        summary: "Email signup, overlapping avatars, and a seat meter.",
        layout: "form",
        file: "components/blocks/hero/HeroWaitlist.tsx",
      },
      {
        id: "hero-editorial",
        title: "Editorial hero",
        summary: "A masthead, a giant headline, and a pull quote.",
        layout: "editorial",
        file: "components/blocks/hero/HeroEditorial.tsx",
      },
      {
        id: "hero-bento",
        title: "Bento hero",
        summary: "A feature grid of gauges, people, and controls.",
        layout: "bento",
        file: "components/blocks/hero/HeroBento.tsx",
      },
      {
        id: "hero-sticky",
        title: "Sticky notes hero",
        summary: "A corkboard of tilted notes around the headline.",
        layout: "scatter",
        file: "components/blocks/hero/HeroStickyNotes.tsx",
      },
      {
        id: "hero-testimonial",
        title: "Testimonial hero",
        summary: "A quote as the headline, with wordmark badges.",
        layout: "quote",
        file: "components/blocks/hero/HeroTestimonial.tsx",
      },
      {
        id: "hero-ticket",
        title: "Ticket hero",
        summary: "Event details beside a perforated ticket stub.",
        layout: "ticket",
        file: "components/blocks/hero/HeroTicket.tsx",
      },
      {
        id: "hero-browser",
        title: "Browser hero",
        summary: "Centered copy above a sketched browser window.",
        layout: "browser",
        file: "components/blocks/hero/HeroBrowser.tsx",
      },
      {
        id: "hero-steps",
        title: "Steps hero",
        summary: "A three-step path with a tab for each step.",
        layout: "steps",
        file: "components/blocks/hero/HeroSteps.tsx",
      },
    ],
  },
  {
    slug: "carousel",
    title: "Carousel",
    blocks: [
      {
        id: "carousel-testimonials",
        title: "Testimonial carousel",
        summary: "One quote per slide, with dots that jump to a person.",
        layout: "carousel-single",
        file: "components/blocks/carousel/CarouselTestimonials.tsx",
      },
      {
        id: "carousel-features",
        title: "Feature carousel",
        summary: "Three cards across on desktop, one on a phone.",
        layout: "carousel-multi",
        file: "components/blocks/carousel/CarouselFeatures.tsx",
      },
      {
        id: "carousel-split",
        title: "Split case studies",
        summary: "A headline beside slides, with a counter and caption.",
        layout: "carousel-split",
        file: "components/blocks/carousel/CarouselSplit.tsx",
      },
      {
        id: "carousel-vertical",
        title: "Vertical changelog",
        summary: "Releases stacked, with arrows above and below.",
        layout: "carousel-vertical",
        file: "components/blocks/carousel/CarouselVertical.tsx",
      },
      {
        id: "carousel-gallery",
        title: "Thumbnail gallery",
        summary: "A large slide with numbered thumbs that stay in sync.",
        layout: "carousel-thumbs",
        file: "components/blocks/carousel/CarouselGallery.tsx",
      },
    ],
  },
];
