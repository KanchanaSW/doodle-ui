"use client";

import {
  DoodleUIProvider,
  SketchSeedProvider,
  TooltipProvider,
} from "doodleui-react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SketchSeedProvider>
      <DoodleUIProvider theme="light">
        <TooltipProvider>{children}</TooltipProvider>
      </DoodleUIProvider>
    </SketchSeedProvider>
  );
}
