# Contributing

Thanks for helping improve doodle-ui. This repo is a pnpm + Turborepo monorepo; the publishable package lives in `packages/doodle-ui` (`doodleui-react`).

## Setup

```bash
pnpm install
pnpm --filter doodleui-react build
pnpm dev
```

## Unit tests

Interactive / Radix-wrapped components are covered with Vitest + Testing Library. Prefer querying by role and label so tests double as accessibility checks.

```bash
# from repo root
pnpm test

# package-local
pnpm --filter doodleui-react test
pnpm --filter doodleui-react test:watch
pnpm --filter doodleui-react test:coverage
```

When testing animated components, include cases for `animate={false}` and `prefers-reduced-motion` (see `setPrefersReducedMotion` in `packages/doodle-ui/src/test/`).

## SSR & hydration safety

Sketch seeds and theme detection must be **deterministic on the server and on the client's first hydration render**. Randomization belongs in a post-mount `useEffect` only.

Rules for new code:

1. **Never** call `Math.random()` (or `randomSeed()`) during render / `useState` initializers that affect SSR markup. Use `DEFAULT_SEED` (`0`) for the first pass, then randomize in `useEffect` when the value is uncontrolled.
2. Prefer **`useIsomorphicLayoutEffect`** (`packages/doodle-ui/src/hooks/useIsomorphicLayoutEffect.ts`) instead of `useLayoutEffect`. Plain `useLayoutEffect` logs React warnings under Next.js SSR.
3. Avoid branching on `typeof window !== "undefined"` for values that paint into HTML/styles on the first render — that creates the same class of hydration bug. Detect DOM / media state after mount.
4. Explicit `seed={…}` and `<SketchSeedProvider initialSeed={…}>` stay locked; Shuffle (`useSketchSeed().shuffle`) is already post-mount and is unaffected.
5. Cover SSR with the Vitest suites in `packages/doodle-ui/src/__tests__/ssr.test.tsx` and `ssr-hydrate.test.tsx`. Optionally run `npx tsx scripts/verify-ssr-routers.ts` from `packages/doodle-ui`.

## Storybook & visual regression

Storybook stories live under `packages/doodle-ui/src/stories/`. **Always pin a fixed `seed` (e.g. `seed={42}`)** on sketch components used for Chromatic — rough.js wobble is otherwise a false-positive visual diff.

```bash
pnpm --filter doodleui-react storybook
pnpm --filter doodleui-react build-storybook
```

Chromatic runs on PRs via GitHub Actions when `CHROMATIC_PROJECT_TOKEN` is set in the repo secrets. First-time setup:

1. Create a Chromatic project linked to this GitHub repo
2. Add the project token as `CHROMATIC_PROJECT_TOKEN`
3. Approve the initial baseline in the Chromatic UI

## Bundle size

Size budgets are defined in `packages/doodle-ui/.size-limit.json`:

- Full ESM package
- `Button` only (tree-shake signal)
- Realistic set: `Button` + `Card` + `Input` + `Dialog`

```bash
pnpm --filter doodleui-react build
pnpm --filter doodleui-react size
pnpm --filter doodleui-react size:why
pnpm --filter doodleui-react size:check
```

`size:check` fails the CI job if budgets are exceeded or if a Button-only import is no longer smaller than the full package. rough.js is the dominant shared cost for sketch components; Radix / framer-motion stay externalized from the compiled bundle.

## CI expectations

Every PR should pass:

1. Lint & typecheck
2. Unit tests
3. Bundle size (`size:check`)
4. Chromatic visual review (when the project token is configured)

## Changesets & Versioning

We use [Changesets](https://github.com/changesets/changesets) for semantic versioning and automated changelog management.

Every PR that modifies `packages/doodle-ui` (new component, feature, bug fix, or style adjustment) must include a changeset file:

1. Run `pnpm changeset` from the repository root.
2. Select `doodleui-react`.
3. Select the appropriate semver bump:
   - **patch**: Bug fixes, styling tweaks, minor docs updates that do not alter public component APIs.
   - **minor**: New components, new props, new features, or non-breaking theme additions (e.g. Phase vN batches).
   - **major**: Breaking API changes (prop renames, removed components, breaking behavior changes).
4. Enter a clear, user-facing summary of the change (this entry is compiled into `CHANGELOG.md` upon release).
5. Commit the generated `.changeset/*.md` file with your pull request.

When changes are merged into `master`, an automated "Version Packages" PR is opened/updated. Once merged, GitHub Actions publishes the release to npm with cryptographic provenance.

## Commits

Use conventional commits (`feat`, `fix`, `chore`, `docs`, `test`, `refactor`). Keep messages short.
