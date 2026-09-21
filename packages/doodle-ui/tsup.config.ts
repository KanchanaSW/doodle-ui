import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { defineConfig } from "tsup";

const outputs = ["dist/index.js", "dist/index.cjs"];

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: false,
    external: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "framer-motion",
      "cmdk",
      "input-otp",
      "embla-carousel-react",
      "react-resizable-panels",
      /^@radix-ui\//,
    ],
    async onSuccess() {
      copyFileSync("src/styles.css", "dist/styles.css");
      for (const file of outputs) {
        const source = readFileSync(file, "utf8");
        if (source.startsWith('"use client"')) continue;
        writeFileSync(file, `"use client";\n${source}`);
      }
    },
  },
  {
    entry: {
      cli: "src/cli/index.ts",
    },
    format: ["esm"],
    dts: false,
    clean: false,
    target: "node18",
    banner: {
      js: "#!/usr/bin/env node",
    },
    external: [
      "@modelcontextprotocol/sdk",
      "@modelcontextprotocol/sdk/*",
      "zod",
      // Keep CLI deps that are already package dependencies
      "@clack/prompts",
      "commander",
      "diff",
      "execa",
      "picocolors",
    ],
  },
]);
