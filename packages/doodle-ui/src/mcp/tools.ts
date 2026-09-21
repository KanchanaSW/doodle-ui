import {
  findComponentInRegistry,
  resolveComponentDependencies,
} from "../cli/registry";
import conventionsJson from "../data/conventions.json";
import themingJson from "../data/theming.json";
import { REGISTRY_DATA } from "../registry/data";
import type {
  ComponentCategory,
  RegistryComponent,
} from "../registry/types";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export type ConventionTopic =
  | "animation"
  | "forms"
  | "controlled-uncontrolled"
  | "asChild"
  | "compound"
  | "ssr"
  | "theming"
  | "all";

/** Semver for MCP tool response shapes (independent of package version). */
export const REGISTRY_SCHEMA_VERSION = "1.0.0";

export interface McpErrorPayload {
  code: string;
  message: string;
}

export interface McpErrorResult {
  ok: false;
  error: McpErrorPayload;
  suggestions?: string[];
  invalidComponents?: string[];
}

interface ThemingData {
  summary: string;
  precedence: string[];
  variables: Array<{
    name: string;
    lightDefault: string;
    darkDefault: string;
    purpose: string;
  }>;
  darkMode: Record<string, string>;
  contrastNotes: string[];
  exampleOverride: string;
}

interface ConventionsData {
  summary: string;
  topics: Record<
    string,
    {
      title: string;
      summary: string;
      rules?: string[];
      patterns?: Array<{ kind: string; controlled: string; uncontrolled: string }>;
      components?: string[];
      example?: string;
    }
  >;
}

function loadTheming(): ThemingData {
  return themingJson as ThemingData;
}

function loadConventions(): ConventionsData {
  return conventionsJson as ConventionsData;
}

function textResult(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: typeof data === "string" ? data : JSON.stringify(data, null, 2),
      },
    ],
  };
}

/** Application-level error — JSON content, no MCP protocol isError flag. */
export function structuredErrorResult(
  code: string,
  message: string,
  extra?: { suggestions?: string[]; invalidComponents?: string[] },
) {
  const payload: McpErrorResult = {
    ok: false,
    error: { code, message },
    ...extra,
  };
  return textResult(payload);
}

/** Wagner–Fischer edit distance between two strings. */
export function levenshteinDistance(a: string, b: string): number {
  const s = a.toLowerCase();
  const t = b.toLowerCase();
  if (s === t) return 0;
  if (s.length === 0) return t.length;
  if (t.length === 0) return s.length;

  const prev: number[] = Array.from({ length: t.length + 1 }, (_, j) => j);
  const curr: number[] = Array.from({ length: t.length + 1 }, () => 0);

  for (let i = 1; i <= s.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= t.length; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        (prev[j] ?? 0) + 1,
        (curr[j - 1] ?? 0) + 1,
        (prev[j - 1] ?? 0) + cost,
      );
    }
    for (let j = 0; j <= t.length; j++) prev[j] = curr[j] ?? 0;
  }
  return prev[t.length] ?? 0;
}

/**
 * Rank candidate names by edit distance to `target`.
 * Also treats hyphen-stripped equality as distance 0 (e.g. alertdialog → alert-dialog).
 */
export function findSuggestions(
  target: string,
  candidates: string[],
  maxDistance = 3,
  limit = 5,
): string[] {
  const needle = target.trim().toLowerCase();
  if (!needle) return [];

  const scored = candidates
    .map((name) => {
      const lower = name.toLowerCase();
      const stripped = lower.replace(/-/g, "");
      const needleStripped = needle.replace(/-/g, "");
      let distance = levenshteinDistance(needle, lower);
      if (needleStripped === stripped) distance = Math.min(distance, 0);
      else if (stripped.includes(needleStripped) || needleStripped.includes(stripped)) {
        distance = Math.min(distance, 1);
      }
      return { name, distance };
    })
    .filter((s) => s.distance <= maxDistance)
    .sort(
      (a, b) =>
        a.distance - b.distance || a.name.localeCompare(b.name),
    );

  return scored.slice(0, limit).map((s) => s.name);
}

function summarizeComponent(comp: RegistryComponent) {
  return {
    name: comp.name,
    displayName: comp.displayName,
    description: comp.description,
    category: comp.category,
    isRadix: comp.isRadix,
    radixPrimitive: comp.radixPrimitive,
    dependencies: comp.dependencies,
    componentDependencies: comp.componentDependencies,
    subparts: comp.subparts,
    keywords: comp.keywords,
  };
}

function componentNames(): string[] {
  return Object.keys(REGISTRY_DATA.components).sort();
}

/** List registry components, optionally filtered by category. */
export function listComponents(category?: ComponentCategory) {
  const all = Object.values(REGISTRY_DATA.components);
  const filtered = category
    ? all.filter((c) => c.category === category)
    : all;

  return textResult({
    ok: true,
    version: REGISTRY_DATA.version,
    registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
    count: filtered.length,
    components: filtered
      .map(summarizeComponent)
      .sort((a, b) => a.name.localeCompare(b.name)),
  });
}

/** Full docs for one component (props, example, deps, subparts). */
export function getComponentDocs(name: string) {
  const trimmed = typeof name === "string" ? name.trim() : "";
  if (!trimmed) {
    return structuredErrorResult(
      "INVALID_INPUT",
      "Provide a non-empty component name (e.g. \"button\", \"alert-dialog\").",
    );
  }

  const comp = findComponentInRegistry(REGISTRY_DATA, trimmed);
  if (!comp) {
    const suggestions = findSuggestions(trimmed, componentNames());
    return structuredErrorResult(
      "UNKNOWN_COMPONENT",
      `Unknown component "${trimmed}".`,
      { suggestions },
    );
  }

  return textResult({
    ok: true,
    version: REGISTRY_DATA.version,
    registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
    name: comp.name,
    displayName: comp.displayName,
    description: comp.description,
    category: comp.category,
    isRadix: comp.isRadix,
    radixPrimitive: comp.radixPrimitive,
    subparts: comp.subparts,
    props: comp.props,
    example: comp.example,
    dependencies: {
      npm: comp.dependencies,
      internal: comp.internalDependencies,
      components: comp.componentDependencies,
    },
    keywords: comp.keywords,
    docsUrl: `${REGISTRY_DATA.homepage}/docs/${comp.name}`,
  });
}

/** Build the exact CLI add command for the given package manager. */
export function buildAddCommand(
  components: string[],
  packageManager: PackageManager = "npm",
): string {
  const names = components.map((c) => c.trim().toLowerCase()).filter(Boolean);
  const args = names.join(" ");
  switch (packageManager) {
    case "pnpm":
      return `pnpm dlx doodleui-react add ${args}`.trim();
    case "yarn":
      return `yarn dlx doodleui-react add ${args}`.trim();
    case "bun":
      return `bunx doodleui-react add ${args}`.trim();
    case "npm":
    default:
      return `npx doodleui-react add ${args}`.trim();
  }
}

/** Installation command + resolved deps for one or more components. */
export function getInstallationCommand(
  components: string[],
  packageManager: PackageManager = "npm",
) {
  if (!Array.isArray(components) || components.length === 0) {
    return structuredErrorResult(
      "INVALID_INPUT",
      "Provide at least one component name (e.g. [\"button\", \"input\"]).",
    );
  }

  const trimmed = components
    .map((c) => (typeof c === "string" ? c.trim() : ""))
    .filter(Boolean);
  if (trimmed.length === 0) {
    return structuredErrorResult(
      "INVALID_INPUT",
      "Provide at least one non-empty component name (e.g. [\"button\", \"input\"]).",
    );
  }

  const resolved = resolveComponentDependencies(REGISTRY_DATA, trimmed);
  if (resolved.missingNames.length > 0) {
    const names = componentNames();
    const suggestionSet = new Set<string>();
    for (const missing of resolved.missingNames) {
      for (const s of findSuggestions(missing, names)) {
        suggestionSet.add(s);
      }
    }
    return structuredErrorResult(
      "UNKNOWN_COMPONENT",
      `Unknown component(s): ${resolved.missingNames.join(", ")}.`,
      {
        invalidComponents: resolved.missingNames,
        suggestions: Array.from(suggestionSet).sort(),
      },
    );
  }

  const command = buildAddCommand(
    trimmed.map((c) => {
      const found = findComponentInRegistry(REGISTRY_DATA, c);
      return found?.name ?? c.trim().toLowerCase();
    }),
    packageManager,
  );

  const sharedFiles = new Set<string>();
  for (const comp of resolved.components) {
    for (const dep of comp.internalDependencies) {
      sharedFiles.add(dep);
    }
  }

  return textResult({
    ok: true,
    version: REGISTRY_DATA.version,
    registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
    command,
    packageManager,
    components: resolved.components.map((c) => ({
      name: c.name,
      displayName: c.displayName,
    })),
    npmDependencies: resolved.npmDependencies,
    sharedFiles: Array.from(sharedFiles).sort(),
    note: "Run `npx doodleui-react init` first if doodleui.config.json is missing. The add command copies component source into your project and installs npm deps.",
  });
}

/** CSS custom property / theming reference. */
export function getThemingReference(token?: string) {
  const data = loadTheming();
  if (token !== undefined && token !== null) {
    const trimmed = typeof token === "string" ? token.trim() : "";
    if (!trimmed) {
      return structuredErrorResult(
        "INVALID_INPUT",
        "Provide a non-empty token name (e.g. \"roughness\" or \"--doodle-ui-roughness\"), or omit the token for the full reference.",
      );
    }
    const normalized = trimmed.startsWith("--")
      ? trimmed
      : `--doodle-ui-${trimmed}`;
    const match = data.variables.find(
      (v) =>
        v.name === normalized ||
        v.name === trimmed ||
        v.name.endsWith(trimmed.replace(/^--doodle-ui-/, "")),
    );
    if (!match) {
      const suggestions = findSuggestions(
        trimmed.replace(/^--doodle-ui-/, ""),
        data.variables.map((v) => v.name.replace(/^--doodle-ui-/, "")),
      ).map((s) => `--doodle-ui-${s}`);
      return structuredErrorResult(
        "UNKNOWN_TOKEN",
        `Unknown token "${trimmed}".`,
        { suggestions },
      );
    }
    return textResult({
      ok: true,
      version: REGISTRY_DATA.version,
      registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
      variable: match,
      precedence: data.precedence,
      exampleOverride: data.exampleOverride,
    });
  }

  return textResult({
    ok: true,
    version: REGISTRY_DATA.version,
    registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
    ...data,
  });
}

/** Ranked component search from a natural-language query. */
export function searchComponents(query: string, limit = 8) {
  if (typeof query !== "string" || !query.trim()) {
    return structuredErrorResult(
      "INVALID_INPUT",
      "Provide a non-empty search query (e.g. \"confirmation before a destructive action\").",
    );
  }

  const q = query.trim().toLowerCase();
  const terms = q.split(/[\s,./|_-]+/).filter((t) => t.length > 1);

  const scored = Object.values(REGISTRY_DATA.components).map((comp) => {
    let score = 0;
    const haystack = [
      comp.name,
      comp.displayName,
      comp.description,
      comp.category,
      ...comp.keywords,
      ...comp.subparts,
    ]
      .join(" ")
      .toLowerCase();

    if (comp.name === q || comp.displayName.toLowerCase() === q) {
      score += 100;
    }
    if (comp.name.includes(q) || comp.displayName.toLowerCase().includes(q)) {
      score += 40;
    }
    for (const term of terms) {
      if (comp.name === term || comp.name.includes(term)) score += 25;
      if (comp.keywords.some((k) => k === term || k.includes(term))) score += 20;
      if (comp.category.includes(term)) score += 15;
      if (haystack.includes(term)) score += 5;
    }
    // Phrase bonus
    if (haystack.includes(q)) score += 30;

    return { comp, score };
  });

  const ranked = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.comp.name.localeCompare(b.comp.name))
    .slice(0, Math.max(1, Math.min(limit, 25)))
    .map(({ comp, score }) => ({
      score,
      ...summarizeComponent(comp),
    }));

  if (ranked.length === 0) {
    return textResult({
      ok: true,
      version: REGISTRY_DATA.version,
      registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
      query,
      count: 0,
      results: [],
      message: "No components matched the query.",
    });
  }

  return textResult({
    ok: true,
    version: REGISTRY_DATA.version,
    registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
    query,
    count: ranked.length,
    results: ranked,
  });
}

/** Cross-cutting library conventions. */
export function getConventions(topic: ConventionTopic = "all") {
  const data = loadConventions();
  if (topic === "all") {
    return textResult({
      ok: true,
      version: REGISTRY_DATA.version,
      registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
      ...data,
    });
  }

  const entry = data.topics[topic];
  if (!entry) {
    const available = [...Object.keys(data.topics), "all"];
    return structuredErrorResult(
      "UNKNOWN_TOPIC",
      `Unknown topic "${topic}".`,
      { suggestions: findSuggestions(String(topic), available) },
    );
  }

  return textResult({
    ok: true,
    version: REGISTRY_DATA.version,
    registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
    summary: data.summary,
    topic: entry,
  });
}

export {
  REGISTRY_DATA,
  loadTheming,
  loadConventions,
};
