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

function errorResult(message: string) {
  return {
    content: [{ type: "text" as const, text: message }],
    isError: true as const,
  };
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

/** List registry components, optionally filtered by category. */
export function listComponents(category?: ComponentCategory) {
  const all = Object.values(REGISTRY_DATA.components);
  const filtered = category
    ? all.filter((c) => c.category === category)
    : all;

  return textResult({
    version: REGISTRY_DATA.version,
    count: filtered.length,
    components: filtered
      .map(summarizeComponent)
      .sort((a, b) => a.name.localeCompare(b.name)),
  });
}

/** Full docs for one component (props, example, deps, subparts). */
export function getComponentDocs(name: string) {
  const comp = findComponentInRegistry(REGISTRY_DATA, name);
  if (!comp) {
    const available = Object.keys(REGISTRY_DATA.components).sort().join(", ");
    return errorResult(
      `Unknown component "${name}". Available: ${available}`,
    );
  }

  return textResult({
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
  if (!components.length) {
    return errorResult("Provide at least one component name.");
  }

  const resolved = resolveComponentDependencies(REGISTRY_DATA, components);
  if (resolved.missingNames.length > 0) {
    return errorResult(
      `Unknown component(s): ${resolved.missingNames.join(", ")}. ` +
        `Available: ${Object.keys(REGISTRY_DATA.components).sort().join(", ")}`,
    );
  }

  const command = buildAddCommand(
    components.map((c) => {
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
  if (token) {
    const normalized = token.startsWith("--") ? token : `--doodle-ui-${token}`;
    const match = data.variables.find(
      (v) =>
        v.name === normalized ||
        v.name === token ||
        v.name.endsWith(token.replace(/^--doodle-ui-/, "")),
    );
    if (!match) {
      return errorResult(
        `Unknown token "${token}". Available: ${data.variables.map((v) => v.name).join(", ")}`,
      );
    }
    return textResult({
      variable: match,
      precedence: data.precedence,
      exampleOverride: data.exampleOverride,
    });
  }

  return textResult(data);
}

/** Ranked component search from a natural-language query. */
export function searchComponents(query: string, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return errorResult("Provide a non-empty search query.");
  }

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

  return textResult({
    query,
    count: ranked.length,
    results: ranked,
  });
}

/** Cross-cutting library conventions. */
export function getConventions(topic: ConventionTopic = "all") {
  const data = loadConventions();
  if (topic === "all") {
    return textResult(data);
  }

  const entry = data.topics[topic];
  if (!entry) {
    return errorResult(
      `Unknown topic "${topic}". Available: ${Object.keys(data.topics).join(", ")}, all`,
    );
  }

  return textResult({
    summary: data.summary,
    topic: entry,
  });
}

export {
  REGISTRY_DATA,
  loadTheming,
  loadConventions,
};
