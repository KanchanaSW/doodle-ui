import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { DoodleUIProvider } from "../animations";
import { SketchSeedProvider } from "../hooks/useSketchSeed";

interface ProvidersProps {
  children: ReactNode;
  animate?: boolean;
  seed?: number;
}

function Providers({ children, animate = true, seed = 42 }: ProvidersProps) {
  return (
    <DoodleUIProvider animate={animate} theme="light">
      <SketchSeedProvider initialSeed={seed}>{children}</SketchSeedProvider>
    </DoodleUIProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    animate?: boolean;
    seed?: number;
  },
) {
  const { animate, seed, ...rest } = options ?? {};
  return render(ui, {
    wrapper: ({ children }) => (
      <Providers animate={animate} seed={seed}>
        {children}
      </Providers>
    ),
    ...rest,
  });
}

export { setPrefersReducedMotion } from "./match-media";
