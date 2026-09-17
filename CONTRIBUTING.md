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

## Commits

Use conventional commits (`feat`, `fix`, `chore`, `docs`, `test`, `refactor`). Keep messages short.
