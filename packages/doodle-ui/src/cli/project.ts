import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type ProjectFramework = "nextjs" | "vite" | "cra" | "remix" | "other";
export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export interface ProjectInfo {
  framework: ProjectFramework;
  router: "app" | "pages" | null;
  typescript: boolean;
  hasSrcDir: boolean;
  tailwind: {
    installed: boolean;
    configFile: string | null;
    cssFile: string | null;
  };
  aliasPrefix: string | null;
  packageManager: PackageManager;
  dependencies: Set<string>;
  devDependencies: Set<string>;
}

export function detectPackageManager(cwd: string = process.cwd()): PackageManager {
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  if (existsSync(join(cwd, "bun.lockb")) || existsSync(join(cwd, "bun.lock"))) return "bun";
  if (existsSync(join(cwd, "package-lock.json"))) return "npm";

  const userAgent = process.env.npm_config_user_agent;
  if (userAgent) {
    if (userAgent.startsWith("pnpm")) return "pnpm";
    if (userAgent.startsWith("yarn")) return "yarn";
    if (userAgent.startsWith("bun")) return "bun";
  }

  return "npm";
}

export function scanProject(cwd: string = process.cwd()): ProjectInfo {
  let pkgJson: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  } = {};

  const pkgPath = join(cwd, "package.json");
  if (existsSync(pkgPath)) {
    try {
      pkgJson = JSON.parse(readFileSync(pkgPath, "utf8"));
    } catch {
      // ignore
    }
  }

  const dependencies = new Set(Object.keys(pkgJson.dependencies || {}));
  const devDependencies = new Set(Object.keys(pkgJson.devDependencies || {}));
  const allDeps = new Set([...dependencies, ...devDependencies]);

  // 1. Detect Framework
  let framework: ProjectFramework = "other";
  if (allDeps.has("next")) {
    framework = "nextjs";
  } else if (allDeps.has("vite")) {
    framework = "vite";
  } else if (allDeps.has("react-scripts")) {
    framework = "cra";
  } else if (allDeps.has("@remix-run/react")) {
    framework = "remix";
  }

  const hasSrcDir = existsSync(join(cwd, "src"));

  // 2. Detect Router (if Next.js)
  let router: "app" | "pages" | null = null;
  if (framework === "nextjs") {
    const hasApp =
      existsSync(join(cwd, "app")) || (hasSrcDir && existsSync(join(cwd, "src/app")));
    const hasPages =
      existsSync(join(cwd, "pages")) || (hasSrcDir && existsSync(join(cwd, "src/pages")));

    if (hasApp) router = "app";
    else if (hasPages) router = "pages";
    else router = "app";
  }

  // 3. Detect TypeScript
  const hasTsConfig = existsSync(join(cwd, "tsconfig.json"));
  const typescript = hasTsConfig || allDeps.has("typescript");

  // 4. Detect Tailwind
  const tailwindConfigs = [
    "tailwind.config.ts",
    "tailwind.config.js",
    "tailwind.config.cjs",
    "tailwind.config.mjs",
  ];
  let tailwindConfigFile: string | null = null;
  for (const cfg of tailwindConfigs) {
    if (existsSync(join(cwd, cfg))) {
      tailwindConfigFile = cfg;
      break;
    }
  }

  const possibleCssFiles = [
    "app/globals.css",
    "src/app/globals.css",
    "src/index.css",
    "src/styles/globals.css",
    "src/App.css",
    "styles/globals.css",
  ];
  let tailwindCssFile: string | null = null;
  for (const css of possibleCssFiles) {
    if (existsSync(join(cwd, css))) {
      tailwindCssFile = css;
      break;
    }
  }

  const hasTailwind =
    Boolean(tailwindConfigFile) ||
    allDeps.has("tailwindcss") ||
    allDeps.has("@tailwindcss/postcss");

  // 5. Detect Path Alias
  let aliasPrefix: string | null = null;
  const configPath = hasTsConfig
    ? join(cwd, "tsconfig.json")
    : existsSync(join(cwd, "jsconfig.json"))
      ? join(cwd, "jsconfig.json")
      : null;

  if (configPath) {
    try {
      // Strip comments for basic JSON parsing
      const raw = readFileSync(configPath, "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
      const parsed = JSON.parse(raw);
      const paths = parsed.compilerOptions?.paths;
      if (paths) {
        for (const key of Object.keys(paths)) {
          if (key.startsWith("@/")) {
            aliasPrefix = "@/";
            break;
          } else if (key.startsWith("~/")) {
            aliasPrefix = "~/";
            break;
          }
        }
      }
    } catch {
      // ignore
    }
  }

  if (!aliasPrefix && (framework === "nextjs" || hasTsConfig)) {
    aliasPrefix = "@/";
  }

  const packageManager = detectPackageManager(cwd);

  return {
    framework,
    router,
    typescript,
    hasSrcDir,
    tailwind: {
      installed: hasTailwind,
      configFile: tailwindConfigFile,
      cssFile: tailwindCssFile,
    },
    aliasPrefix,
    packageManager,
    dependencies,
    devDependencies,
  };
}
