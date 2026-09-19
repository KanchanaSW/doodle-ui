import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  Registry,
  RegistryComponent,
  RegistryFile,
  RegistrySharedItem,
} from "../src/registry/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");
const ROOT_DIR = resolve(__dirname, "../../..");
const PKG_DIR = resolve(__dirname, "..");
const SRC_DIR = join(PKG_DIR, "src");
const COMP_DIR = join(SRC_DIR, "components");
const DOCS_PUBLIC_DIR = resolve(ROOT_DIR, "apps/docs/public");

function toKebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

const SHARED_FILES = [
  "animations/DoodleUIProvider.tsx",
  "animations/index.ts",
  "animations/resolveAnimate.ts",
  "animations/useAnimate.ts",
  "animations/useDrawIn.ts",
  "animations/usePrefersReducedMotion.ts",
  "animations/useTweenNumber.ts",
  "context/SketchSeedContext.tsx",
  "hooks/useElementSize.ts",
  "hooks/useIsomorphicLayoutEffect.ts",
  "hooks/useResolvedSeed.ts",
  "hooks/useSketchSeed.ts",
  "hooks/useSketchTheme.ts",
  "primitives/RoughSvg.tsx",
  "primitives/SketchBox.tsx",
  "primitives/SlidingPanel.tsx",
  "types.ts",
  "utils.ts",
];

function extractDescription(content: string, compName: string, kebab: string): string {
  // 1. Try docs mdx if exists
  const mdxPath = resolve(ROOT_DIR, `apps/docs/app/docs/${kebab}/page.mdx`);
  if (existsSync(mdxPath)) {
    const mdx = readFileSync(mdxPath, "utf8");
    const mdxMatch = mdx.match(/^#\s+[^\n]+\n\n([^\n]+)/m);
    if (mdxMatch && mdxMatch[1].trim()) {
      return mdxMatch[1].trim();
    }
  }

  // 2. Try JSDoc directly preceding export
  const exportDocMatch = content.match(
    /\/\*\*\s*\n([\s\S]*?)\*\/\s*\nexport\s+(?:const|function)\s+\w+/,
  );
  if (exportDocMatch) {
    const lines = exportDocMatch[1]
      .split("\n")
      .map((l) => l.replace(/^\s*\*\s?/, "").trim())
      .filter((l) => l && !l.startsWith("@"));
    if (lines.length > 0) return lines.join(" ");
  }

  return `${compName} component with hand-drawn sketch aesthetic.`;
}

function buildRegistry(): Registry {
  const compFiles = readdirSync(COMP_DIR)
    .filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"))
    .sort();

  const components: Record<string, RegistryComponent> = {};

  for (const file of compFiles) {
    const compName = basename(file, extname(file));
    const kebab = toKebab(compName);
    const fullPath = join(COMP_DIR, file);
    const content = readFileSync(fullPath, "utf8");

    const description = extractDescription(content, compName, kebab);

    const importMatches = [
      ...content.matchAll(/from\s+["']([^"']+)["']/g),
    ].map((m) => m[1]);

    const npmDeps = new Set<string>();
    const internalDeps = new Set<string>();
    const componentDeps = new Set<string>();

    for (const imp of importMatches) {
      if (imp === "react" || imp.startsWith("react/")) continue;
      if (
        imp.startsWith("@radix-ui/") ||
        imp === "framer-motion" ||
        imp === "roughjs" ||
        imp === "cmdk" ||
        imp === "embla-carousel-react" ||
        imp === "input-otp" ||
        imp === "react-resizable-panels"
      ) {
        npmDeps.add(imp);
      } else if (imp.startsWith("./")) {
        const depName = imp.slice(2);
        componentDeps.add(toKebab(depName));
      } else if (imp.startsWith("../")) {
        internalDeps.add(imp.replace(/^\.\.\//, ""));
      }
    }

    const regFile: RegistryFile = {
      name: `${kebab}.tsx`,
      path: `components/${kebab}.tsx`,
      type: "component",
      content,
    };

    components[kebab] = {
      name: kebab,
      displayName: compName,
      description,
      files: [regFile],
      dependencies: Array.from(npmDeps).sort(),
      internalDependencies: Array.from(internalDeps).sort(),
      componentDependencies: Array.from(componentDeps).sort(),
    };
  }

  const sharedItems: RegistrySharedItem[] = SHARED_FILES.map((relPath) => {
    const fullPath = join(SRC_DIR, relPath);
    const content = readFileSync(fullPath, "utf8");
    const npmDeps = new Set<string>();
    const importMatches = [
      ...content.matchAll(/from\s+["']([^"']+)["']/g),
    ].map((m) => m[1]);

    for (const imp of importMatches) {
      if (imp.startsWith("roughjs")) npmDeps.add("roughjs");
      if (imp === "framer-motion") npmDeps.add("framer-motion");
      if (imp.startsWith("@radix-ui/")) npmDeps.add(imp);
    }

    return {
      name: relPath,
      path: relPath,
      dependencies: Array.from(npmDeps).sort(),
      content,
    };
  });

  return {
    name: "doodleui",
    version: "0.7.2",
    homepage: "https://doodle-ui.netlify.app",
    repository: "https://github.com/KanchanaSW/doodle-ui",
    sharedDependencies: ["roughjs", "framer-motion"],
    sharedFiles: sharedItems,
    components,
  };
}

function main() {
  console.log("Generating doodleui component registry...");
  const registry = buildRegistry();

  // 1. Output embedded TypeScript module in packages/doodle-ui/src/registry/data.ts
  const tsContent = `// Auto-generated by scripts/build-registry.ts - DO NOT EDIT MANUALLY\nimport type { Registry } from "./types";\n\nexport const REGISTRY_DATA: Registry = ${JSON.stringify(
    registry,
    null,
    2,
  )};\n`;
  writeFileSync(join(SRC_DIR, "registry/data.ts"), tsContent, "utf8");
  console.log("✓ Generated packages/doodle-ui/src/registry/data.ts");

  // 2. Output registry.json at repo root
  const rootRegistryJsonPath = join(ROOT_DIR, "registry.json");
  writeFileSync(
    rootRegistryJsonPath,
    JSON.stringify(registry, null, 2),
    "utf8",
  );
  console.log("✓ Generated /registry.json");

  // 3. Output individual component JSONs in repo root registry/
  const rootRegistryDir = join(ROOT_DIR, "registry");
  if (!existsSync(rootRegistryDir)) mkdirSync(rootRegistryDir, { recursive: true });

  for (const [name, comp] of Object.entries(registry.components)) {
    writeFileSync(
      join(rootRegistryDir, `${name}.json`),
      JSON.stringify(comp, null, 2),
      "utf8",
    );
  }
  console.log(`✓ Generated ${Object.keys(registry.components).length} component JSONs in /registry/`);

  // 4. Output to apps/docs/public for web hosting
  if (existsSync(DOCS_PUBLIC_DIR)) {
    writeFileSync(
      join(DOCS_PUBLIC_DIR, "registry.json"),
      JSON.stringify(registry, null, 2),
      "utf8",
    );

    const docsRegistryDir = join(DOCS_PUBLIC_DIR, "registry");
    if (!existsSync(docsRegistryDir))
      mkdirSync(docsRegistryDir, { recursive: true });

    for (const [name, comp] of Object.entries(registry.components)) {
      writeFileSync(
        join(docsRegistryDir, `${name}.json`),
        JSON.stringify(comp, null, 2),
        "utf8",
      );
    }
    console.log("✓ Generated apps/docs/public/registry.json & component JSONs");
  }

  console.log("Registry build complete!");
}

main();
