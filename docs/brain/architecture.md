# Architecture

## Workspace
- `pnpm-workspace.yaml`: `packages/*`, `apps/*`. `examples/*` are NOT workspace members (each has its own lockfile).
- `turbo.json`: `build` depends on `^build` (outputs `dist/**`, `.next/**`); `typecheck`/`test` depend on `^build`; `dev` is persistent/uncached.
- Docs depends on `doodleui-react: workspace:*` and uses `transpilePackages: ["doodleui-react"]`.

## Library layers (`packages/doodle-ui/src`)

```
components/*        public UI (Radix wrapper + RoughSvg overlay + HTML content)
   │ uses
primitives/         RoughSvg (rough.js → SVG), SketchBox, SlidingPanel, icon, size, interactive, validation
hooks/              useResolvedSeed, useSketchTheme, useSketchDefaults, useElementSize, useIsomorphicLayoutEffect
animations/         DoodleUIProvider (+ useDoodleUI), useAnimate, useDrawIn, usePrefersReducedMotion, useTweenNumber
context/            SketchSeedContext
types.ts / utils.ts SketchProps, palettes, DEFAULT_* constants, toRoughOptions; cn, assignRef, deriveSeed, randomSeed
```

### Rendering a sketch component
1. Component resolves `seed = useResolvedSeed(seedProp)`, `theme = useSketchTheme(sketchColor)`, `shouldAnimate = useAnimate(animate)`.
2. Renders host element (`position: relative`, inline styles) containing `<RoughSvg>` + content at `zIndex: 1`.
3. `RoughSvg` measures its box (`useElementSize` / ResizeObserver), memoizes `rough.generator()` output on visual inputs, and in a layout effect imperatively writes the SVG (so React reconciliation can't wipe rough.js nodes). Reads CSS vars on the mounted node; skips repaint when the paint key is unchanged.
4. `useDrawIn` animates `stroke-dashoffset` on mount / seed change; disconnects its MutationObserver after a settle window.

### Resolution precedence
Sketch options: prop → `DoodleUIProvider` → `--doodle-ui-*` CSS var → `DEFAULT_*` constant.
Seed: prop → `SketchSeedProvider` → `DEFAULT_SEED` (0) on server/first render → random after mount.
Dark mode: provider `theme` → `.light/.dark` class / `data-theme` on `<html>` → `prefers-color-scheme` (detected after mount only).

## Build outputs (`tsup.config.ts`)
- Library: `src/index.ts` → `dist/index.{js,cjs,d.ts}`, ESM+CJS, splitting, treeshake. `onSuccess` copies `styles.css` and **prepends `"use client"`** to both bundles. Radix, framer-motion, cmdk, input-otp, embla, react-resizable-panels are external; **roughjs is bundled**.
- CLI: `src/cli/index.ts` → `dist/cli.js` (ESM, shebang, target node18). Exposed as bins `doodleui-react` and `doodleui`.

## Registry pipeline
`scripts/build-registry.ts` (runs before tsup in `build`):
- Inputs: `src/components/*.tsx`, TS JSDoc (via the `typescript` compiler API), `src/data/component-meta.ts`, a fixed `SHARED_FILES` list.
- Outputs: `src/registry/data.ts` (embedded in CLI + MCP), `registry.json` + `registry/*.json` (root, committed; CLI fetches from GitHub `master`), `apps/docs/public/registry.json` + `public/registry/*.json`.
- CLI `add` rewrites imports via `cli/transformer.ts`: `../x` → `<aliases.shared>/x`, `./PascalCase` → `./kebab-case`.

## Docs app (`apps/docs`)
- Next 14 App Router, `output: "export"`, `trailingSlash: true`, MDX via `@next/mdx` (`mdx-components.tsx` styles headings/code with Tailwind).
- Routes: `/` (home bento showcase), `/docs/<slug>` (one `page.mdx` per component + guides: animation, theming, sizing, icons, forms, controlled-uncontrolled, performance, mcp, vs-shadcn), `/blocks`, `/customize` (theme generator), `/install`, `/benchmark`.
- Component pages pattern: `<ComponentPlayground name="x" />`, `<ComponentCliInstallTabs name="x" />`, usage code block, `<PropsTable rows={xProps} />` from `lib/props.ts`.
- Nav source of truth: `lib/nav.ts` `COMPONENT_PAGES`. Blocks: `lib/blocks.ts` `BLOCK_CATEGORIES` + `components/blocks/index.ts` `BLOCK_COMPONENTS` (keep ids in sync).
- Providers: `app/providers.tsx` → `ComponentThemeProvider` (wraps `DoodleUIProvider`, `SketchSeedProvider`, `TooltipProvider`, `ToastProvider`).

## Deployment & release
- Netlify: `netlify.toml` builds lib then docs, publishes `apps/docs/out`. Redirect `/docs/comparison` → `/docs/vs-shadcn/`.
- npm: Changesets on `master` (`.github/workflows/release.yml`) — tests, build, size check, then version PR / publish with `NPM_TOKEN`, provenance off.
