/**
 * Rendering benchmark for doodleui-react heavy dashboards.
 *
 * Measures React Profiler actualDuration for mount and unrelated updates,
 * plus RoughSvg paintRough invocation count.
 *
 * Usage: pnpm --filter doodleui-react bench:render
 */

import { createElement, Profiler, useState } from "react";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  DoodleUIProvider,
  Input,
  Radio,
  RadioGroup,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "../src/index";
import {
  getRoughPaintCount,
  resetRoughPaintCount,
} from "../src/primitives/RoughSvg";

type Status = "active" | "pending" | "archived";

interface Row {
  id: number;
  name: string;
  status: Status;
  amount: number;
}

interface BenchResult {
  label: string;
  mountMs: number;
  updateMs: number;
  paintsAfterMount: number;
  paintsOnUpdates: number;
  updateSamples: number;
}

const STATUS_VARIANT: Record<Status, "accent" | "default" | "outline"> = {
  active: "accent",
  pending: "default",
  archived: "outline",
};

afterEach(() => {
  cleanup();
});

function makeRows(count: number): Row[] {
  const statuses: Status[] = ["active", "pending", "archived"];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Order #${1000 + i}`,
    status: statuses[i % 3]!,
    amount: 12 + (i % 17) * 3.5,
  }));
}

function stubLayoutGeometry() {
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get() {
      return 120;
    },
  });
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get() {
      return 40;
    },
  });
}

function HeavyDashboard() {
  const rows = makeRows(50);
  const sketch = {
    roughness: 1.5,
    animate: false,
    seed: 42,
  };

  return createElement(
    DoodleUIProvider,
    { animate: false, roughness: 1.5 },
    createElement(
      "div",
      { style: { display: "grid", gap: 16, width: 900 } },
      createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
          },
        },
        createElement(Card, { title: "Open", ...sketch }, "12"),
        createElement(Card, { title: "Pending", ...sketch }, "18"),
        createElement(Card, { title: "Revenue", ...sketch }, "$420"),
      ),
      createElement(
        Card,
        { title: "Filters", shadow: false, ...sketch },
        createElement(
          "div",
          { style: { display: "flex", flexWrap: "wrap", gap: 12 } },
          createElement(Input, {
            label: "Search",
            defaultValue: "",
            ...sketch,
          }),
          createElement(Checkbox, { label: "Archived", ...sketch }),
          createElement(Checkbox, { label: "High value", ...sketch }),
          createElement(Checkbox, { label: "Review", ...sketch }),
          createElement(
            RadioGroup,
            { defaultValue: "any", style: { display: "flex", gap: 8 } },
            createElement(Radio, { value: "any", label: "Any", ...sketch }),
            createElement(Radio, { value: "mine", label: "Mine", ...sketch }),
          ),
          createElement(Switch, { label: "Live", ...sketch }),
        ),
      ),
      createElement(
        Table,
        sketch,
        createElement(
          TableHead,
          null,
          createElement(
            TableRow,
            null,
            createElement(TableHeaderCell, null, "Order"),
            createElement(TableHeaderCell, null, "Status"),
            createElement(TableHeaderCell, null, "Amount"),
            createElement(TableHeaderCell, null, "Action"),
          ),
        ),
        createElement(
          TableBody,
          null,
          ...rows.map((row) =>
            createElement(
              TableRow,
              { key: row.id },
              createElement(TableCell, null, row.name),
              createElement(
                TableCell,
                null,
                createElement(
                  Badge,
                  { variant: STATUS_VARIANT[row.status], ...sketch },
                  row.status,
                ),
              ),
              createElement(TableCell, null, `$${row.amount.toFixed(2)}`),
              createElement(
                TableCell,
                null,
                createElement(
                  Button,
                  { size: "sm", variant: "outline", ...sketch },
                  "View",
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

function App({
  onProfile,
  exposeBump,
}: {
  onProfile: (phase: string, ms: number) => void;
  exposeBump: (fn: () => void) => void;
}) {
  const [tick, setTick] = useState(0);
  exposeBump(() => setTick((t) => t + 1));
  return createElement(
    Profiler,
    {
      id: "bench",
      onRender: (
        _id: string,
        phase: "mount" | "update" | "nested-update",
        actualDuration: number,
      ) => {
        onProfile(phase, actualDuration);
      },
    },
    createElement(
      "div",
      null,
      createElement("span", { "data-tick": String(tick) }),
      createElement(HeavyDashboard),
    ),
  );
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

async function runOnce(label: string): Promise<BenchResult> {
  stubLayoutGeometry();

  const mounts: number[] = [];
  const updates: number[] = [];
  let bump: (() => void) | null = null;

  resetRoughPaintCount();

  let view: ReturnType<typeof render> | null = null;
  await act(async () => {
    view = render(
      createElement(App, {
        onProfile: (phase, ms) => {
          if (phase === "mount") mounts.push(ms);
          else updates.push(ms);
        },
        exposeBump: (fn) => {
          bump = fn;
        },
      }),
    );
  });

  await act(async () => {
    await new Promise((r) => setTimeout(r, 50));
  });

  const paintsAfterMount = getRoughPaintCount();

  resetRoughPaintCount();
  for (let i = 0; i < 5; i++) {
    await act(async () => {
      bump?.();
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 16));
    });
  }
  const paintsOnUpdates = getRoughPaintCount();

  view?.unmount();

  return {
    label,
    mountMs: average(mounts),
    updateMs: average(updates),
    paintsAfterMount,
    paintsOnUpdates,
    updateSamples: updates.length,
  };
}

describe("render benchmark (heavy dashboard)", () => {
  it(
    "reports mount / unrelated-update timings and paint counts",
    async () => {
      const iterations = 5;
      const results: BenchResult[] = [];
      for (let i = 0; i < iterations; i++) {
        results.push(await runOnce(`iter-${i + 1}`));
      }

      const summary = {
        iterations,
        mountMsAvg: average(results.map((r) => r.mountMs)),
        updateMsAvg: average(results.map((r) => r.updateMs)),
        paintsAfterMountAvg: average(results.map((r) => r.paintsAfterMount)),
        paintsOnUnrelatedUpdatesAvg: average(
          results.map((r) => r.paintsOnUpdates),
        ),
        perIteration: results,
      };

      // Always print so `pnpm bench:render` captures numbers in CI / reports.
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(summary, null, 2));
      const { writeFileSync, mkdirSync } = await import("node:fs");
      const { join } = await import("node:path");
      const outDir = join(process.cwd(), ".bench");
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, "latest.json"), JSON.stringify(summary, null, 2));

      expect(summary.mountMsAvg).toBeGreaterThan(0);
      expect(summary.paintsAfterMountAvg).toBeGreaterThan(10);
    },
    60_000,
  );
});
