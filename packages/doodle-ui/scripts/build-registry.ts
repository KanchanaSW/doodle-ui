import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { getComponentMeta } from "../src/data/component-meta";
import type {
  PropDoc,
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
const PKG_JSON = JSON.parse(
  readFileSync(join(PKG_DIR, "package.json"), "utf8"),
) as { version: string };

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

/** Shared SketchProps docs inlined into every component's prop table. */
const SKETCH_PROPS: PropDoc[] = [
  {
    name: "roughness",
    type: "number",
    required: false,
    defaultValue: "1.5",
    description: "Sketchiness intensity passed to rough.js. Higher values look messier.",
  },
  {
    name: "seed",
    type: "number",
    required: false,
    description:
      "Locks the hand-drawn wobble. Omit to follow SketchSeedProvider or fixed-then-randomize.",
  },
  {
    name: "sketchColor",
    type: "string",
    required: false,
    description: "Stroke (outline) color override. Falls back to theme ink.",
  },
  {
    name: "bowing",
    type: "number",
    required: false,
    defaultValue: "1",
    description: "How much straight lines bow/curve in rough.js.",
  },
  {
    name: "fillStyle",
    type: 'FillStyle',
    required: false,
    defaultValue: '"hachure"',
    description: "Fill pattern when the shape has a fill color.",
  },
  {
    name: "strokeWidth",
    type: "number",
    required: false,
    defaultValue: "1.75",
    description: "Width of sketch strokes in pixels.",
  },
  {
    name: "hachureGap",
    type: "number",
    required: false,
    description: "Spacing between hatch lines for patterned fills.",
  },
  {
    name: "hachureAngle",
    type: "number",
    required: false,
    description: "Angle in degrees of hatch lines for patterned fills.",
  },
  {
    name: "fillWeight",
    type: "number",
    required: false,
    description: "Weight/thickness of individual hatch lines inside patterned fills.",
  },
  {
    name: "animate",
    type: "boolean",
    required: false,
    description:
      "Play sketch draw-in animations. Defaults to DoodleUIProvider animate (true).",
  },
];

function extractDescription(content: string, compName: string, kebab: string): string {
  const mdxPath = resolve(ROOT_DIR, `apps/docs/app/docs/${kebab}/page.mdx`);
  if (existsSync(mdxPath)) {
    const mdx = readFileSync(mdxPath, "utf8");
    const mdxMatch = mdx.match(/^#\s+[^\n]+\n\n([^\n]+)/m);
    if (mdxMatch?.[1]?.trim()) {
      return mdxMatch[1].trim();
    }
  }

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

function getJsDoc(node: ts.Node): ts.JSDoc | undefined {
  const docs = (node as ts.Node & { jsDoc?: ts.JSDoc[] }).jsDoc;
  return docs?.[0];
}

function jsDocText(doc: ts.JSDoc | undefined): string {
  if (!doc?.comment) return "";
  if (typeof doc.comment === "string") return doc.comment.trim();
  return doc.comment
    .map((p) => ("text" in p ? String(p.text) : ""))
    .join("")
    .trim();
}

function jsDocTag(doc: ts.JSDoc | undefined, tagName: string): string | undefined {
  if (!doc?.tags) return undefined;
  for (const tag of doc.tags) {
    if (tag.tagName.text === tagName) {
      if (!tag.comment) return "";
      if (typeof tag.comment === "string") return tag.comment.trim();
      return tag.comment
        .map((p) => ("text" in p ? String(p.text) : ""))
        .join("")
        .trim();
    }
  }
  return undefined;
}

function typeNodeToString(typeNode: ts.TypeNode | undefined, source: string): string {
  if (!typeNode) return "unknown";
  return source.slice(typeNode.pos, typeNode.end).trim().replace(/\s+/g, " ");
}

function extractPropsFromInterface(
  iface: ts.InterfaceDeclaration,
  sourceText: string,
): PropDoc[] {
  const props: PropDoc[] = [];
  for (const member of iface.members) {
    if (!ts.isPropertySignature(member) || !member.name) continue;
    const name = member.name.getText();
    if (name === "children" || name === "style" || name === "className") continue;
    const doc = getJsDoc(member);
    props.push({
      name,
      type: typeNodeToString(member.type, sourceText),
      required: !member.questionToken,
      defaultValue: jsDocTag(doc, "default") || undefined,
      description: jsDocText(doc) || "",
    });
  }
  return props;
}

function extractExampleFromSource(sourceFile: ts.SourceFile, sourceText: string): string {
  let example = "";
  function visit(node: ts.Node) {
    if (
      (ts.isFunctionDeclaration(node) ||
        ts.isVariableStatement(node) ||
        ts.isInterfaceDeclaration(node)) &&
      !example
    ) {
      const doc = getJsDoc(node);
      const ex = jsDocTag(doc, "example");
      if (ex) example = ex;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);

  if (example) return example;

  // Fallback: scrape first fenced tsx block from docs MDX
  return "";
}

function extractExampleFromMdx(kebab: string): string {
  const mdxPath = resolve(ROOT_DIR, `apps/docs/app/docs/${kebab}/page.mdx`);
  if (!existsSync(mdxPath)) return "";
  const mdx = readFileSync(mdxPath, "utf8");
  const match = mdx.match(/```tsx\n([\s\S]*?)```/);
  return match?.[1]?.trim() ?? "";
}

function extractSubparts(sourceFile: ts.SourceFile, displayName: string): string[] {
  const subparts = new Set<string>();

  function visit(node: ts.Node) {
    // Object.assign(Root, { Header: ..., Title: ... })
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "assign" &&
      node.arguments.length >= 2 &&
      ts.isObjectLiteralExpression(node.arguments[1])
    ) {
      for (const prop of node.arguments[1].properties) {
        if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
          subparts.add(prop.name.text);
        } else if (ts.isShorthandPropertyAssignment(prop)) {
          subparts.add(prop.name.text);
        }
      }
    }

    // export const DialogHeader / export function DialogFooter
    if (
      (ts.isVariableStatement(node) || ts.isFunctionDeclaration(node)) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      let name: string | undefined;
      if (ts.isFunctionDeclaration(node) && node.name) {
        name = node.name.text;
      } else if (ts.isVariableStatement(node)) {
        const decl = node.declarationList.declarations[0];
        if (decl && ts.isIdentifier(decl.name)) name = decl.name.text;
      }
      if (name && name.startsWith(displayName) && name !== displayName) {
        const suffix = name.slice(displayName.length);
        if (suffix) subparts.add(suffix);
      }
    }

    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return Array.from(subparts).sort();
}

function extractProps(sourceFile: ts.SourceFile, sourceText: string, displayName: string): PropDoc[] {
  const propsMap = new Map<string, PropDoc>();

  // Prefer `{DisplayName}Props` interface
  function visit(node: ts.Node) {
    if (ts.isInterfaceDeclaration(node) && node.name.text.endsWith("Props")) {
      const isPrimary =
        node.name.text === `${displayName}Props` ||
        node.name.text === `${displayName}RootProps`;
      if (isPrimary || propsMap.size === 0) {
        for (const p of extractPropsFromInterface(node, sourceText)) {
          if (isPrimary || !propsMap.has(p.name)) {
            propsMap.set(p.name, p);
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);

  // Merge SketchProps if the primary interface extends it
  const hasSketch =
    /extends[\s\S]*SketchProps/.test(sourceText) ||
    (/SketchProps/.test(sourceText) && !propsMap.has("roughness"));

  if (hasSketch) {
    for (const sp of SKETCH_PROPS) {
      if (!propsMap.has(sp.name)) {
        propsMap.set(sp.name, sp);
      }
    }
  }

  return Array.from(propsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
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

    const sourceFile = ts.createSourceFile(
      file,
      content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );

    const description = extractDescription(content, compName, kebab);
    const meta = getComponentMeta(kebab);
    const props = extractProps(sourceFile, content, compName);
    const subparts = extractSubparts(sourceFile, compName);
    let example = extractExampleFromSource(sourceFile, content);
    if (!example) example = extractExampleFromMdx(kebab);

    const importMatches = [...content.matchAll(/from\s+["']([^"']+)["']/g)].map(
      (m) => m[1],
    );

    const npmDeps = new Set<string>();
    const internalDeps = new Set<string>();
    const componentDeps = new Set<string>();
    let radixPrimitive: string | null = null;

    for (const imp of importMatches) {
      if (imp === "react" || imp.startsWith("react/")) continue;
      if (imp.startsWith("@radix-ui/")) {
        npmDeps.add(imp);
        if (!radixPrimitive) radixPrimitive = imp;
      } else if (
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
      category: meta.category,
      isRadix: Boolean(radixPrimitive),
      radixPrimitive,
      subparts,
      props,
      example,
      keywords: meta.keywords,
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
    const importMatches = [...content.matchAll(/from\s+["']([^"']+)["']/g)].map(
      (m) => m[1],
    );

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
    version: PKG_JSON.version,
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

  const tsContent = `// Auto-generated by scripts/build-registry.ts - DO NOT EDIT MANUALLY\nimport type { Registry } from "./types";\n\nexport const REGISTRY_DATA: Registry = ${JSON.stringify(
    registry,
    null,
    2,
  )};\n`;
  writeFileSync(join(SRC_DIR, "registry/data.ts"), tsContent, "utf8");
  console.log("✓ Generated packages/doodle-ui/src/registry/data.ts");

  const rootRegistryJsonPath = join(ROOT_DIR, "registry.json");
  writeFileSync(rootRegistryJsonPath, JSON.stringify(registry, null, 2), "utf8");
  console.log("✓ Generated /registry.json");

  const rootRegistryDir = join(ROOT_DIR, "registry");
  if (!existsSync(rootRegistryDir)) mkdirSync(rootRegistryDir, { recursive: true });

  for (const [name, comp] of Object.entries(registry.components)) {
    writeFileSync(
      join(rootRegistryDir, `${name}.json`),
      JSON.stringify(comp, null, 2),
      "utf8",
    );
  }
  console.log(
    `✓ Generated ${Object.keys(registry.components).length} component JSONs in /registry/`,
  );

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
