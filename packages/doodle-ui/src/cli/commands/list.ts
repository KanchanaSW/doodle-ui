import { existsSync } from "node:fs";
import { join, relative } from "node:path";
import pc from "picocolors";
import { loadConfig } from "../config";
import { fetchRegistry } from "../registry";

export interface ListOptions {
  cwd?: string;
  json?: boolean;
}

export async function listCommand(options: ListOptions = {}): Promise<void> {
  const cwd = options.cwd || process.cwd();
  const config = loadConfig(cwd);

  const componentsRelPath =
    config?.paths.components ||
    (existsSync(join(cwd, "src"))
      ? "src/components/doodleui"
      : "components/doodleui");
  const componentsDir = join(cwd, componentsRelPath);

  const registry = await fetchRegistry(config?.registryUrl);
  const items = Object.values(registry.components).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const statusList = items.map((comp) => {
    const filename = comp.files[0]?.name || `${comp.name}.tsx`;
    const fullPath = join(componentsDir, filename);
    const altFullPath = join(componentsDir, `${comp.displayName}.tsx`);
    const installed = existsSync(fullPath) || existsSync(altFullPath);
    const installedPath = installed
      ? relative(cwd, existsSync(fullPath) ? fullPath : altFullPath)
      : null;

    return {
      name: comp.name,
      displayName: comp.displayName,
      description: comp.description,
      installed,
      path: installedPath,
      dependencies: comp.dependencies,
      componentDependencies: comp.componentDependencies,
    };
  });

  if (options.json) {
    console.log(JSON.stringify(statusList, null, 2));
    return;
  }

  const installedCount = statusList.filter((s) => s.installed).length;

  console.log(
    `\n${pc.bold(pc.cyan("DoodleUI Components"))} (${statusList.length} total, ${
      installedCount > 0 ? pc.green(`${installedCount} installed`) : "none installed"
    })\n`,
  );

  for (const item of statusList) {
    if (item.installed) {
      console.log(
        `  ${pc.green("✓")} ${pc.bold(item.name.padEnd(18))} ${pc.green(
          `[installed: ${item.path}]`,
        )}`,
      );
    } else {
      console.log(
        `  ${pc.dim("○")} ${pc.white(item.name.padEnd(18))} ${pc.dim(
          item.description.slice(0, 55) +
            (item.description.length > 55 ? "..." : ""),
        )}`,
      );
    }
  }

  console.log(
    `\nAdd components with: ${pc.cyan("npx doodleui-react add <name>")}\n`,
  );
}
