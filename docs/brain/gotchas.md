# Gotchas

## Never do this
- **Never** call `Math.random()` / `randomSeed()` in render or `useState` initializers. Use `useResolvedSeed`. Breaks hydration.
- **Never** use plain `useLayoutEffect` — use `useIsomorphicLayoutEffect` (Next.js SSR warnings).
- **Never** branch on `typeof window` for values that paint on first render; detect after mount (`useSketchTheme` returns light on first render by design).
- **Never** hand-edit `registry.json`, `registry/*.json`, `apps/docs/public/registry*`, or `src/registry/data.ts` — run `pnpm --filter doodleui-react build:registry`.
- **Never** put meaningful content inside `RoughSvg`; it's `aria-hidden` and `pointer-events: none`.
- **Never** add Tailwind classes inside `packages/doodle-ui` components — consumers may not have Tailwind.
- **Never** let React render children into the RoughSvg container — it's painted imperatively and React would wipe it (or vice versa).

## Pitfalls
- **Unpinned seeds in stories/tests** cause Chromatic false positives. Always `seed={42}`.
- **CLI reads the registry from GitHub `master`** (`raw.githubusercontent.com/.../master/registry.json`), falling back silently to the bundled copy on any error. A stale committed `registry.json` on master means CLI users get stale source; a network failure hides itself. Override with `DOODLEUI_REGISTRY_URL`.
- **CLI import rewriting is regex-based** (`cli/transformer.ts`): only `from "../x"` and `from "./PascalCase"` are rewritten. Other import shapes in components (e.g. `../../x`, `./lowercase`) will break `doodleui-react add`.
- **New shared internals** must be added to `SHARED_FILES` in `scripts/build-registry.ts` or the CLI won't copy them. Currently missing despite being imported: `hooks/useSketchDefaults.ts` (31 files incl. `RoughSvg`), `primitives/size.ts` (16), `primitives/interactive.ts` (11), `primitives/validation.tsx` (6), `primitives/icon.tsx` (5). Committed `registry.json` `sharedFiles` confirms they're absent. Likely breaks `doodleui-react add` output — not reproduced end-to-end (UNVERIFIED).
- **`"use client"` is prepended post-build** by tsup `onSuccess`; source files also carry it. Don't rely on it surviving if the build pipeline changes.
- **jsdom gaps**: SVG `getBBox`/`getTotalLength`, `Element.animate`, pointer capture, ResizeObserver are stubbed in `vitest.setup.ts`; `getBoundingClientRect` always returns 120×40. Layout-dependent assertions are meaningless in unit tests.
- **Palette cache**: `useSketchTheme` caches `getComputedStyle` reads keyed on `<html>` class/`data-theme`/`data-component-theme`. If you change CSS vars at runtime without changing those attributes, call `clearSketchThemePaletteCache()`.
- **`animate` cannot override reduced motion**; only provider `forceAnimate` can. `animate={false}` always wins.
- **Docs is a static export**: no API routes, middleware, or `next/image` optimization (`images.unoptimized`). Redirects go in `netlify.toml`.
- **Docs theme flash prevention** relies on the inline bootstrap script in `app/layout.tsx` + `suppressHydrationWarning` on `<html>`; keep localStorage keys in sync with `lib/component-theme.ts`.
- **Blocks**: adding a block requires entries in BOTH `lib/blocks.ts` (`BLOCK_CATEGORIES`, with `file` path relative to `apps/docs`) and `components/blocks/index.ts` (`BLOCK_COMPONENTS`). `app/blocks/page.tsx` reads `file` with `fs` at build time — a wrong path fails the build. New `BlockLayout` values also need a `LayoutThumb` case in `BlockGallery.tsx`.
- **Carousel arrows** are `position: absolute` about 52px outside the track (`ARROW_OFFSET` in `Carousel.tsx`). A block that doesn't pad the carousel (about `px-14`, and `py-16` when `orientation="vertical"`) gets its arrows clipped by `BlockPreview`'s `overflow-hidden`.
- **Vertical carousel has no viewport-height prop.** `CarouselContent` leaves the Embla viewport at `overflow: hidden` with auto height, so every slide stacks in view and the arrows stay disabled. The changelog block pins `h-72` through the bordered sketch frame, its content wrapper, the viewport, and the track (`[&>div:first-child>div:nth-child(2)>div]`). `CarouselItem`'s inline `flex: 0 0 100%` beats a plain Tailwind `basis-*`; use the `!` important modifier (`!basis-full md:!basis-1/2`) when showing more than one slide.
- **`examples/*` aren't in the workspace**; they install `doodleui-react` independently.
- **Size budget**: roughjs is bundled (not external). Adding a heavy dependency that isn't externalized will trip `size:check`.

## UNVERIFIED
- `apps/docs/out`, `.pnpm-store/`, `.superpowers/` exist on disk and are not matched by `.gitignore`, yet git reports no untracked files in this environment — confirm they're ignored (e.g. global gitignore).
