import type { ComponentType } from "react";
import { HeroBento } from "./hero/HeroBento";
import { HeroBrowser } from "./hero/HeroBrowser";
import { HeroEditorial } from "./hero/HeroEditorial";
import { HeroMinimal } from "./hero/HeroMinimal";
import { HeroPrompt } from "./hero/HeroPrompt";
import { HeroSplit } from "./hero/HeroSplit";
import { HeroSteps } from "./hero/HeroSteps";
import { HeroStickyNotes } from "./hero/HeroStickyNotes";
import { HeroTerminal } from "./hero/HeroTerminal";
import { HeroTestimonial } from "./hero/HeroTestimonial";
import { HeroTicket } from "./hero/HeroTicket";
import { HeroWaitlist } from "./hero/HeroWaitlist";

export { HeroBento } from "./hero/HeroBento";
export { HeroBrowser } from "./hero/HeroBrowser";
export { HeroEditorial } from "./hero/HeroEditorial";
export { HeroMinimal } from "./hero/HeroMinimal";
export { HeroPrompt } from "./hero/HeroPrompt";
export { HeroSplit } from "./hero/HeroSplit";
export { HeroSteps } from "./hero/HeroSteps";
export { HeroStickyNotes } from "./hero/HeroStickyNotes";
export { HeroTerminal } from "./hero/HeroTerminal";
export { HeroTestimonial } from "./hero/HeroTestimonial";
export { HeroTicket } from "./hero/HeroTicket";
export { HeroWaitlist } from "./hero/HeroWaitlist";

/** Live preview component for each block id in `BLOCK_CATEGORIES`. */
export const BLOCK_COMPONENTS: Record<string, ComponentType> = {
  "hero-minimal": HeroMinimal,
  "hero-split": HeroSplit,
  "hero-terminal": HeroTerminal,
  "hero-prompt": HeroPrompt,
  "hero-waitlist": HeroWaitlist,
  "hero-editorial": HeroEditorial,
  "hero-bento": HeroBento,
  "hero-sticky": HeroStickyNotes,
  "hero-testimonial": HeroTestimonial,
  "hero-ticket": HeroTicket,
  "hero-browser": HeroBrowser,
  "hero-steps": HeroSteps,
};
