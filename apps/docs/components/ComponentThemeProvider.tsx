"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DoodleUIProvider,
  SketchSeedProvider,
  TooltipProvider,
  ToastProvider,
} from "doodleui-react";
import {
  COMPONENT_THEME_STORAGE_KEY,
  applyComponentTheme,
  resolveInitialComponentTheme,
  type ComponentTheme,
} from "@/lib/component-theme";

const DOODLE_FONTS = [
  "var(--font-outfit)",
  "var(--font-patrick-hand)",
  "var(--font-kalam)",
  "var(--font-gochi-hand)",
  "var(--font-caveat)",
] as const;

interface ComponentThemeContextValue {
  theme: ComponentTheme;
  setTheme: (theme: ComponentTheme) => void;
  toggleTheme: () => void;
}

const ComponentThemeContext = createContext<ComponentThemeContextValue | null>(
  null,
);

export function ComponentThemeProvider({ children }: { children: ReactNode }) {
  // Read the bootstrap-applied DOM theme on the client so the first paint
  // matches light/dark preference. SSR uses the light default (same as :root).
  const [theme, setThemeState] = useState<ComponentTheme>(
    () => resolveInitialComponentTheme(),
  );

  useEffect(() => {
    const initial = resolveInitialComponentTheme();
    setThemeState(initial);
    applyComponentTheme(initial);
  }, []);

  const setTheme = useCallback((next: ComponentTheme) => {
    setThemeState(next);
    applyComponentTheme(next);
    try {
      window.localStorage.setItem(COMPONENT_THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ComponentThemeContext.Provider value={value}>
      <DoodleUIProvider theme={theme}>
        <SketchSeedProvider fonts={DOODLE_FONTS} initialFontIndex={1}>
          <TooltipProvider delayDuration={200}>
            <ToastProvider position="bottom-right">{children}</ToastProvider>
          </TooltipProvider>
        </SketchSeedProvider>
      </DoodleUIProvider>
    </ComponentThemeContext.Provider>
  );
}

export function useComponentTheme(): ComponentThemeContextValue {
  const ctx = useContext(ComponentThemeContext);
  if (!ctx) {
    throw new Error(
      "useComponentTheme must be used within ComponentThemeProvider",
    );
  }
  return ctx;
}
