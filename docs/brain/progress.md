# Progress

## Done
- 56 components with docs pages (`apps/docs/lib/nav.ts` lists 56 slugs), all exported from `src/index.ts`.
- Theming via CSS vars + dark mode; theme generator at `/customize`.
- SSR/hydration safety suite (`src/__tests__/ssr*.test.tsx`).
- A11y audit pass (WCAG AA contrast, 239 pairs) — `A11Y-AUDIT.md`.
- Perf audit + memoization — `docs/superpowers/reports/2026-09-18-rendering-performance-audit.md`.
- CLI (`init`, `add`, `list`, `diff`, `mcp`) + MCP server with tests.
- CI: lint/typecheck, unit tests + coverage, size-limit, Chromatic, cross-PM smoke tests.
- Blocks gallery with 12 hero blocks, 5 carousel blocks, and 5 bento blocks.

## Pending / gaps
- Dedicated test files exist for 20 of 56 components (+ Smoke, ApiHardening, ControlledCompound, FormIntegration cross-cutting suites). No dedicated tests for e.g. Button, Card, Input, Table, Sidebar, Carousel, Command, Menubar, NavigationMenu.
- Stories exist for ~22 components (23 story files incl. `Presentational`).
- `PromptInput` added after v0.8.0 with no pending changeset (UNVERIFIED whether intentional).

## Known bugs
- **Likely: CLI-installed components have unresolved imports.** `SHARED_FILES` in `scripts/build-registry.ts` omits `hooks/useSketchDefaults.ts`, `primitives/{size,interactive,validation,icon}`, all imported by components (and `RoughSvg`). Not reproduced end-to-end. See `gotchas.md`.
- No TODO/FIXME/HACK markers in source. Add bugs here as discovered.

## Tech debt
- **CLI version hardcoded**: `src/cli/index.ts` has `.version("0.8.0")`; package.json version is bumped by Changesets but this string is not. MCP server correctly uses `REGISTRY_DATA.version`.
- **Node version drift**: `engines.node >=22` and CI use Node 22, but `netlify.toml` sets `NODE_VERSION = "20"`; CLI tsup `target: "node18"`.
- **Duplicate prop docs**: `apps/docs/lib/props.ts` (1027 lines, hand-written) duplicates JSDoc-extracted prop docs in the registry; they can drift.
- **`ComponentPlayground.tsx` is 2554 lines** — one file for all component playgrounds.
- **Library `lint` = `tsc --noEmit`** (same as typecheck); no ESLint or Prettier for the library. Docs uses `next lint` only.
- **Inconsistent memoization**: only Button, Badge, Card, Table (+ RoughSvg, SketchBox) use `React.memo`; other 50 components don't.
- **Compound API inconsistency**: only Card, Table, Accordion, Field expose `Object.assign` dot-parts; others export flat parts only.
- **Deprecated aliases still exported**: `TableHeaderCell`/`TableHeaderCellProps` (use `TableHead`), Card `title`/`footer` props (use `Card.Header`/`Card.Footer`).
- **Repo clutter**: `doodleui-react-0.7.0.tgz` (root) and `packages/doodle-ui/doodleui-react-0.1.0.tgz` (gitignored via `*.tgz`, but present on disk); stray `apps/docs/apps/docs/.netlify/` directory.
- `CLI` uses `catch (err: any)` in `src/cli/index.ts`.
