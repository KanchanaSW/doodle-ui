import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import * as p from "@clack/prompts";
import pc from "picocolors";
import {
  DEFAULT_CONFIG,
  loadConfig,
  saveConfig,
  type DoodleUIConfig,
} from "../config";
import { installPackages } from "../pm";
import { scanProject, type ProjectFramework } from "../project";
import { fetchRegistry } from "../registry";
import { transformSharedSource } from "../transformer";
import { SKETCH_BANNER } from "../utils";

export interface InitOptions {
  yes?: boolean;
  defaults?: boolean;
  cwd?: string;
}

export async function copySharedFiles(
  cwd: string,
  config: DoodleUIConfig,
  registrySharedFiles?: Array<{ path: string; content: string }>,
): Promise<string[]> {
  const sharedDir = join(cwd, config.paths.shared);
  const writtenFiles: string[] = [];

  const files =
    registrySharedFiles ||
    (await fetchRegistry(config.registryUrl)).sharedFiles;

  for (const item of files) {
    const targetFile = join(sharedDir, item.path);
    const targetDir = dirname(targetFile);

    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }

    const transformed = transformSharedSource(item.content, config);
    writeFileSync(targetFile, transformed, "utf8");
    writtenFiles.push(relative(cwd, targetFile));
  }

  return writtenFiles;
}

export async function initCommand(options: InitOptions = {}): Promise<void> {
  const cwd = options.cwd || process.cwd();
  const isAutomated = Boolean(options.yes || options.defaults);

  console.log(SKETCH_BANNER);

  const existingConfig = loadConfig(cwd);
  if (existingConfig && !isAutomated) {
    const shouldOverwrite = await p.confirm({
      message: `${pc.cyan(
        "doodleui.config.json",
      )} already exists. Do you want to re-initialize and overwrite?`,
      initialValue: false,
    });

    if (p.isCancel(shouldOverwrite) || !shouldOverwrite) {
      p.cancel("Operation cancelled.");
      return;
    }
  }

  const project = scanProject(cwd);

  let framework: ProjectFramework = project.framework;
  let typescript = project.typescript;
  let componentsPath = project.hasSrcDir
    ? "src/components/doodleui"
    : "components/doodleui";
  let alias = project.aliasPrefix
    ? `${project.aliasPrefix}components/doodleui`
    : `@/components/doodleui`;

  if (!isAutomated) {
    p.intro(pc.bold(pc.cyan("Initialize DoodleUI in your project")));

    const frameworkChoice = await p.select({
      message: "Which framework are you using?",
      options: [
        { value: "nextjs", label: "Next.js" },
        { value: "vite", label: "Vite" },
        { value: "cra", label: "Create React App" },
        { value: "remix", label: "Remix" },
        { value: "other", label: "Other / Pure React" },
      ],
      initialValue: project.framework,
    });
    if (p.isCancel(frameworkChoice)) {
      p.cancel("Initialization cancelled.");
      return;
    }
    framework = frameworkChoice as ProjectFramework;

    const tsChoice = await p.confirm({
      message: "Would you like to use TypeScript?",
      initialValue: project.typescript,
    });
    if (p.isCancel(tsChoice)) {
      p.cancel("Initialization cancelled.");
      return;
    }
    typescript = Boolean(tsChoice);

    if (project.tailwind.installed) {
      p.log.success(
        `Tailwind CSS detected${
          project.tailwind.configFile ? ` at ${project.tailwind.configFile}` : ""
        }`,
      );
    }

    const compDirChoice = await p.text({
      message: "Where should components be installed?",
      defaultValue: componentsPath,
      placeholder: componentsPath,
    });
    if (p.isCancel(compDirChoice)) {
      p.cancel("Initialization cancelled.");
      return;
    }
    componentsPath = (compDirChoice as string) || componentsPath;

    const aliasChoice = await p.text({
      message: "Configure the import alias for components:",
      defaultValue: alias,
      placeholder: alias,
    });
    if (p.isCancel(aliasChoice)) {
      p.cancel("Initialization cancelled.");
      return;
    }
    alias = (aliasChoice as string) || alias;
  }

  // Build final config
  const sharedRelPath = `${componentsPath}/shared`;
  const sharedAlias = alias ? `${alias}/shared` : undefined;

  const config: DoodleUIConfig = {
    $schema: DEFAULT_CONFIG.$schema,
    framework,
    router: project.router,
    typescript,
    tailwind: project.tailwind.installed
      ? {
          config: project.tailwind.configFile || undefined,
          css: project.tailwind.cssFile || undefined,
        }
      : false,
    paths: {
      components: componentsPath,
      shared: sharedRelPath,
    },
    aliases: {
      components: alias,
      shared: sharedAlias,
    },
  };

  const s = p.spinner();

  // Save config file
  s.start("Creating doodleui.config.json...");
  const configPath = saveConfig(cwd, config);
  s.stop(`Created ${pc.green(relative(cwd, configPath))}`);

  // Fetch registry
  s.start("Fetching component registry...");
  const registry = await fetchRegistry(config.registryUrl);
  s.stop("Registry loaded");

  // Copy shared internal files
  s.start("Copying shared internal utilities (useDrawIn, DoodleUIProvider, hooks)...");
  await copySharedFiles(cwd, config, registry.sharedFiles);
  s.stop(`Copied shared utilities to ${pc.green(sharedRelPath)}`);

  // Install runtime dependencies
  const sharedDeps = ["roughjs", "framer-motion"];
  const missingDeps = sharedDeps.filter(
    (dep) => !project.dependencies.has(dep) && !project.devDependencies.has(dep),
  );

  if (missingDeps.length > 0) {
    s.start(
      `Installing shared runtime dependencies (${missingDeps.join(", ")})...`,
    );
    try {
      await installPackages(missingDeps, {
        cwd,
        packageManager: project.packageManager,
        silent: true,
      });
      s.stop(`Installed ${pc.green(missingDeps.join(", "))}`);
    } catch (err) {
      s.stop(pc.yellow(`Failed to auto-install: ${missingDeps.join(", ")}`));
      console.warn(err);
    }
  } else {
    p.log.info("Shared runtime dependencies already installed.");
  }

  p.outro(
    `${pc.bold(pc.green("Success!"))} DoodleUI is configured and ready.\n\n` +
      `  • Add components: ${pc.cyan("npx doodleui-react add <component>")}\n` +
      `  • Import theme CSS: ${pc.cyan('import "doodleui-react/styles.css"')}\n` +
      `  • Wrap your layout in: ${pc.cyan(
        `<DoodleUIProvider>`,
      )} from ${pc.yellow(`"${sharedAlias || "./" + sharedRelPath}/animations"`)}\n`,
  );
}
