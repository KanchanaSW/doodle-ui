/**
 * Confirms selective imports stay smaller than the full package entry.
 * Run after `pnpm build`.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

type SizeResult = {
  name: string;
  size: number;
  passed: boolean;
};

const localBin = join(process.cwd(), "node_modules", ".bin", "size-limit");
const sizeLimitCmd = existsSync(localBin) ? localBin : "size-limit";

const raw = execFileSync(sizeLimitCmd, ["--json"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
});

const jsonStart = raw.indexOf("[");
if (jsonStart < 0) {
  console.error("size-limit did not return JSON");
  process.exit(1);
}

const parsed = JSON.parse(raw.slice(jsonStart)) as SizeResult[];
const full = parsed.find((r) => r.name.includes("full"));
const button = parsed.find((r) => r.name.includes("Button only"));

if (!full || !button) {
  console.error("Could not find size-limit results for full / Button only");
  process.exit(1);
}

if (button.size >= full.size) {
  console.error(
    `Tree-shake regression: Button (${button.size}) >= full (${full.size})`,
  );
  process.exit(1);
}

const saved = full.size - button.size;
console.log(
  `Tree-shake OK: Button is ${(saved / 1024).toFixed(1)} kB smaller than full package (${(button.size / 1024).toFixed(1)} vs ${(full.size / 1024).toFixed(1)} kB gzipped)`,
);

if (parsed.some((r) => !r.passed)) {
  console.error("One or more size-limit budgets failed");
  process.exit(1);
}
