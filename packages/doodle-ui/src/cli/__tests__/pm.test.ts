import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildInstallCommand } from "../pm";
import { detectPackageManager } from "../project";

const temps: string[] = [];

function tempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "doodleui-pm-"));
  temps.push(dir);
  return dir;
}

afterEach(() => {
  while (temps.length > 0) {
    const dir = temps.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
  delete process.env.npm_config_user_agent;
});

describe("detectPackageManager", () => {
  it("detects pnpm from pnpm-lock.yaml", () => {
    const dir = tempDir();
    writeFileSync(join(dir, "pnpm-lock.yaml"), "lockfileVersion: '9.0'\n");
    expect(detectPackageManager(dir)).toBe("pnpm");
  });

  it("detects yarn from yarn.lock", () => {
    const dir = tempDir();
    writeFileSync(join(dir, "yarn.lock"), "# yarn lockfile v1\n");
    expect(detectPackageManager(dir)).toBe("yarn");
  });

  it("detects bun from bun.lockb", () => {
    const dir = tempDir();
    writeFileSync(join(dir, "bun.lockb"), "binary");
    expect(detectPackageManager(dir)).toBe("bun");
  });

  it("detects bun from bun.lock", () => {
    const dir = tempDir();
    writeFileSync(join(dir, "bun.lock"), "{}\n");
    expect(detectPackageManager(dir)).toBe("bun");
  });

  it("detects npm from package-lock.json", () => {
    const dir = tempDir();
    writeFileSync(join(dir, "package-lock.json"), "{}\n");
    expect(detectPackageManager(dir)).toBe("npm");
  });

  it("prefers pnpm when multiple lockfiles exist", () => {
    const dir = tempDir();
    writeFileSync(join(dir, "pnpm-lock.yaml"), "lockfileVersion: '9.0'\n");
    writeFileSync(join(dir, "package-lock.json"), "{}\n");
    writeFileSync(join(dir, "yarn.lock"), "# yarn\n");
    expect(detectPackageManager(dir)).toBe("pnpm");
  });

  it("falls back to npm_config_user_agent when no lockfile", () => {
    const dir = tempDir();
    mkdirSync(dir, { recursive: true });
    process.env.npm_config_user_agent = "pnpm/9.15.9 npm/? node/v20";
    expect(detectPackageManager(dir)).toBe("pnpm");

    process.env.npm_config_user_agent = "yarn/1.22.22 npm/? node/v20";
    expect(detectPackageManager(dir)).toBe("yarn");

    process.env.npm_config_user_agent = "bun/1.1.0 npm/? node/v20";
    expect(detectPackageManager(dir)).toBe("bun");
  });

  it("defaults to npm when nothing matches", () => {
    const dir = tempDir();
    delete process.env.npm_config_user_agent;
    expect(detectPackageManager(dir)).toBe("npm");
  });
});

describe("buildInstallCommand", () => {
  it("builds npm install --save", () => {
    expect(
      buildInstallCommand(["roughjs"], { packageManager: "npm" }),
    ).toEqual({
      cmd: "npm",
      args: ["install", "--save", "roughjs"],
    });
  });

  it("builds npm install --save-dev", () => {
    expect(
      buildInstallCommand(["typescript"], {
        packageManager: "npm",
        dev: true,
      }),
    ).toEqual({
      cmd: "npm",
      args: ["install", "--save-dev", "typescript"],
    });
  });

  it("builds pnpm add / -D", () => {
    expect(
      buildInstallCommand(["framer-motion"], { packageManager: "pnpm" }),
    ).toEqual({
      cmd: "pnpm",
      args: ["add", "framer-motion"],
    });
    expect(
      buildInstallCommand(["typescript"], {
        packageManager: "pnpm",
        dev: true,
      }),
    ).toEqual({
      cmd: "pnpm",
      args: ["add", "-D", "typescript"],
    });
  });

  it("builds yarn add / -D", () => {
    expect(
      buildInstallCommand(["roughjs"], { packageManager: "yarn" }),
    ).toEqual({
      cmd: "yarn",
      args: ["add", "roughjs"],
    });
    expect(
      buildInstallCommand(["typescript"], {
        packageManager: "yarn",
        dev: true,
      }),
    ).toEqual({
      cmd: "yarn",
      args: ["add", "-D", "typescript"],
    });
  });

  it("builds bun add / -d", () => {
    expect(
      buildInstallCommand(["roughjs"], { packageManager: "bun" }),
    ).toEqual({
      cmd: "bun",
      args: ["add", "roughjs"],
    });
    expect(
      buildInstallCommand(["typescript"], {
        packageManager: "bun",
        dev: true,
      }),
    ).toEqual({
      cmd: "bun",
      args: ["add", "-d", "typescript"],
    });
  });
});
