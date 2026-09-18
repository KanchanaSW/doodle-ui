"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Button, usePrefersReducedMotion } from "doodleui-react";
import type { PropRow } from "@/lib/props";
import { openStackBlitzProject } from "@/lib/stackblitz";

export const PlaygroundTitleContext = createContext("component");

export interface ControlSlider {
  type: "slider";
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface ControlSelect {
  type: "select";
  key: string;
  label: string;
  options: string[];
  defaultValue: string;
}

export interface ControlToggle {
  type: "toggle";
  key: string;
  label: string;
  defaultValue: boolean;
}

export type Control = ControlSlider | ControlSelect | ControlToggle;

export const sketchControls: Control[] = [
  {
    type: "slider",
    key: "roughness",
    label: "Roughness",
    min: 0,
    max: 3.5,
    step: 0.1,
    defaultValue: 1.5,
  },
  {
    type: "toggle",
    key: "lockSeed",
    label: "Lock seed",
    defaultValue: false,
  },
];

export function Playground({
  render,
  snippet,
  controls,
  title,
}: {
  render: (values: Record<string, unknown>) => ReactNode;
  snippet: (values: Record<string, unknown>) => string;
  controls: Control[];
  /** Used for the StackBlitz project title (e.g. "Button"). Falls back to context. */
  title?: string;
}) {
  const contextTitle = useContext(PlaygroundTitleContext);
  const resolvedTitle = title ?? contextTitle;
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    for (const control of controls) {
      initial[control.key] = control.defaultValue;
    }
    return initial;
  });
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const code = snippet(values);

  function setKey(key: string, value: unknown) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function openInStackBlitz() {
    openStackBlitzProject(resolvedTitle, code);
  }

  return (
    <div className="my-8 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
      <div className="component-canvas relative min-h-[220px] p-8 flex flex-col items-center justify-center gap-3 border border-ink/10">
        {prefersReducedMotion ? (
          <p
            role="status"
            className="absolute top-2 left-2 right-2 text-[12px] leading-snug text-mute border border-ink/15 bg-paper/80 px-2.5 py-1.5"
          >
            Reduced motion is on in your browser — sketches render instantly.{" "}
            <a href="/docs/animation#reduced-motion-support" className="underline underline-offset-2">
              Learn more
            </a>
          </p>
        ) : null}
        <div className={prefersReducedMotion ? "mt-8" : undefined}>{render(values)}</div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="space-y-4">
          {controls.map((control) => {
            if (control.type === "slider") {
              const value = Number(values[control.key]);
              return (
                <label key={control.key} className="block">
                  <span className="flex justify-between text-[13px] font-medium mb-1">
                    {control.label}
                    <span className="font-mono text-mute">{value.toFixed(1)}</span>
                  </span>
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={value}
                    onChange={(event) =>
                      setKey(control.key, Number(event.target.value))
                    }
                    className="w-full accent-accent"
                  />
                </label>
              );
            }
            if (control.type === "select") {
              return (
                <label key={control.key} className="block">
                  <span className="block text-[13px] font-medium mb-1">
                    {control.label}
                  </span>
                  <select
                    value={String(values[control.key])}
                    onChange={(event) => setKey(control.key, event.target.value)}
                    className="w-full bg-transparent border border-ink/20 px-2 py-1.5 text-sm"
                  >
                    {control.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }
            return (
              <label key={control.key} className="flex items-center gap-2 text-[13px] font-medium">
                <input
                  type="checkbox"
                  checked={Boolean(values[control.key])}
                  onChange={(event) => setKey(control.key, event.target.checked)}
                  className="accent-accent"
                />
                {control.label}
              </label>
            );
          })}
        </div>
        <div className="relative">
          <pre className="font-mono text-[12px] leading-relaxed bg-chalkboard text-chalkink p-3 overflow-x-auto whitespace-pre-wrap">
            {code}
          </pre>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={copy}>
              {copied ? "Copied" : "Copy snippet"}
            </Button>
            <Button size="sm" variant="ghost" onClick={openInStackBlitz}>
              Open in StackBlitz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-ink/20">
            <th className="py-2 pr-4 font-semibold">Prop</th>
            <th className="py-2 pr-4 font-semibold">Type</th>
            <th className="py-2 pr-4 font-semibold">Default</th>
            <th className="py-2 font-semibold">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.name}
              className="border-b border-ink/10 align-top"
            >
              <td className="py-2 pr-4 font-mono text-[13px] whitespace-nowrap">
                {row.name}
              </td>
              <td className="py-2 pr-4 font-mono text-[12px] text-mute">
                {row.type}
              </td>
              <td className="py-2 pr-4 font-mono text-[12px]">{row.defaultValue}</td>
              <td className="py-2 text-mute">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function sketchSnippetProps(values: Record<string, unknown>): string {
  const roughness = Number(values.roughness);
  const lock = Boolean(values.lockSeed);
  const bits = [`roughness={${roughness}}`];
  if (lock) bits.push("seed={42}");
  return bits.join(" ");
}
