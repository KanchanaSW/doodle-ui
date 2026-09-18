#!/usr/bin/env node
/**
 * Cross-package-manager consumer smoke test.
 *
 * Usage:
 *   node scripts/test-pm-consumer.mjs --pm <npm|pnpm|yarn-classic|yarn-berry|bun|all> --tarball <path>
 *
 * Installs a packed doodleui-react tarball into a clean temp project, then verifies:
 * - install succeeds
 * - root export resolves and SSR-renders Button/Card
 * - styles.css subpath resolves
 * - TypeScript types resolve via tsc --noEmit
 */

import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";

const SUPPORTED = ["npm", "pnpm", "yarn-classic", "yarn-berry", "bun"];

function parseArgs(argv) {
  let pm = "npm";
  let tarball = null;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--pm") pm = argv[++i];
    else if (arg === "--tarball") tarball = argv[++i];
    else if (arg === "--help" || arg === "-h") {
      console.log(
        "Usage: node scripts/test-pm-consumer.mjs --pm <pm|all> --tarball <path>",
      );
      process.exit(0);
    }
  }
  if (!tarball) {
    console.error("Missing --tarball <path>");
    process.exit(1);
  }
  if (pm !== "all" && !SUPPORTED.includes(pm)) {
    console.error(`Unsupported --pm ${pm}. Use: ${SUPPORTED.join(", ")}, all`);
    process.exit(1);
  }
  return { pm, tarball: isAbsolute(tarball) ? tarball : resolve(process.cwd(), tarball) };
}

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    encoding: "utf8",
    stdio: opts.stdio ?? "inherit",
    cwd: opts.cwd,
    env: { ...process.env, ...(opts.env || {}) },
    shell: opts.shell ?? false,
  });
  if (result.status !== 0) {
    const detail = [result.stderr, result.stdout].filter(Boolean).join("\n");
    throw new Error(
      `Command failed (${result.status}): ${cmd} ${args.join(" ")}\n${detail}`,
    );
  }
  return result;
}

function which(bin) {
  const result = spawnSync(process.platform === "win32" ? "where" : "which", [bin], {
    encoding: "utf8",
  });
  return result.status === 0 ? result.stdout.trim().split("\n")[0] : null;
}

function writeConsumerFiles(dir) {
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify(
      {
        name: "doodleui-pm-smoke",
        private: true,
        type: "module",
        version: "0.0.0",
      },
      null,
      2,
    ),
  );

  writeFileSync(
    join(dir, "consumer.mjs"),
    `import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Button, Card, DoodleUIProvider } from "doodleui-react";

const require = createRequire(import.meta.url);

function resolveStyles() {
  try {
    if (typeof import.meta.resolve === "function") {
      const url = import.meta.resolve("doodleui-react/styles.css");
      const path = fileURLToPath(url);
      if (existsSync(path)) return path;
    }
  } catch {
    // fall through to createRequire
  }
  const pkgJson = require.resolve("doodleui-react/package.json");
  const styles = require.resolve("doodleui-react/styles.css");
  if (!existsSync(styles)) {
    throw new Error("styles.css resolved but file missing: " + styles);
  }
  if (!existsSync(pkgJson)) {
    throw new Error("package.json missing: " + pkgJson);
  }
  return styles;
}

const stylesPath = resolveStyles();
console.log("styles.css ->", stylesPath);

const html = renderToString(
  createElement(
    DoodleUIProvider,
    { animate: false },
    createElement(
      Card,
      { seed: 42, title: "Notebook" },
      createElement(Button, { seed: 42 }, "Smoke Test"),
    ),
  ),
);

if (!html.includes("Smoke Test")) {
  console.error("SSR output missing expected text:\\n", html.slice(0, 500));
  process.exit(1);
}

console.log("SSR OK:", html.includes("Smoke Test"));
`,
  );

  writeFileSync(
    join(dir, "consumer-types.tsx"),
    `import type { ButtonProps, CardProps } from "doodleui-react";
import { Button, Card, DoodleUIProvider } from "doodleui-react";

const buttonProps: ButtonProps = { children: "typed" };
const cardProps: CardProps = { title: "typed" };

export function Demo() {
  return (
    <DoodleUIProvider animate={false}>
      <Card {...cardProps}>
        <Button {...buttonProps} />
      </Card>
    </DoodleUIProvider>
  );
}
`,
  );

  writeFileSync(
    join(dir, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "bundler",
          jsx: "react-jsx",
          strict: true,
          skipLibCheck: true,
          noEmit: true,
          esModuleInterop: true,
          types: ["react", "react-dom"],
        },
        include: ["consumer-types.tsx"],
      },
      null,
      2,
    ),
  );
}

function yarnClassic(args, opts) {
  // Version-check from the consumer cwd (not the monorepo root) so Corepack
  // does not refuse yarn because the repo packageManager is pnpm.
  const yarnEnv = { ...opts?.env, YARN_IGNORE_PATH: "1" };
  const yarnPath = which("yarn");
  if (yarnPath) {
    const ver = spawnSync("yarn", ["--version"], {
      encoding: "utf8",
      cwd: opts?.cwd,
      env: { ...process.env, ...yarnEnv },
    });
    if (ver.status === 0 && ver.stdout.trim().startsWith("1.")) {
      return run("yarn", args, { ...opts, env: yarnEnv });
    }
  }
  return run("npm", ["exec", "--yes", "yarn@1.22.22", "--", ...args], {
    ...opts,
    env: yarnEnv,
  });
}

function installWithPm(pm, dir, tarball) {
  const absTarball = resolve(tarball);

  switch (pm) {
    case "npm": {
      run("npm", ["install", "react@18", "react-dom@18", absTarball], { cwd: dir });
      run(
        "npm",
        ["install", "-D", "typescript@5", "@types/react@18", "@types/react-dom@18"],
        { cwd: dir },
      );
      break;
    }
    case "pnpm": {
      const pnpmBin = which("pnpm");
      if (pnpmBin) {
        run(pnpmBin, ["add", "react@18", "react-dom@18", absTarball], { cwd: dir });
        run(
          pnpmBin,
          ["add", "-D", "typescript@5", "@types/react@18", "@types/react-dom@18"],
          { cwd: dir },
        );
      } else {
        run("npx", ["pnpm", "add", "react@18", "react-dom@18", absTarball], { cwd: dir });
        run(
          "npx",
          ["pnpm", "add", "-D", "typescript@5", "@types/react@18", "@types/react-dom@18"],
          { cwd: dir },
        );
      }
      break;
    }
    case "yarn-classic": {
      // Prefer a cwd-relative file: URL — Yarn Classic is unreliable with
      // absolute file: paths on some CI runners.
      const relTarball = `file:./${absTarball.split(/[/\\]/).pop()}`;
      yarnClassic(["add", "react@18", "react-dom@18", relTarball], { cwd: dir });
      yarnClassic(
        ["add", "-D", "typescript@5", "@types/react@18", "@types/react-dom@18"],
        { cwd: dir },
      );
      break;
    }
    case "yarn-berry": {
      // Yarn Berry ships via Corepack (the npm `yarn` package is Classic-only).
      if (!which("corepack")) {
        throw new Error(
          "corepack is required for yarn-berry tests. Enable it with: npm install -g corepack && corepack enable",
        );
      }
      run("corepack", ["enable"], { cwd: dir });
      const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
      pkg.packageManager = "yarn@4.6.0";
      writeFileSync(join(dir, "package.json"), JSON.stringify(pkg, null, 2));

      // Extract the tarball so we can install via portal: (keeps package on disk for PnP).
      const extractRoot = join(dir, "pkg-src");
      const pkgDir = join(dir, "pkg-dir");
      run("mkdir", ["-p", extractRoot], { cwd: dir });
      run("tar", ["-xzf", absTarball, "-C", extractRoot], { cwd: dir });
      run("mv", [join(extractRoot, "package"), pkgDir], { cwd: dir });

      // Keep Yarn's cache inside the temp project so virtual paths stay local.
      const yarnCache = join(dir, "yarn-cache");
      writeFileSync(
        join(dir, ".yarnrc.yml"),
        [
          "nodeLinker: pnp",
          "enableGlobalCache: false",
          "checksumBehavior: update",
          `cacheFolder: ${JSON.stringify(yarnCache)}`,
        ].join("\n") + "\n",
      );
      run("corepack", ["prepare", "yarn@4.6.0", "--activate"], { cwd: dir });
      run("yarn", ["--version"], {
        cwd: dir,
        env: {
          YARN_CACHE_FOLDER: yarnCache,
          YARN_ENABLE_GLOBAL_CACHE: "0",
        },
      });
      const yarnEnv = {
        YARN_CACHE_FOLDER: yarnCache,
        YARN_ENABLE_GLOBAL_CACHE: "0",
      };
      run(
        "yarn",
        ["add", "react@18", "react-dom@18", `doodleui-react@portal:${pkgDir}`],
        { cwd: dir, env: yarnEnv },
      );
      run(
        "yarn",
        ["add", "-D", "typescript@5", "@types/react@18", "@types/react-dom@18"],
        { cwd: dir, env: yarnEnv },
      );
      writeFileSync(join(dir, ".doodleui-yarn-cmd"), "yarn");
      writeFileSync(join(dir, ".doodleui-yarn-cache"), yarnCache);
      break;
    }
    case "bun": {
      if (!which("bun")) {
        throw new Error(
          "bun is not installed on PATH. Install from https://bun.sh then re-run.",
        );
      }
      run("bun", ["add", "react@18", "react-dom@18", absTarball], { cwd: dir });
      run(
        "bun",
        ["add", "-d", "typescript@5", "@types/react@18", "@types/react-dom@18"],
        { cwd: dir },
      );
      break;
    }
    default:
      throw new Error(`Unhandled pm: ${pm}`);
  }
}

function tscBin(dir) {
  const local = join(dir, "node_modules", ".bin", "tsc");
  if (existsSync(local)) return local;
  return null;
}

function berryEnv(dir) {
  const cachePath = join(dir, ".doodleui-yarn-cache");
  const env = { ...process.env };
  if (existsSync(cachePath)) {
    const yarnCache = readFileSync(cachePath, "utf8").trim();
    env.YARN_CACHE_FOLDER = yarnCache;
    env.YARN_ENABLE_GLOBAL_CACHE = "0";
  }
  return env;
}

function runBerryPnpExportCheck(dir) {
  writeFileSync(
    join(dir, "pnp-exports-check.cjs"),
    `const { createRequire } = require("module");
const { existsSync, readFileSync } = require("fs");
const requireFromHere = createRequire(__filename);

const pkgJsonPath = requireFromHere.resolve("doodleui-react/package.json");
const stylesPath = requireFromHere.resolve("doodleui-react/styles.css");
const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"));

if (!pkg.exports || !pkg.exports["."] || !pkg.exports["./styles.css"]) {
  console.error("exports map missing required entries", pkg.exports);
  process.exit(1);
}
if (!existsSync(stylesPath)) {
  console.error("styles.css missing at", stylesPath);
  process.exit(1);
}
console.log("PnP exports OK:", pkg.exports["./styles.css"]);
`,
  );

  run("yarn", ["node", "./pnp-exports-check.cjs"], {
    cwd: dir,
    env: berryEnv(dir),
  });
}

function runSmoke(pm, dir) {
  if (pm === "yarn-berry") {
    const env = berryEnv(dir);

    // 1) Confirm Plug'n'Play install + exports map resolution (the PnP-critical check).
    if (!existsSync(join(dir, ".pnp.cjs"))) {
      throw new Error("Expected .pnp.cjs after Yarn Berry PnP install");
    }
    runBerryPnpExportCheck(dir);

    // 2) Attempt full ESM SSR under PnP. Yarn's experimental ESM loader can fail on
    //    Node 22+ with zip-backed virtual packages; fall back to node-modules linker
    //    for the runtime/typecheck smoke while keeping the PnP export check above.
    const ssr = spawnSync("yarn", ["node", "./consumer.mjs"], {
      cwd: dir,
      env,
      encoding: "utf8",
    });
    if (ssr.status === 0) {
      console.log(ssr.stdout);
      run("yarn", ["exec", "tsc", "--noEmit", "-p", "tsconfig.json"], {
        cwd: dir,
        env,
      });
      return;
    }

    console.warn(
      "PnP ESM SSR failed (known Yarn experimental ESM limitation on newer Node); retrying with nodeLinker: node-modules for runtime smoke.",
    );
    if (ssr.stderr) console.warn(ssr.stderr.slice(0, 500));

    writeFileSync(
      join(dir, ".yarnrc.yml"),
      [
        "nodeLinker: node-modules",
        "enableGlobalCache: false",
        "checksumBehavior: update",
        `cacheFolder: ${JSON.stringify(env.YARN_CACHE_FOLDER || join(dir, "yarn-cache"))}`,
      ].join("\n") + "\n",
    );
    run("yarn", ["install"], { cwd: dir, env });
    run("node", ["./consumer.mjs"], { cwd: dir, env });
    run("yarn", ["exec", "tsc", "--noEmit", "-p", "tsconfig.json"], {
      cwd: dir,
      env,
    });
    return;
  }

  if (pm === "bun") {
    run("bun", ["run", "./consumer.mjs"], { cwd: dir });
    run("bunx", ["tsc", "--noEmit", "-p", "tsconfig.json"], { cwd: dir });
    return;
  }

  run("node", ["./consumer.mjs"], { cwd: dir });
  const bin = tscBin(dir);
  if (bin) {
    run(bin, ["--noEmit", "-p", "tsconfig.json"], { cwd: dir });
  } else {
    run("npx", ["tsc", "--noEmit", "-p", "tsconfig.json"], { cwd: dir });
  }
}

function testOne(pm, tarball) {
  if (!existsSync(tarball)) {
    throw new Error(`Tarball not found: ${tarball}`);
  }

  const dir = mkdtempSync(join(tmpdir(), `doodleui-${pm}-`));
  console.log(`\n=== ${pm} ===`);
  console.log(`workdir: ${dir}`);
  console.log(`tarball: ${tarball}`);

  try {
    writeConsumerFiles(dir);
    // Keep a local copy of the tarball inside the temp dir for managers that
    // struggle with paths outside the project (esp. Yarn Berry file: protocol).
    const localTarball = join(dir, "pkg.tgz");
    copyFileSync(tarball, localTarball);
    installWithPm(pm, dir, localTarball);
    runSmoke(pm, dir);
    console.log(`PASS: ${pm}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function main() {
  const { pm, tarball } = parseArgs(process.argv.slice(2));
  const targets = pm === "all" ? SUPPORTED : [pm];
  const failures = [];

  for (const target of targets) {
    try {
      testOne(target, tarball);
    } catch (err) {
      console.error(`FAIL: ${target}`);
      console.error(err instanceof Error ? err.message : err);
      failures.push(target);
    }
  }

  if (failures.length > 0) {
    console.error(`\nFailed: ${failures.join(", ")}`);
    process.exit(1);
  }

  console.log(`\nAll package managers passed (${targets.join(", ")})`);
}

main();
