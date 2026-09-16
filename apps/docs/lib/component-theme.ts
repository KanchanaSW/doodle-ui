export const COMPONENT_THEME_STORAGE_KEY = "doodle-ui-component-theme";

export type ComponentTheme = "light" | "dark";

export function readStoredComponentTheme(): ComponentTheme | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(COMPONENT_THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    const legacy = window.localStorage.getItem("doodle-ui-site-theme");
    if (legacy === "light" || legacy === "dark") return legacy;
  } catch {
    /* ignore */
  }
  return null;
}

export function resolveInitialComponentTheme(): ComponentTheme {
  return readStoredComponentTheme() ?? "light";
}

export function applyComponentTheme(theme: ComponentTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-component-theme", theme);
}
