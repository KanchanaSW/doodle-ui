"use client";

import { Switch } from "doodleui-react";
import { useComponentTheme } from "@/components/ComponentThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useComponentTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="flex items-center gap-2 text-[13px] font-medium"
      role="group"
      aria-label="Component color theme"
    >
      <span
        className={isDark ? "text-mute" : "text-ink font-semibold"}
        aria-hidden="true"
      >
        Light
      </span>
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label={isDark ? "Switch components to light theme" : "Switch components to dark theme"}
      />
      <span
        className={isDark ? "text-ink font-semibold" : "text-mute"}
        aria-hidden="true"
      >
        Dark
      </span>
    </div>
  );
}
