"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  DoodleUIProvider,
  Input,
  SketchSeedProvider,
  Slider,
  Switch,
  TooltipProvider,
  useSketchSeed,
  type FillStyle,
} from "doodleui-react";
import {
  buildCssSnippet,
  buildProviderSnippet,
  DEFAULT_GENERATOR_STATE,
  FONT_OPTIONS,
  previewFontFamily,
  previewTheme,
  THEME_PRESETS,
  type GeneratorFillStyle,
  type ThemeGeneratorState,
} from "@/lib/theme-generator";

function PreviewShuffle() {
  const { shuffle } = useSketchSeed();
  return (
    <Button size="sm" variant="outline" onClick={shuffle}>
      Shuffle
    </Button>
  );
}

function PreviewPanel({ state }: { state: ThemeGeneratorState }) {
  const fillStyle =
    state.fillStyle === "none" ? undefined : (state.fillStyle as FillStyle);
  const sketchColor = state.strokeColor;

  const scopeStyle = useMemo(
    () =>
      ({
        "--doodle-ui-font": previewFontFamily(state.fontKey),
        "--doodle-ui-font-weight": "400",
      }) as CSSProperties,
    [state.fontKey],
  );

  return (
    <DoodleUIProvider
      theme={previewTheme(state)}
      roughness={state.roughness}
      strokeWidth={state.strokeWidth}
      sketchColor={sketchColor}
      bowing={state.bowing}
      fillStyle={fillStyle}
    >
      <SketchSeedProvider>
        <div
          className={`component-canvas rounded-lg border border-ink/10 p-6 md:p-8 min-h-[280px] ${
            state.dark ? "bg-[#131923]" : ""
          }`}
          style={scopeStyle}
        >
          <div className="flex justify-end mb-4">
            <PreviewShuffle />
          </div>
          <div className="grid gap-5 max-w-md">
            <div className="flex flex-wrap gap-2 items-center">
              <Button variant="primary">Primary</Button>
              <Button variant="outline">Outline</Button>
              <Badge variant="accent">Badge</Badge>
            </div>
            <Card title="Card" shadow fillStyle={fillStyle}>
              <p className="text-sm m-0 opacity-80">Sketch parameters update live.</p>
            </Card>
            <Input label="Email" placeholder="you@example.com" />
            <Checkbox label="Remember me" defaultChecked />
          </div>
        </div>
      </SketchSeedProvider>
    </DoodleUIProvider>
  );
}

export function ThemeGenerator() {
  const [state, setState] = useState<ThemeGeneratorState>(DEFAULT_GENERATOR_STATE);
  const [copied, setCopied] = useState<"provider" | "css" | null>(null);

  const providerSnippet = useMemo(() => buildProviderSnippet(state), [state]);
  const cssSnippet = useMemo(() => buildCssSnippet(state), [state]);

  function patch(partial: Partial<ThemeGeneratorState>) {
    setState((current) => ({ ...current, ...partial }));
  }

  async function copy(which: "provider" | "css") {
    const text = which === "provider" ? providerSnippet : cssSnippet;
    await navigator.clipboard.writeText(text);
    setCopied(which);
    window.setTimeout(() => setCopied(null), 1400);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] items-start">
      <div className="space-y-6 font-sans text-sm">
        <div>
          <p className="font-semibold mb-2">Presets</p>
          <div className="flex flex-wrap gap-2">
            {THEME_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                size="sm"
                variant="outline"
                onClick={() => setState({ ...DEFAULT_GENERATOR_STATE, ...preset.state })}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="font-medium">Roughness ({state.roughness.toFixed(1)})</span>
          <Slider
            className="mt-2"
            min={0}
            max={3}
            step={0.1}
            value={[state.roughness]}
            onValueChange={([v]) => patch({ roughness: v })}
          />
        </label>

        <label className="block">
          <span className="font-medium">Stroke width ({state.strokeWidth.toFixed(2)})</span>
          <Slider
            className="mt-2"
            min={0.5}
            max={4}
            step={0.05}
            value={[state.strokeWidth]}
            onValueChange={([v]) => patch({ strokeWidth: v })}
          />
        </label>

        <label className="block">
          <span className="font-medium">Bowing ({state.bowing.toFixed(1)})</span>
          <Slider
            className="mt-2"
            min={0}
            max={3}
            step={0.1}
            value={[state.bowing]}
            onValueChange={([v]) => patch({ bowing: v })}
          />
        </label>

        <label className="block">
          <span className="font-medium">Stroke color</span>
          <input
            type="color"
            className="mt-2 h-10 w-full cursor-pointer rounded border border-ink/15 bg-paper"
            value={state.strokeColor}
            onChange={(e) => patch({ strokeColor: e.target.value })}
          />
        </label>

        <label className="block">
          <span className="font-medium">Fill style</span>
          <select
            className="mt-2 w-full rounded border border-ink/15 bg-paper px-3 py-2 font-sans"
            value={state.fillStyle}
            onChange={(e) =>
              patch({ fillStyle: e.target.value as GeneratorFillStyle })
            }
          >
            <option value="hachure">Hachure</option>
            <option value="solid">Solid</option>
            <option value="cross-hatch">Cross-hatch</option>
            <option value="none">None</option>
          </select>
        </label>

        <label className="block">
          <span className="font-medium">Font</span>
          <select
            className="mt-2 w-full rounded border border-ink/15 bg-paper px-3 py-2 font-sans"
            value={state.fontKey}
            onChange={(e) =>
              patch({ fontKey: e.target.value as ThemeGeneratorState["fontKey"] })
            }
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
        </label>

        <div className="flex items-center justify-between gap-3">
          <span className="font-medium">Dark preview</span>
          <Switch
            checked={state.dark}
            onCheckedChange={(checked) => patch({ dark: checked })}
            aria-label="Dark preview"
          />
        </div>
      </div>

      <div className="space-y-6">
        <TooltipProvider>
          <PreviewPanel state={state} />
        </TooltipProvider>

        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="font-mono text-[13px] text-mute m-0">DoodleUIProvider</p>
            <Button size="sm" variant="ghost" onClick={() => copy("provider")}>
              {copied === "provider" ? "Copied" : "Copy snippet"}
            </Button>
          </div>
          <pre className="font-mono text-xs md:text-sm bg-ink text-chalkink p-4 overflow-x-auto rounded">
            {providerSnippet}
          </pre>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="font-mono text-[13px] text-mute m-0">CSS variables</p>
            <Button size="sm" variant="ghost" onClick={() => copy("css")}>
              {copied === "css" ? "Copied" : "Copy snippet"}
            </Button>
          </div>
          <pre className="font-mono text-xs md:text-sm bg-ink text-chalkink p-4 overflow-x-auto rounded">
            {cssSnippet}
          </pre>
        </div>

        <p className="text-sm text-mute leading-relaxed m-0">
          Set defaults on <code className="font-mono">DoodleUIProvider</code> or with{" "}
          <code className="font-mono">--doodle-ui-*</code> CSS variables. Per-component{" "}
          <code className="font-mono">roughness</code> props still override either.
        </p>
      </div>
    </div>
  );
}
