import type { CSSProperties } from "react";
import type { DoodleUITheme, FillStyle } from "doodleui-react";
import {
  DEFAULT_BOWING,
  DEFAULT_INK,
  DEFAULT_PAPER,
  DEFAULT_ROUGHNESS,
  DEFAULT_STROKE_WIDTH,
  DARK_SKETCH_COLORS,
  DEFAULT_DARK_INK,
  DEFAULT_DARK_PAPER,
  SKETCH_COLORS,
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
  fontFamily: string;
  googleHref: string;
}[] = [
  {
    key: "patrick",
    label: "Patrick Hand",
    cssVar: "var(--font-patrick-hand), cursive",
    fontFamily: '"Patrick Hand", cursive',
    googleHref:
      "https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap",
  },
  {
    key: "caveat",
    label: "Caveat",
    cssVar: "var(--font-caveat), cursive",
    fontFamily: '"Caveat", cursive',
    googleHref:
      "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap",
  },
  {
    key: "kalam",
    label: "Kalam",
    cssVar: "var(--font-kalam), cursive",
    fontFamily: '"Kalam", cursive',
    googleHref:
      "https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap",
  },
  {
    key: "architects",
    label: "Architects Daughter",
    cssVar: "var(--font-architects-daughter), cursive",
    fontFamily: '"Architects Daughter", cursive',
    googleHref:
      "https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap",
  },
];

export const DEFAULT_GENERATOR_STATE: ThemeGeneratorState = {
  roughness: DEFAULT_ROUGHNESS,
  strokeWidth: DEFAULT_STROKE_WIDTH,
  strokeColor: DEFAULT_INK,
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
      strokeColor: DEFAULT_INK,
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
      strokeColor: DEFAULT_INK,
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

function lightPalette(state: ThemeGeneratorState) {
  return {
    stroke: state.strokeColor,
    bg: DEFAULT_PAPER,
    text: DEFAULT_INK,
    info: SKETCH_COLORS.info,
    warning: SKETCH_COLORS.warning,
    error: SKETCH_COLORS.error,
    success: SKETCH_COLORS.success,
  };
}

function darkPalette(state: ThemeGeneratorState) {
  return {
    stroke: state.dark ? state.strokeColor : DEFAULT_DARK_INK,
    bg: DEFAULT_DARK_PAPER,
    text: DEFAULT_DARK_INK,
    info: DARK_SKETCH_COLORS.info,
    warning: DARK_SKETCH_COLORS.warning,
    error: DARK_SKETCH_COLORS.error,
    success: DARK_SKETCH_COLORS.success,
  };
}

function rootVarLines(state: ThemeGeneratorState, mode: "light" | "dark"): string[] {
  const palette = mode === "dark" ? darkPalette(state) : lightPalette(state);
  const fillStyle =
    state.fillStyle === "none" ? "hachure" : state.fillStyle;
  const font = fontFor(state.fontKey);

  return [
    `  --doodle-ui-roughness: ${state.roughness};`,
    `  --doodle-ui-bowing: ${state.bowing};`,
    `  --doodle-ui-stroke-width: ${state.strokeWidth};`,
    `  --doodle-ui-stroke-color: ${palette.stroke};`,
    `  --doodle-ui-fill-style: ${fillStyle};`,
    `  --doodle-ui-font-family: ${font.fontFamily};`,
    `  --doodle-ui-bg-color: ${palette.bg};`,
    `  --doodle-ui-text-color: ${palette.text};`,
    `  --doodle-ui-color-info: ${palette.info};`,
    `  --doodle-ui-color-warning: ${palette.warning};`,
    `  --doodle-ui-color-error: ${palette.error};`,
    `  --doodle-ui-color-success: ${palette.success};`,
  ];
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
  if (state.strokeColor !== DEFAULT_INK) {
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
  const importLines = [
    `@import url('${font.googleHref}');`,
    `@import "doodleui-react/styles.css";`,
    "",
  ].join("\n");

  let body = `${importLines}:root {\n${rootVarLines(state, "light").join("\n")}\n}`;

  if (state.dark) {
    body += `\n\n[data-theme="dark"] {\n${rootVarLines(state, "dark").join("\n")}\n}`;
  }

  return body;
}

export function previewTheme(state: ThemeGeneratorState): DoodleUITheme {
  return state.dark ? "dark" : "light";
}

export function previewFontFamily(key: FontKey): string {
  return fontFor(key).cssVar;
}

/** Live preview: same variable names as styles.css / buildCssSnippet. */
export function previewScopeCssVars(state: ThemeGeneratorState): CSSProperties {
  const mode = state.dark ? "dark" : "light";
  const palette = mode === "dark" ? darkPalette(state) : lightPalette(state);
  const fillStyle =
    state.fillStyle === "none" ? "hachure" : state.fillStyle;
  const font = fontFor(state.fontKey);

  return {
    "--doodle-ui-roughness": state.roughness,
    "--doodle-ui-bowing": state.bowing,
    "--doodle-ui-stroke-width": state.strokeWidth,
    "--doodle-ui-stroke-color": palette.stroke,
    "--doodle-ui-fill-style": fillStyle,
    "--doodle-ui-font-family": font.fontFamily,
    "--doodle-ui-font": font.cssVar,
    "--doodle-ui-font-weight": "400",
    "--doodle-ui-bg-color": palette.bg,
    "--doodle-ui-text-color": palette.text,
    "--doodle-ui-color-info": palette.info,
    "--doodle-ui-color-warning": palette.warning,
    "--doodle-ui-color-error": palette.error,
    "--doodle-ui-color-success": palette.success,
  } as CSSProperties;
}
