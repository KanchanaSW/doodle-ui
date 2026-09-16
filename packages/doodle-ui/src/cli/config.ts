import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

export interface DoodleUIConfig {
  $schema?: string;
  framework: "nextjs" | "vite" | "cra" | "remix" | "other";
  router?: "app" | "pages" | null;
  typescript: boolean;
  tailwind?:
    | {
        config?: string;
        css?: string;
      }
    | boolean;
  paths: {
    components: string;
    shared: string;
  };
  aliases?: {
    components?: string;
    shared?: string;
  };
  registryUrl?: string;
}

export const CONFIG_FILENAMES = [
  "doodleui.config.json",
  "doodleui.json",
];

export const DEFAULT_CONFIG: DoodleUIConfig = {
  $schema: "https://doodle-ui.netlify.app/schema.json",
  framework: "nextjs",
  router: "app",
  typescript: true,
  tailwind: true,
  paths: {
    components: "components/doodleui",
    shared: "components/doodleui/shared",
  },
  aliases: {
    components: "@/components/doodleui",
    shared: "@/components/doodleui/shared",
  },
};

export function findConfigPath(cwd: string = process.cwd()): string | null {
  for (const filename of CONFIG_FILENAMES) {
    const fullPath = join(cwd, filename);
    if (existsSync(fullPath)) return fullPath;
  }
  return null;
}

export function loadConfig(cwd: string = process.cwd()): DoodleUIConfig | null {
  const configPath = findConfigPath(cwd);
  if (!configPath) return null;

  try {
    const raw = readFileSync(configPath, "utf8");
    const parsed = JSON.parse(raw) as DoodleUIConfig;
    return parsed;
  } catch (err) {
    console.error(`Failed to parse ${configPath}:`, err);
    return null;
  }
}

export function saveConfig(
  cwd: string = process.cwd(),
  config: DoodleUIConfig,
  filename: string = "doodleui.config.json",
): string {
  const targetPath = join(cwd, filename);
  writeFileSync(targetPath, JSON.stringify(config, null, 2) + "\n", "utf8");
  return targetPath;
}

export function resolveResolvedPaths(
  cwd: string = process.cwd(),
  config: DoodleUIConfig,
): { componentsDir: string; sharedDir: string } {
  return {
    componentsDir: resolve(cwd, config.paths.components),
    sharedDir: resolve(cwd, config.paths.shared),
  };
}
