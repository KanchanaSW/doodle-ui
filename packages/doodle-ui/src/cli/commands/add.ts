import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import * as p from "@clack/prompts";
import pc from "picocolors";
import {
  DEFAULT_CONFIG,
  loadConfig,
  saveConfig,
} from "../config";
import { installPackages } from "../pm";
import { detectPackageManager, scanProject } from "../project";
import { fetchRegistry, resolveComponentDependencies } from "../registry";
import { transformComponentSource } from "../transformer";
import { copySharedFiles, initCommand } from "./init";

export interface AddOptions {
  yes?: boolean;
  overwrite?: boolean;
  all?: boolean;
  cwd?: string;
  path?: string;
}

export async function addCommand(
  components: string[],
  options: AddOptions = {},
): Promise<void> {
  const cwd = options.cwd || process.cwd();
  let config = loadConfig(cwd);

  // If no config found, prompt to initialize
  if (!config) {
    if (options.yes) {
      await initCommand({ yes: true, cwd });
      config = loadConfig(cwd);
    } else {
      const shouldInit = await p.confirm({
        message:
          "No doodleui.config.json found. Would you like to initialize DoodleUI first?",
        initialValue: true,
      });

      if (p.isCancel(shouldInit) || !shouldInit) {
        p.cancel("Add cancelled. Please run `npx doodleui-react init` first.");
        return;
      }

      await initCommand({ cwd });
      config = loadConfig(cwd);
    }

    if (!config) {
      config = DEFAULT_CONFIG;
      saveConfig(cwd, config);
    }
  }

  // Override components path if provided
  if (options.path) {
    config.paths.components = options.path;
  }

  const s = p.spinner();
  s.start("Fetching component registry...");
  const registry = await fetchRegistry(config.registryUrl);
  s.stop("Registry loaded");

  let targets = [...components];

  if (options.all) {
    targets = Object.keys(registry.components);
  } else if (targets.length === 0) {
    // Interactive multi-select prompt
    const compChoices = Object.values(registry.components).map((comp) => ({
      value: comp.name,
      label: `${comp.name} - ${comp.displayName}`,
      hint: comp.description.slice(0, 60),
    }));

    const selected = await p.multiselect({
      message: "Select components to add:",
      options: compChoices,
      required: true,
    });

    if (p.isCancel(selected)) {
      p.cancel("Operation cancelled.");
      return;
    }

    targets = selected as string[];
  }

  if (targets.length === 0) {
    p.log.warn("No components specified.");
    return;
  }

  // Resolve components and their dependencies
  const resolution = resolveComponentDependencies(registry, targets);

  if (resolution.missingNames.length > 0) {
    p.log.error(
      `Unknown component(s): ${pc.red(resolution.missingNames.join(", "))}`,
    );
    p.log.info(
      `Run ${pc.cyan("npx doodleui-react list")} to see all available components.`,
    );
    if (resolution.components.length === 0) return;
  }

  const componentsDir = join(cwd, config.paths.components);
  if (!existsSync(componentsDir)) {
    mkdirSync(componentsDir, { recursive: true });
  }

  // Ensure shared files are present
  const sharedDir = join(cwd, config.paths.shared);
  const sharedIndexFile = join(sharedDir, "animations/index.ts");
  if (!existsSync(sharedIndexFile)) {
    s.start("Installing shared internal utilities...");
    await copySharedFiles(cwd, config, registry.sharedFiles);
    s.stop(`Copied shared utilities to ${pc.green(config.paths.shared)}`);
  }

  const addedFiles: string[] = [];
  const skippedFiles: string[] = [];

  for (const comp of resolution.components) {
    for (const file of comp.files) {
      const targetPath = join(componentsDir, file.name);

      if (existsSync(targetPath) && !options.overwrite) {
        if (options.yes) {
          skippedFiles.push(relative(cwd, targetPath));
          continue;
        }

        const shouldOverwrite = await p.confirm({
          message: `${pc.yellow(
            relative(cwd, targetPath),
          )} already exists. Overwrite?`,
          initialValue: false,
        });

        if (p.isCancel(shouldOverwrite) || !shouldOverwrite) {
          skippedFiles.push(relative(cwd, targetPath));
          continue;
        }
      }

      const transformed = transformComponentSource(file.content, config);
      writeFileSync(targetPath, transformed, "utf8");
      addedFiles.push(relative(cwd, targetPath));
    }
  }

  // Check npm dependencies
  const project = scanProject(cwd);
  const pm = project.packageManager || detectPackageManager(cwd);
  const allNeededNpmDeps = new Set<string>([
    "roughjs",
    "framer-motion",
    ...resolution.npmDependencies,
  ]);

  const missingNpmDeps = Array.from(allNeededNpmDeps).filter(
    (dep) => !project.dependencies.has(dep) && !project.devDependencies.has(dep),
  );

  if (missingNpmDeps.length > 0) {
    s.start(`Installing dependencies (${missingNpmDeps.join(", ")})...`);
    try {
      await installPackages(missingNpmDeps, {
        cwd,
        packageManager: pm,
        silent: true,
      });
      s.stop(`Installed ${pc.green(missingNpmDeps.join(", "))}`);
    } catch (err) {
      s.stop(
        pc.yellow(`Failed to auto-install: ${missingNpmDeps.join(", ")}`),
      );
      console.warn(err);
    }
  }

  // Print results
  for (const file of addedFiles) {
    p.log.success(`Added ${pc.green(file)}`);
  }
  for (const file of skippedFiles) {
    p.log.warn(`Skipped existing ${pc.dim(file)}`);
  }

  if (addedFiles.length > 0) {
    p.outro(
      `${pc.bold(pc.green("Done!"))} Added ${addedFiles.length} component(s).`,
    );
  } else {
    p.outro("No files were added.");
  }
}
