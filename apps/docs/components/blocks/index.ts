import type { ComponentType } from "react";
import { HeroMinimal } from "./hero/HeroMinimal";

export { HeroMinimal } from "./hero/HeroMinimal";

/** Live preview component for each block id in `BLOCK_CATEGORIES`. */
export const BLOCK_COMPONENTS: Record<string, ComponentType> = {
  "hero-minimal": HeroMinimal,
};
