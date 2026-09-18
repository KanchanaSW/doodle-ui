import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["scripts/benchmark.tsx"],
    css: true,
    pool: "forks",
    fileParallelism: false,
    // Surface console.log JSON for the performance report.
    silent: false,
    reporters: ["verbose"],
    onConsoleLog(log) {
      // Always print benchmark JSON to stdout.
      process.stdout.write(`${log}\n`);
      return false;
    },
  },
});
