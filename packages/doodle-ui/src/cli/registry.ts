import { REGISTRY_DATA } from "../registry/data";
import type { Registry, RegistryComponent } from "../registry/types";

export const DEFAULT_REGISTRY_URL =
  process.env.DOODLEUI_REGISTRY_URL ||
  "https://raw.githubusercontent.com/KanchanaSW/doodle-ui/master/registry.json";

function normalizeName(name: string): string {
  return name
    .trim()
    .replace(/\.tsx?$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

export async function fetchRegistry(registryUrl?: string): Promise<Registry> {
  const targetUrl = registryUrl || DEFAULT_REGISTRY_URL;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = (await res.json()) as Registry;
      if (data && data.components && typeof data.components === "object") {
        return data;
      }
    }
  } catch {
    // Network or parse failure: fallback to bundled registry
  }

  return REGISTRY_DATA;
}

export function findComponentInRegistry(
  registry: Registry,
  name: string,
): RegistryComponent | null {
  const normalized = normalizeName(name);

  if (registry.components[normalized]) {
    return registry.components[normalized];
  }

  // Check by displayName
  for (const comp of Object.values(registry.components)) {
    if (
      comp.name.toLowerCase() === normalized ||
      comp.displayName.toLowerCase() === normalized.replace(/-/g, "")
    ) {
      return comp;
    }
  }

  return null;
}

export function resolveComponentDependencies(
  registry: Registry,
  inputNames: string[],
): {
  components: RegistryComponent[];
  npmDependencies: string[];
  missingNames: string[];
} {
  const resolvedMap = new Map<string, RegistryComponent>();
  const missingNames: string[] = [];
  const npmDepsSet = new Set<string>();

  const queue = [...inputNames];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const currentName = queue.shift()!;
    const normalized = normalizeName(currentName);
    if (visited.has(normalized)) continue;
    visited.add(normalized);

    const comp = findComponentInRegistry(registry, currentName);
    if (!comp) {
      if (!missingNames.includes(currentName)) {
        missingNames.push(currentName);
      }
      continue;
    }

    resolvedMap.set(comp.name, comp);

    for (const dep of comp.dependencies) {
      npmDepsSet.add(dep);
    }

    for (const compDep of comp.componentDependencies) {
      if (!visited.has(normalizeName(compDep))) {
        queue.push(compDep);
      }
    }
  }

  return {
    components: Array.from(resolvedMap.values()),
    npmDependencies: Array.from(npmDepsSet).sort(),
    missingNames,
  };
}
