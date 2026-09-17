import { execa } from "execa";
import { detectPackageManager, type PackageManager } from "./project";

export interface InstallOptions {
  cwd?: string;
  dev?: boolean;
  packageManager?: PackageManager;
  silent?: boolean;
}

export interface InstallCommand {
  cmd: string;
  args: string[];
}

/** Build the install command for a given package manager (exported for tests). */
export function buildInstallCommand(
  packages: string[],
  options: Pick<InstallOptions, "dev" | "packageManager"> & {
    cwd?: string;
  } = {},
): InstallCommand {
  const cwd = options.cwd || process.cwd();
  const pm = options.packageManager || detectPackageManager(cwd);
  const isDev = Boolean(options.dev);

  switch (pm) {
    case "pnpm":
      return {
        cmd: "pnpm",
        args: ["add", ...(isDev ? ["-D"] : []), ...packages],
      };
    case "yarn":
      return {
        cmd: "yarn",
        args: ["add", ...(isDev ? ["-D"] : []), ...packages],
      };
    case "bun":
      return {
        cmd: "bun",
        args: ["add", ...(isDev ? ["-d"] : []), ...packages],
      };
    case "npm":
    default:
      return {
        cmd: "npm",
        args: [
          "install",
          ...(isDev ? ["--save-dev"] : ["--save"]),
          ...packages,
        ],
      };
  }
}

export async function installPackages(
  packages: string[],
  options: InstallOptions = {},
): Promise<void> {
  if (packages.length === 0) return;

  const cwd = options.cwd || process.cwd();
  const { cmd, args } = buildInstallCommand(packages, {
    cwd,
    dev: options.dev,
    packageManager: options.packageManager,
  });

  await execa(cmd, args, {
    cwd,
    stdio: options.silent ? "ignore" : "inherit",
  });
}
