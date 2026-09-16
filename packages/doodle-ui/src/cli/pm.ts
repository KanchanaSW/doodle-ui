import { execa } from "execa";
import { detectPackageManager, type PackageManager } from "./project";

export interface InstallOptions {
  cwd?: string;
  dev?: boolean;
  packageManager?: PackageManager;
  silent?: boolean;
}

export async function installPackages(
  packages: string[],
  options: InstallOptions = {},
): Promise<void> {
  if (packages.length === 0) return;

  const cwd = options.cwd || process.cwd();
  const pm = options.packageManager || detectPackageManager(cwd);
  const isDev = Boolean(options.dev);

  let cmd: string;
  let args: string[];

  switch (pm) {
    case "pnpm":
      cmd = "pnpm";
      args = ["add", ...(isDev ? ["-D"] : []), ...packages];
      break;
    case "yarn":
      cmd = "yarn";
      args = ["add", ...(isDev ? ["-D"] : []), ...packages];
      break;
    case "bun":
      cmd = "bun";
      args = ["add", ...(isDev ? ["-d"] : []), ...packages];
      break;
    case "npm":
    default:
      cmd = "npm";
      args = ["install", ...(isDev ? ["--save-dev"] : ["--save"]), ...packages];
      break;
  }

  await execa(cmd, args, {
    cwd,
    stdio: options.silent ? "ignore" : "inherit",
  });
}
