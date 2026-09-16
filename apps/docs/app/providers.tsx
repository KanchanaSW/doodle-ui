"use client";

import type { ReactNode } from "react";
import { ComponentThemeProvider } from "@/components/ComponentThemeProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <ComponentThemeProvider>{children}</ComponentThemeProvider>;
}
