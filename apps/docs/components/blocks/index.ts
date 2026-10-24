import type { ComponentType } from "react";
import { HeroMinimal } from "./hero/HeroMinimal";
import { HeroSplit } from "./hero/HeroSplit";

export { HeroMinimal } from "./hero/HeroMinimal";
export { HeroSplit } from "./hero/HeroSplit";

/** Live preview component for each block id in `BLOCK_CATEGORIES`. */
export const BLOCK_COMPONENTS: Record<string, ComponentType> = {
  "hero-minimal": HeroMinimal,
  "hero-split": HeroSplit,
};
