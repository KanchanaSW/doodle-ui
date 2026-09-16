import type { DoodleUIConfig } from "./config";

function toKebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Transforms source code of a component to point to the consumer project paths
 * and aliases configured in doodleui.config.json.
 */
export function transformComponentSource(
  source: string,
  config: DoodleUIConfig,
): string {
  let transformed = source;

  // 1. Resolve shared directory import
  // If config has aliases.shared (e.g. "@/components/doodleui/shared"), use that.
  // Otherwise default to relative "./shared"
  const sharedImport = config.aliases?.shared || "./shared";

  transformed = transformed.replace(
    /from\s+["']\.\.\/([^"']+)["']/g,
    `from "${sharedImport}/$1"`,
  );

  // 2. Resolve sibling component imports
  // e.g. from "./Button" -> from "./button" (or "@/components/doodleui/button")
  transformed = transformed.replace(
    /from\s+["']\.\/([A-Z][a-zA-Z0-9]+)["']/g,
    (_, compName) => {
      const kebab = toKebab(compName);
      if (config.aliases?.components) {
        return `from "${config.aliases.components}/${kebab}"`;
      }
      return `from "./${kebab}"`;
    },
  );

  return transformed;
}

/**
 * Transforms source code of a shared internal file.
 * The relative imports inside shared/ (e.g. ../types, ../hooks, ./RoughSvg)
 * preserve the exact relative tree structure.
 */
export function transformSharedSource(
  source: string,
  _config: DoodleUIConfig,
): string {
  return source;
}
