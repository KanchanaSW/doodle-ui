/**
 * SSR / hydration safety suite.
 *
 * Uses the Node environment so modules bind `useIsomorphicLayoutEffect` to
 * `useEffect` (matching Next.js server bundles where `window` is undefined).
 *
 * @vitest-environment node
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement, type ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Tab, TabList, TabPanel, Tabs } from "../components/Tabs";
import { SketchSeedProvider } from "../context/SketchSeedContext";
import { SketchBox } from "../primitives/SketchBox";
import { DEFAULT_SEED } from "../utils";

afterEach(() => {
  vi.restoreAllMocks();
});

function captureConsole() {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  return {
    errorSpy,
    warnSpy,
    messages() {
      return [...errorSpy.mock.calls, ...warnSpy.mock.calls]
        .flat()
        .map(String)
        .join("\n");
    },
  };
}

function assertNoHydrationNoise(messages: string) {
  expect(messages).not.toMatch(/useLayoutEffect/i);
  expect(messages).not.toMatch(/Hydration/i);
  expect(messages).not.toMatch(/did not match/i);
  expect(messages).not.toMatch(/Text content does not match/i);
}

describe("SSR renderToString", () => {
  it("renders components without an explicit seed and emits no console noise", () => {
    const { messages } = captureConsole();

    const html = renderToString(
      createElement(
        "div",
        null,
        createElement(Button, null, "Click"),
        createElement(Card, { title: "Notes" }, "Body"),
        createElement(Input, { "aria-label": "Name" }),
        createElement(Alert, { title: "Heads up" }, "Details"),
        createElement(SketchBox, null, "Boxed"),
      ),
    );

    expect(html).toContain("Click");
    expect(html).toContain("Notes");
    expect(html).toContain("Body");
    expect(html).toContain("Boxed");
    assertNoHydrationNoise(messages());
  });

  it("renders under SketchSeedProvider without initialSeed", () => {
    const { messages } = captureConsole();

    const html = renderToString(
      createElement(
        SketchSeedProvider,
        null,
        createElement(Button, null, "Shuffle me"),
        createElement(Card, { title: "Shared seed" }, "Content"),
      ),
    );

    expect(html).toContain("Shuffle me");
    expect(html).toContain("Shared seed");
    assertNoHydrationNoise(messages());
  });

  it("renders under SketchSeedProvider with locked initialSeed", () => {
    const { messages } = captureConsole();

    const html = renderToString(
      createElement(
        SketchSeedProvider,
        { initialSeed: 42 },
        createElement(Button, null, "Locked"),
      ),
    );

    expect(html).toContain("Locked");
    assertNoHydrationNoise(messages());
  });

  it("keeps explicit seed props stable (controlled)", () => {
    const { messages } = captureConsole();

    const html = renderToString(
      createElement(Button, { seed: 42 }, "Pinned"),
    );

    expect(html).toContain("Pinned");
    assertNoHydrationNoise(messages());
  });

  it("renders Tabs without seed and without layout-effect warnings", () => {
    const { messages } = captureConsole();

    const html = renderToString(
      createElement(
        Tabs,
        { defaultValue: "one" },
        createElement(
          TabList,
          null,
          createElement(Tab, { value: "one" }, "One"),
          createElement(Tab, { value: "two" }, "Two"),
        ),
        createElement(TabPanel, { value: "one" }, "Panel one"),
      ),
    );

    expect(html).toContain("One");
    expect(html).toContain("Panel one");
    assertNoHydrationNoise(messages());
  });

  it("is deterministic across two server renders without seed", () => {
    const tree = (): ReactElement =>
      createElement(
        "div",
        null,
        createElement(Button, null, "A"),
        createElement(Input, { "aria-label": "Email", placeholder: "you@x.com" }),
        createElement(Card, { title: "T" }, "C"),
      );

    const a = renderToString(tree());
    const b = renderToString(tree());
    expect(a).toBe(b);
  });

  it("exports DEFAULT_SEED as 0 for the fixed-first-render contract", () => {
    expect(DEFAULT_SEED).toBe(0);
  });
});
