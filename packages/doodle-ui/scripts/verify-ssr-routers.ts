/**
 * Lightweight Next.js App Router + Pages Router SSR smoke script.
 * Run: `npx tsx scripts/verify-ssr-routers.ts` from packages/doodle-ui
 * (after `pnpm build` so dist imports work, or via tsx against src).
 */
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { Button } from "../src/components/Button";
import { Card } from "../src/components/Card";
import { Input } from "../src/components/Input";
import { SketchSeedProvider } from "../src/context/SketchSeedContext";
import { DoodleUIProvider } from "../src/animations";

function assertNoLayoutEffectNoise(label: string, messages: string[]) {
  const joined = messages.join("\n");
  if (/useLayoutEffect/i.test(joined)) {
    throw new Error(`[${label}] unexpected useLayoutEffect warning:\n${joined}`);
  }
  if (/Hydration/i.test(joined) || /did not match/i.test(joined)) {
    throw new Error(`[${label}] unexpected hydration warning:\n${joined}`);
  }
}

function withCapturedConsole<T>(fn: () => T): { result: T; messages: string[] } {
  const messages: string[] = [];
  const originalError = console.error;
  const originalWarn = console.warn;
  console.error = (...args: unknown[]) => {
    messages.push(args.map(String).join(" "));
  };
  console.warn = (...args: unknown[]) => {
    messages.push(args.map(String).join(" "));
  };
  try {
    const result = fn();
    return { result, messages };
  } finally {
    console.error = originalError;
    console.warn = originalWarn;
  }
}

/** Simulates an App Router Server Component tree importing client components. */
function appRouterServerPass() {
  return renderToString(
    createElement(
      DoodleUIProvider,
      { theme: "light" },
      createElement(
        SketchSeedProvider,
        null,
        createElement(Button, null, "App Router"),
        createElement(Card, { title: "SSR" }, "App"),
        createElement(Input, { "aria-label": "App field" }),
      ),
    ),
  );
}

/** Simulates Pages Router getServerSideProps → render page. */
function pagesRouterSsrPass() {
  return renderToString(
    createElement(
      DoodleUIProvider,
      { theme: "system" },
      createElement(
        SketchSeedProvider,
        { initialSeed: 99 },
        createElement(Button, null, "Pages Router"),
        createElement(Card, { title: "SSR" }, "Pages"),
      ),
    ),
  );
}

/** Simulates a Client Component tree with no seed (uncontrolled). */
function clientComponentPass() {
  return renderToString(
    createElement(
      "div",
      null,
      createElement(Button, null, "Client"),
      createElement(Button, { seed: 42 }, "Locked"),
    ),
  );
}

const app = withCapturedConsole(appRouterServerPass);
assertNoLayoutEffectNoise("App Router", app.messages);
if (!app.result.includes("App Router")) {
  throw new Error("App Router markup missing expected text");
}

const pages = withCapturedConsole(pagesRouterSsrPass);
assertNoLayoutEffectNoise("Pages Router", pages.messages);
if (!pages.result.includes("Pages Router")) {
  throw new Error("Pages Router markup missing expected text");
}

const client = withCapturedConsole(clientComponentPass);
assertNoLayoutEffectNoise("Client Components", client.messages);
if (!client.result.includes("Client") || !client.result.includes("Locked")) {
  throw new Error("Client Component markup missing expected text");
}

console.log("verify-ssr-routers: ok (App Router + Pages Router + Client)");
