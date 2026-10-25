# AGENTS.md — doodle-ui

Hand-drawn (Excalidraw-style) React component library. Published to npm as **`doodleui-react`** (v0.8.0), with a shadcn-style copy-in CLI, an MCP server for AI agents, and a Next.js docs site at https://doodle-ui.netlify.app.

Detailed context lives in [`docs/brain/`](docs/brain/). Read the relevant files there before any non-trivial task.

## Monorepo map (pnpm 9 + Turborepo, Node >= 22)

| Path | What |
| --- | --- |
| `packages/doodle-ui` | The library (`doodleui-react`): components, primitives, hooks, CLI, MCP server |
| `apps/docs` | Next.js 14 App Router docs site, static export (`output: "export"`), MDX pages, Tailwind 3 |
| `packages/tsconfig` | Shared tsconfigs (`base`, `react-library`, `nextjs`) |
| `examples/` | Standalone Vite / Next.js starters (own lockfiles, NOT in the pnpm workspace) |
| `registry.json`, `registry/` | GENERATED component registry (fetched by the CLI from GitHub `master`) |
| `docs/superpowers/` | Existing design specs, plans, and audit reports |

## Stack

React 18 (peer `>=18`), TypeScript 5 strict, Radix UI primitives for behavior, rough.js for sketch chrome, framer-motion, cmdk, embla-carousel, input-otp, react-resizable-panels. Build with tsup; tests with Vitest + jsdom + Testing Library; Storybook 8 + Chromatic; size-limit; Changesets.

## Commands

```bash
pnpm install
pnpm dev                                   # turbo: lib watch + docs (localhost:3000)
pnpm build | pnpm lint | pnpm typecheck | pnpm test
pnpm --filter doodleui-react build         # build:registry + tsup
pnpm --filter doodleui-react test          # vitest run
pnpm --filter doodleui-react test:coverage
pnpm --filter doodleui-react storybook     # localhost:6006
pnpm --filter doodleui-react size:check    # bundle budgets (CI gate)
pnpm --filter doodleui-react build:registry
pnpm --filter doodleui-react audit:contrast
pnpm --filter doodleui-react bench:render
pnpm --filter docs dev
pnpm changeset
```

## Top rules

1. **SSR-safe sketches.** Never call `Math.random()`/`randomSeed()` during render. Use `useResolvedSeed` (deterministic `DEFAULT_SEED = 0` first, random after mount) and `useIsomorphicLayoutEffect`, never plain `useLayoutEffect`.
2. **Behavior from Radix, chrome from `RoughSvg`.** Interactive components wrap a Radix primitive; the rough.js SVG layer is decorative and `aria-hidden`.
3. **Every component honors `SketchProps` + `animate`.** Extend `SketchProps`, resolve color via `useSketchTheme`, animation via `useAnimate` + `useDrawIn`.
4. **Library styling is inline styles + `--doodle-ui-*` CSS vars.** No Tailwind/clsx inside `packages/doodle-ui`. Tailwind is docs-only.
5. **Public API changes ripple.** Export from `src/index.ts`, update JSDoc, run `build:registry`, update docs MDX + `apps/docs/lib/props.ts`, and add a changeset.
6. **Stories and tests pin `seed={42}`** (and usually `animate={false}` in stories) to avoid visual-diff noise.
7. **Never hand-edit generated files**: `registry.json`, `registry/*.json`, `apps/docs/public/registry*`, `packages/doodle-ui/src/registry/data.ts`.
8. Conventional commits (`feat|fix|chore|docs|refactor|test`), max ~30 words.

## Definition of done (library changes)

`pnpm lint && pnpm typecheck && pnpm --filter doodleui-react test` pass, `size:check` passes after build, story/test added for new components, changeset committed, docs page updated, and `docs/brain/active-context.md` + `progress.md` updated.

## More

- Rules: `.cursor/rules/*.mdc`
- Brain: `docs/brain/{project-brief,architecture,decisions,active-context,progress,gotchas}.md`
- Contributor guide (authoritative for component conventions): `CONTRIBUTING.md`
- A11y audit: `A11Y-AUDIT.md`
