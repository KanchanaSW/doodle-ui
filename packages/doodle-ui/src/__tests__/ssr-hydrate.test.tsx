/**
 * Client hydration checks (jsdom). Complements the Node `ssr.test.tsx` suite.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement, act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { SketchSeedProvider } from "../context/SketchSeedContext";
import { createMatchMedia } from "../test/match-media";

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

function captureConsole() {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  return {
    messages() {
      return [...errorSpy.mock.calls, ...warnSpy.mock.calls]
        .flat()
        .map(String)
        .join("\n");
    },
  };
}

function assertNoHydrationMismatch(messages: string) {
  expect(messages).not.toMatch(/Hydration/i);
  expect(messages).not.toMatch(/did not match/i);
  expect(messages).not.toMatch(/Text content does not match/i);
  expect(messages).not.toMatch(/Minified React error #(418|423|425)/);
}

describe("client hydrateRoot", () => {
  it("hydrates SSR markup without seed without mismatch warnings", async () => {
    const tree = createElement(
      SketchSeedProvider,
      { initialSeed: 7 },
      createElement(Button, null, "Hydrate"),
      createElement(Card, { title: "Card" }, "Body"),
      createElement(Input, { "aria-label": "Field" }),
    );

    const html = renderToString(tree);
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const { messages } = captureConsole();

    await act(async () => {
      hydrateRoot(container, tree);
    });

    assertNoHydrationMismatch(messages());
    expect(container.textContent).toContain("Hydrate");
  });

  it("hydrates cleanly when prefers-color-scheme is dark", async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn((query: string) => {
        const mql = createMatchMedia(query);
        if (query.includes("prefers-color-scheme") && query.includes("dark")) {
          return { ...mql, matches: true };
        }
        return mql;
      }),
    });

    const tree = createElement(
      "div",
      null,
      createElement(Button, { seed: 42 }, "Dark client"),
      createElement(Card, { seed: 42, title: "Theme" }, "Safe"),
    );

    const html = renderToString(tree);
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const { messages } = captureConsole();

    await act(async () => {
      hydrateRoot(container, tree);
    });

    assertNoHydrationMismatch(messages());
    expect(container.textContent).toContain("Dark client");
  });
});
