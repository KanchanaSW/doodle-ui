import type { DoodleUITheme, FillStyle } from "doodleui-react";
import {
  DEFAULT_BOWING,
  DEFAULT_ROUGHNESS,
  DEFAULT_STROKE_WIDTH,
} from "doodleui-react";

export type GeneratorFillStyle = FillStyle | "none";

export interface ThemeGeneratorState {
  roughness: number;
  strokeWidth: number;
  strokeColor: string;
  fillStyle: GeneratorFillStyle;
  bowing: number;
  fontKey: FontKey;
  dark: boolean;
}

export type FontKey = "patrick" | "caveat" | "kalam" | "architects";

export const FONT_OPTIONS: {
  key: FontKey;
  label: string;
  cssVar: string;
  googleHref: string;
}[] = [
  {
    key: "patrick",
    label: "Patrick Hand",
    cssVar: "var(--font-patrick-hand), cursive",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap",
  },
  {
    key: "caveat",
    label: "Caveat",
    cssVar: "var(--font-caveat), cursive",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap",
  },
  {
    key: "kalam",
    label: "Kalam",
    cssVar: "var(--font-kalam), cursive",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap",
  },
  {
    key: "architects",
    label: "Architects Daughter",
    cssVar: "var(--font-architects-daughter), cursive",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap",
  },
];

export const DEFAULT_GENERATOR_STATE: ThemeGeneratorState = {
  roughness: DEFAULT_ROUGHNESS,
  strokeWidth: DEFAULT_STROKE_WIDTH,
  strokeColor: "#1f1d1a",
  fillStyle: "hachure",
  bowing: DEFAULT_BOWING,
  fontKey: "patrick",
  dark: false,
};

export const THEME_PRESETS: {
  id: string;
  label: string;
  state: Partial<ThemeGeneratorState>;
}[] = [
  {
    id: "sketchbook",
    label: "Sketchbook",
    state: {
      roughness: 2.4,
      bowing: 1.6,
      strokeWidth: 2,
      fillStyle: "hachure",
      strokeColor: "#1f1d1a",
      dark: false,
    },
  },
  {
    id: "clean",
    label: "Clean Sketch",
    state: {
      roughness: 0.5,
      bowing: 0.3,
      strokeWidth: 1.25,
      fillStyle: "solid",
      strokeColor: "#1f1d1a",
      dark: false,
    },
  },
  {
    id: "blueprint",
    label: "Blueprint",
    state: {
      roughness: 1.2,
      bowing: 1,
      strokeWidth: 1.75,
      fillStyle: "hachure",
      strokeColor: "#7eb6d9",
      dark: true,
    },
  },
];

function fontFor(key: FontKey): (typeof FONT_OPTIONS)[number] {
  return FONT_OPTIONS.find((f) => f.key === key) ?? FONT_OPTIONS[0]!;
}

function providerProps(state: ThemeGeneratorState): string[] {
  const lines: string[] = [];
  lines.push(`theme="${state.dark ? "dark" : "light"}"`);
  if (state.roughness !== DEFAULT_ROUGHNESS) {
    lines.push(`roughness={${state.roughness}}`);
  }
  if (state.strokeWidth !== DEFAULT_STROKE_WIDTH) {
    lines.push(`strokeWidth={${state.strokeWidth}}`);
  }
  if (state.bowing !== DEFAULT_BOWING) {
    lines.push(`bowing={${state.bowing}}`);
  }
  if (state.strokeColor !== "#1f1d1a") {
    lines.push(`sketchColor="${state.strokeColor}"`);
  }
  if (state.fillStyle !== "hachure" && state.fillStyle !== "none") {
    lines.push(`fillStyle="${state.fillStyle}"`);
  }
  return lines;
}

export function buildProviderSnippet(state: ThemeGeneratorState): string {
  const props = providerProps(state);
  const inner = props.length > 0 ? `\n  ${props.join("\n  ")}\n` : "\n";
  return `<DoodleUIProvider${inner}>
  <SketchSeedProvider>
    {/* your app */}
  </SketchSeedProvider>
</DoodleUIProvider>`;
}

export function buildCssSnippet(state: ThemeGeneratorState): string {
  const font = fontFor(state.fontKey);
  const vars: string[] = [];
  if (state.roughness !== DEFAULT_ROUGHNESS) {
    vars.push(`  --doodle-ui-roughness: ${state.roughness};`);
  }
  if (state.strokeWidth !== DEFAULT_STROKE_WIDTH) {
    vars.push(`  --doodle-ui-stroke-width: ${state.strokeWidth};`);
  }
  if (state.bowing !== DEFAULT_BOWING) {
    vars.push(`  --doodle-ui-bowing: ${state.bowing};`);
  }
  if (state.strokeColor !== "#1f1d1a") {
    vars.push(`  --doodle-ui-stroke-color: ${state.strokeColor};`);
  }
  if (state.fillStyle !== "hachure" && state.fillStyle !== "none") {
    vars.push(`  --doodle-ui-fill-style: ${state.fillStyle};`);
  }
  vars.push(`  --doodle-ui-font: ${font.cssVar};`);

  const importLine = `@import url('${font.googleHref}');\n\n`;
  return `${importLine}:root {\n${vars.join("\n")}\n}`;
}

export function previewTheme(state: ThemeGeneratorState): DoodleUITheme {
  return state.dark ? "dark" : "light";
}

export function previewFontFamily(key: FontKey): string {
  return fontFor(key).cssVar;
}
