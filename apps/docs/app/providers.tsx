"use client";

import type { ReactNode } from "react";
import { SketchSeedProvider, TooltipProvider } from "doodle-ui";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SketchSeedProvider>
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
    </SketchSeedProvider>
  );
}
