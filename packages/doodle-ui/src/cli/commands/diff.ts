import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import * as p from "@clack/prompts";
import * as diff from "diff";
import pc from "picocolors";
import { loadConfig } from "../config";
import { fetchRegistry, findComponentInRegistry } from "../registry";
import { transformComponentSource } from "../transformer";

export interface DiffOptions {
  cwd?: string;
}

export async function diffCommand(
  componentName?: string,
  options: DiffOptions = {},
): Promise<void> {
  const cwd = options.cwd || process.cwd();
  const config = loadConfig(cwd);

  const componentsRelPath =
    config?.paths.components ||
    (existsSync(join(cwd, "src"))
      ? "src/components/doodleui"
      : "components/doodleui");
  const componentsDir = join(cwd, componentsRelPath);

  const registry = await fetchRegistry(config?.registryUrl);

  let targetName = componentName;

  if (!targetName) {
    // Check installed components
    const installed = Object.values(registry.components).filter((comp) => {
      const filename = comp.files[0]?.name || `${comp.name}.tsx`;
      return (
        existsSync(join(componentsDir, filename)) ||
        existsSync(join(componentsDir, `${comp.displayName}.tsx`))
      );
    });

    if (installed.length === 0) {
      p.log.warn(
        `No installed DoodleUI components found in ${relative(cwd, componentsDir)}.`,
      );
      return;
    }

    const choice = await p.select({
      message: "Select an installed component to diff against registry:",
      options: installed.map((comp) => ({
        value: comp.name,
        label: comp.name,
        hint: `at ${relative(
          cwd,
          join(componentsDir, comp.files[0]?.name || `${comp.name}.tsx`),
        )}`,
      })),
    });

    if (p.isCancel(choice)) {
      p.cancel("Diff cancelled.");
      return;
    }

    targetName = choice as string;
  }

  const comp = findComponentInRegistry(registry, targetName);
  if (!comp) {
    p.log.error(`Component "${targetName}" not found in registry.`);
    return;
  }

  const filename = comp.files[0]?.name || `${comp.name}.tsx`;
  let localPath = join(componentsDir, filename);
  if (!existsSync(localPath)) {
    const altPath = join(componentsDir, `${comp.displayName}.tsx`);
    if (existsSync(altPath)) localPath = altPath;
    else {
      p.log.error(
        `Component "${comp.name}" is not installed at ${relative(
          cwd,
          localPath,
        )}.`,
      );
      return;
    }
  }

  const localContent = readFileSync(localPath, "utf8");
  const compSource = comp.files[0]?.content || "";
  const expectedContent = transformComponentSource(
    compSource,
    config || {
      framework: "nextjs",
      typescript: true,
      paths: { components: componentsRelPath, shared: `${componentsRelPath}/shared` },
    },
  );

  if (localContent === expectedContent) {
    p.log.success(
      `${pc.green("✓")} ${pc.bold(relative(cwd, localPath))} matches upstream registry version (no differences).`,
    );
    return;
  }

  console.log(
    `\n${pc.bold("Comparing:")} ${pc.cyan(
      relative(cwd, localPath),
    )} (local) vs ${pc.magenta("registry/" + comp.name)}\n`,
  );

  const patch = diff.createTwoFilesPatch(
    `registry/${comp.name}`,
    relative(cwd, localPath),
    expectedContent,
    localContent,
  );

  const lines = patch.split("\n");
  for (const line of lines) {
    if (line.startsWith("---") || line.startsWith("+++")) {
      console.log(pc.bold(line));
    } else if (line.startsWith("@@")) {
      console.log(pc.cyan(line));
    } else if (line.startsWith("+")) {
      console.log(pc.green(line));
    } else if (line.startsWith("-")) {
      console.log(pc.red(line));
    } else {
      console.log(pc.dim(line));
    }
  }
}
