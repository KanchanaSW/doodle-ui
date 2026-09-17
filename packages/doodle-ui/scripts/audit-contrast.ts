/**
 * WCAG contrast audit for doodleui-react sketch strokes and text.
 *
 * Evaluates nominal color contrast and an "effective" sketchy-stroke estimate
 * (rough.js thin/wobbly lines + anti-aliasing reduce perceived contrast).
 *
 * Usage: pnpm --filter doodleui-react audit:contrast
 */

type PairKind = "ui-boundary" | "text";

interface ColorPair {
  component: string;
  mode: "light" | "dark";
  kind: PairKind;
  foreground: string;
  background: string;
  note?: string;
}

interface AuditResult {
  pair: ColorPair;
  nominal: number;
  effective: number;
  threshold: number;
  passNominal: boolean;
  passEffective: boolean;
}

/** Minimum contrast for non-text UI boundaries (WCAG 1.4.11). */
const UI_BOUNDARY_MIN = 3;
/** Minimum contrast for normal text (WCAG 1.4.3 AA). */
const TEXT_MIN = 4.5;
/**
 * Sketchy strokes are thin (~1.4–1.75px), broken, and anti-aliased.
 * Apply a conservative factor so effective contrast is stricter than flat CSS.
 */
const SKETCH_EFFECTIVE_FACTOR = 0.85;

// ---------------------------------------------------------------------------
// Theme tokens (mirrors styles.css + types.ts — update when tokens change)
// ---------------------------------------------------------------------------

const LIGHT = {
  ink: "#1f1d1a",
  paper: "#f7f6f2",
  cardPaper: "#eef0ea",
  accent: "#e24b3b",
  accentInk: "#9b2c20",
  accentFill: "#fce8e4",
  secondaryFill: "#d7e3d4",
  info: "#1d4e89",
  warning: "#8a5200",
  error: "#b91c1c",
  success: "#2d6a4f",
  alertInfoFill: "#d2deec",
  alertWarningFill: "#f8ebd0",
  alertErrorFill: "#f8d4d0",
  alertSuccessFill: "#d3e8dc",
} as const;

const DARK = {
  ink: "#f3f4f6",
  paper: "#131923",
  accent: "#f87171",
  accentFill: "rgba(248, 113, 113, 0.22)",
  secondaryFill: "rgba(255, 255, 255, 0.08)",
  info: "#60a5fa",
  warning: "#fbbf24",
  error: "#f87171",
  success: "#34d399",
  alertInfoFill: "rgba(96, 165, 250, 0.16)",
  alertWarningFill: "rgba(251, 191, 36, 0.16)",
  alertErrorFill: "rgba(248, 113, 113, 0.16)",
  alertSuccessFill: "rgba(52, 211, 153, 0.16)",
  sliderTrack: "rgba(243, 244, 246, 0.55)",
} as const;

// ---------------------------------------------------------------------------
// Color math
// ---------------------------------------------------------------------------

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

function parseColor(input: string): Rgba {
  const s = input.trim().toLowerCase();
  if (s.startsWith("#")) {
    const hex = s.slice(1);
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map((c) => c + c)
            .join("")
        : hex.length === 8
          ? hex.slice(0, 6)
          : hex;
    const n = Number.parseInt(full, 16);
    return {
      r: (n >> 16) & 255,
      g: (n >> 8) & 255,
      b: n & 255,
      a: hex.length === 8 ? ((Number.parseInt(hex.slice(6), 16) / 255) || 1) : 1,
    };
  }
  const rgba = s.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/,
  );
  if (rgba) {
    return {
      r: Number(rgba[1]),
      g: Number(rgba[2]),
      b: Number(rgba[3]),
      a: rgba[4] !== undefined ? Number(rgba[4]) : 1,
    };
  }
  throw new Error(`Unsupported color: ${input}`);
}

/** Composite translucent fg over opaque bg (source-over). */
function composite(fg: Rgba, bg: Rgba): Rgba {
  const a = fg.a + bg.a * (1 - fg.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  return {
    r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
    g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
    b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
    a,
  };
}

function channelToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(color: Rgba): number {
  const r = channelToLinear(color.r);
  const g = channelToLinear(color.g);
  const b = channelToLinear(color.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fg: string, bg: string): number {
  const bgRgba = parseColor(bg);
  if (bgRgba.a < 1) {
    throw new Error(`Background must be opaque: ${bg}`);
  }
  let fgRgba = parseColor(fg);
  if (fgRgba.a < 1) {
    fgRgba = composite(fgRgba, bgRgba);
  }
  const L1 = relativeLuminance(fgRgba);
  const L2 = relativeLuminance(bgRgba);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

function effectiveSketchContrast(nominal: number, kind: PairKind): number {
  if (kind === "text") return nominal;
  return nominal * SKETCH_EFFECTIVE_FACTOR;
}

// ---------------------------------------------------------------------------
// Pair matrix
// ---------------------------------------------------------------------------

function buildPairs(): ColorPair[] {
  const pairs: ColorPair[] = [];

  // Shared stroke / text on paper
  pairs.push(
    {
      component: "defaults",
      mode: "light",
      kind: "ui-boundary",
      foreground: LIGHT.ink,
      background: LIGHT.paper,
      note: "--doodle-ui-stroke-color on --doodle-ui-bg-color",
    },
    {
      component: "defaults",
      mode: "light",
      kind: "text",
      foreground: LIGHT.ink,
      background: LIGHT.paper,
      note: "--doodle-ui-text-color on paper",
    },
    {
      component: "defaults",
      mode: "dark",
      kind: "ui-boundary",
      foreground: DARK.ink,
      background: DARK.paper,
      note: "--doodle-ui-stroke-color on --doodle-ui-bg-color",
    },
    {
      component: "defaults",
      mode: "dark",
      kind: "text",
      foreground: DARK.ink,
      background: DARK.paper,
      note: "--doodle-ui-text-color on paper",
    },
  );

  // Button / Card / Input / Badge outline — ink on paper
  for (const component of [
    "Button",
    "Card",
    "Input",
    "Textarea",
    "Select",
    "Checkbox",
    "Radio",
    "Switch",
    "Toggle",
    "Modal",
    "Dialog",
    "Popover",
    "Tooltip",
    "DropdownMenu",
    "ContextMenu",
    "Menubar",
    "NavigationMenu",
    "Sheet",
    "Drawer",
    "ScrollArea",
    "Command",
    "Combobox",
    "Table",
    "Pagination",
    "Breadcrumb",
    "Accordion",
    "Collapsible",
    "Tabs",
    "Progress",
    "Divider",
    "Skeleton",
    "Stepper",
    "Avatar",
    "Kbd",
    "Empty",
    "Carousel",
    "Sidebar",
    "HoverCard",
    "Toast",
    "AlertDialog",
    "NativeSelect",
    "InputOTP",
    "InputGroup",
    "Field",
    "Resizable",
  ] as const) {
    pairs.push(
      {
        component,
        mode: "light",
        kind: "ui-boundary",
        foreground: LIGHT.ink,
        background: LIGHT.paper,
      },
      {
        component,
        mode: "dark",
        kind: "ui-boundary",
        foreground: DARK.ink,
        background: DARK.paper,
      },
      {
        component,
        mode: "light",
        kind: "text",
        foreground: LIGHT.ink,
        background: LIGHT.paper,
      },
      {
        component,
        mode: "dark",
        kind: "text",
        foreground: DARK.ink,
        background: DARK.paper,
      },
    );
  }

  // Badge accent text on accent fill
  pairs.push(
    {
      component: "Badge",
      mode: "light",
      kind: "text",
      foreground: LIGHT.accentInk,
      background: LIGHT.accentFill,
      note: "variant=accent text (accentInk) on accentFill",
    },
    {
      component: "Badge",
      mode: "light",
      kind: "ui-boundary",
      foreground: LIGHT.accentInk,
      background: LIGHT.accentFill,
      note: "variant=accent stroke (accentInk) on accentFill",
    },
    {
      component: "Badge",
      mode: "dark",
      kind: "text",
      foreground: DARK.accent,
      background: DARK.paper,
      note: "accent text on dark paper (fill is translucent)",
    },
    {
      component: "Badge",
      mode: "dark",
      kind: "ui-boundary",
      foreground: DARK.accent,
      background: DARK.paper,
      note: "accent stroke on dark paper",
    },
    {
      component: "Badge",
      mode: "light",
      kind: "text",
      foreground: LIGHT.ink,
      background: LIGHT.secondaryFill,
      note: "variant=default text on secondaryFill",
    },
  );

  // Alert / Toast status strokes on fills
  const alertVariants = [
    { name: "info", stroke: LIGHT.info, fill: LIGHT.alertInfoFill },
    { name: "warning", stroke: LIGHT.warning, fill: LIGHT.alertWarningFill },
    { name: "error", stroke: LIGHT.error, fill: LIGHT.alertErrorFill },
    { name: "success", stroke: LIGHT.success, fill: LIGHT.alertSuccessFill },
  ] as const;

  for (const v of alertVariants) {
    for (const component of ["Alert", "Toast"] as const) {
      pairs.push(
        {
          component,
          mode: "light",
          kind: "ui-boundary",
          foreground: v.stroke,
          background: v.fill,
          note: `${v.name} stroke on fill`,
        },
        {
          component,
          mode: "light",
          kind: "text",
          foreground: LIGHT.ink,
          background: v.fill,
          note: `${v.name} body text on fill`,
        },
      );
    }
  }

  const darkAlertVariants = [
    { name: "info", stroke: DARK.info, fill: DARK.alertInfoFill },
    { name: "warning", stroke: DARK.warning, fill: DARK.alertWarningFill },
    { name: "error", stroke: DARK.error, fill: DARK.alertErrorFill },
    { name: "success", stroke: DARK.success, fill: DARK.alertSuccessFill },
  ] as const;

  for (const v of darkAlertVariants) {
    for (const component of ["Alert", "Toast"] as const) {
      // Composite translucent fill over paper for background
      const fillOnPaper = compositeToHex(v.fill, DARK.paper);
      pairs.push(
        {
          component,
          mode: "dark",
          kind: "ui-boundary",
          foreground: v.stroke,
          background: fillOnPaper,
          note: `${v.name} stroke on fill (composited over paper)`,
        },
        {
          component,
          mode: "dark",
          kind: "text",
          foreground: DARK.ink,
          background: fillOnPaper,
          note: `${v.name} body text on fill`,
        },
      );
    }
  }

  // Status colors as text on fill (Alert title) and on paper
  for (const [name, color, fill] of [
    ["info", LIGHT.info, LIGHT.alertInfoFill],
    ["warning", LIGHT.warning, LIGHT.alertWarningFill],
    ["error", LIGHT.error, LIGHT.alertErrorFill],
    ["success", LIGHT.success, LIGHT.alertSuccessFill],
  ] as const) {
    pairs.push(
      {
        component: "Alert",
        mode: "light",
        kind: "text",
        foreground: color,
        background: fill,
        note: `${name} title on fill`,
      },
      {
        component: "Alert",
        mode: "light",
        kind: "text",
        foreground: color,
        background: LIGHT.paper,
        note: `${name} title on paper`,
      },
    );
  }

  for (const [name, color] of [
    ["info", DARK.info],
    ["warning", DARK.warning],
    ["error", DARK.error],
    ["success", DARK.success],
  ] as const) {
    pairs.push({
      component: "Alert",
      mode: "dark",
      kind: "text",
      foreground: color,
      background: DARK.paper,
      note: `${name} title on paper`,
    });
  }

  // Slider track (dark mode low-opacity ink)
  pairs.push({
    component: "Slider",
    mode: "dark",
    kind: "ui-boundary",
    foreground: DARK.sliderTrack,
    background: DARK.paper,
    note: "track stroke rgba(ink, 0.55) on paper",
  });
  pairs.push({
    component: "Slider",
    mode: "light",
    kind: "ui-boundary",
    foreground: LIGHT.ink,
    background: LIGHT.paper,
    note: "track stroke on paper",
  });

  // Accent on paper (Button primary, Switch on, Tabs underline)
  pairs.push(
    {
      component: "Button",
      mode: "light",
      kind: "ui-boundary",
      foreground: LIGHT.accent,
      background: LIGHT.paper,
      note: "primary accent stroke",
    },
    {
      component: "Button",
      mode: "dark",
      kind: "ui-boundary",
      foreground: DARK.accent,
      background: DARK.paper,
      note: "primary accent stroke",
    },
    {
      component: "Switch",
      mode: "light",
      kind: "ui-boundary",
      foreground: LIGHT.accent,
      background: LIGHT.paper,
      note: "on-state track",
    },
    {
      component: "Switch",
      mode: "dark",
      kind: "ui-boundary",
      foreground: DARK.accent,
      background: DARK.paper,
      note: "on-state track",
    },
  );

  return pairs;
}

function compositeToHex(fg: string, bg: string): string {
  const c = composite(parseColor(fg), parseColor(bg));
  const toHex = (n: number) =>
    Math.round(n).toString(16).padStart(2, "0");
  return `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

function audit(): AuditResult[] {
  return buildPairs().map((pair) => {
    const nominal = contrastRatio(pair.foreground, pair.background);
    const effective = effectiveSketchContrast(nominal, pair.kind);
    const threshold = pair.kind === "text" ? TEXT_MIN : UI_BOUNDARY_MIN;
    return {
      pair,
      nominal,
      effective,
      threshold,
      passNominal: nominal >= threshold,
      passEffective: effective >= threshold,
    };
  });
}

function fmt(n: number): string {
  return n.toFixed(2);
}

function main() {
  const results = audit();
  const failures = results.filter((r) => !r.passEffective || !r.passNominal);

  console.log("doodleui-react WCAG contrast audit");
  console.log(
    `Pairs: ${results.length} | Thresholds: UI ${UI_BOUNDARY_MIN}:1, text ${TEXT_MIN}:1 | Sketch factor: ${SKETCH_EFFECTIVE_FACTOR}`,
  );
  console.log("");

  if (failures.length === 0) {
    console.log("PASS — all pairs meet WCAG AA (nominal + effective).");
  } else {
    console.log(`FAIL — ${failures.length} pair(s):\n`);
    for (const r of failures) {
      const { pair } = r;
      const flags = [
        !r.passNominal ? "nominal" : null,
        !r.passEffective ? "effective" : null,
      ]
        .filter(Boolean)
        .join("+");
      console.log(
        `  [${flags}] ${pair.component} (${pair.mode}/${pair.kind})`,
      );
      console.log(
        `    ${pair.foreground} on ${pair.background} → ${fmt(r.nominal)}:1 nominal, ${fmt(r.effective)}:1 effective (need ${r.threshold}:1)`,
      );
      if (pair.note) console.log(`    note: ${pair.note}`);
    }
  }

  // Summary table by component mode for report consumption
  console.log("\n--- JSON summary ---");
  const summary = {
    total: results.length,
    failures: failures.length,
    sketchEffectiveFactor: SKETCH_EFFECTIVE_FACTOR,
    results: results.map((r) => ({
      component: r.pair.component,
      mode: r.pair.mode,
      kind: r.pair.kind,
      foreground: r.pair.foreground,
      background: r.pair.background,
      note: r.pair.note,
      nominal: Number(r.nominal.toFixed(3)),
      effective: Number(r.effective.toFixed(3)),
      threshold: r.threshold,
      pass: r.passNominal && r.passEffective,
    })),
  };
  console.log(JSON.stringify(summary, null, 2));

  process.exit(failures.length > 0 ? 1 : 0);
}

main();
