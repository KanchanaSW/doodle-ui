# Rendering Performance Audit — 2026-09-18

Internal report for `doodleui-react` heavy-dashboard rendering cost
(rough.js path generation + React re-render waste).

## Scenario

Realistic dashboard (not a synthetic stress test):

- 50 table rows with `Badge` + outline `Button` per row
- Sketchy `Table` row rules
- Filter form: `Input`, 3× `Checkbox`, 2× `Radio`, `Switch`
- 3 summary `Card`s
- Fixed seeds, `animate={false}` for the CLI timing runs

Harness:

- Interactive page: [`apps/docs/app/benchmark/page.tsx`](../../../apps/docs/app/benchmark/page.tsx)
- CLI: `pnpm --filter doodleui-react bench:render`
  ([`packages/doodle-ui/scripts/benchmark.tsx`](../../../packages/doodle-ui/scripts/benchmark.tsx))

Environment: Vitest + jsdom, React Profiler `actualDuration`, 5 iterations averaged.

## Baseline (before)

| Metric | Avg |
| --- | --- |
| Mount | **88.96 ms** |
| Unrelated parent update (×5 bumps) | **20.08 ms** |
| rough.js generations on mount | **200** |
| rough.js generations on unrelated updates | **0** |

Findings before fixes:

1. Layout-effect deps already prevented re-painting when visual props were unchanged (0 paints on unrelated updates).
2. The expensive waste was **React re-render work**: every sketchy child re-ran hooks (`useSketchTheme` → multiple `getComputedStyle` calls, `useElementSize`, etc.) on unrelated parent updates.
3. `TableSketchContext` value was a new object every render.
4. No `React.memo` anywhere in the package.
5. `useDrawIn` left a `MutationObserver` attached for the lifetime of each animated node.
6. Undefined/random seeds still force an extra post-hydration path generation (by design); fixed seeds are required for stable memoization.

## Fixes applied

| Change | File(s) |
| --- | --- |
| Memoize rough.js generation via `rough.generator()` + `useMemo`; skip DOM apply when paint key unchanged; `React.memo(RoughSvg)` | `primitives/RoughSvg.tsx` |
| Cache CSS palette reads in `useSketchTheme` | `hooks/useSketchTheme.ts` |
| `React.memo` + stable `useMemo` context on Table / TableRule / cells | `components/Table.tsx` |
| `React.memo` on `SketchBox`, `Badge`, `Button`, `Card` | primitives + components |
| `will-change: stroke-dashoffset` during draw-in; disconnect MutationObserver after settle window | `animations/useDrawIn.ts` |

## After (same harness)

| Metric | Avg | vs baseline |
| --- | --- | --- |
| Mount | **65.70 ms** | **1.35× faster** |
| Unrelated parent update | **3.36 ms** | **~6.0× faster** |
| rough.js generations on mount | **200** | same |
| rough.js generations on unrelated updates | **0** | same |

## Animation notes

- Draw-in animates `stroke-dashoffset` only (no layout properties).
- `will-change: stroke-dashoffset` is set for the animation and cleared when finished.
- Observers disconnect after `max(duration + delay + 120, 520)` ms so large tables do not keep dozens of live MutationObservers.
- Staggered table rules (`TABLE_STAGGER_MS`) remain; for dense tables prefer `animate={false}` (see docs).

## Recommendations (product)

Documented for consumers in [`/docs/performance`](../../../apps/docs/app/docs/performance/page.mdx):

1. Prefer fixed / deterministic `seed` values in lists.
2. Use `animate={false}` (or provider-level) for large tables.
3. Lower `roughness` (e.g. `0.75–1`) for dense UIs.
4. Keep list row components memo-friendly (stable keys, avoid inline object sketch props that change identity every render — spreading a `useMemo`'d sketch object is fine).

## Reproduce

```bash
pnpm --filter doodleui-react bench:render
# JSON also written to packages/doodle-ui/.bench/latest.json

pnpm --filter docs dev
# open http://localhost:3000/benchmark
```
