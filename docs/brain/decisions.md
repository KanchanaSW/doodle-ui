# Decisions log

Append new rows at the bottom. Dates are commit dates from `git log` unless noted.

| Date | Decision | Reason |
| --- | --- | --- |
| 2026-09-13 | Radix primitives for behavior; rough.js SVG as a decorative `aria-hidden` layer over real HTML | Get focus traps, keyboard nav, ARIA for free; keep sketch purely visual (CONTRIBUTING §2, §4) |
| 2026-09-13 | Library styles via inline styles + `--doodle-ui-*` CSS vars, not Tailwind | Zero styling-framework dependency for consumers; Tailwind only in docs |
| 2026-09-16 | shadcn-style copy-in CLI (`init`/`add`/`list`/`diff`) backed by a generated registry | Let users own and edit component source (commit "feat(cli): shadcn-style component installer" #1) |
| 2026-09-16 | Ship `styles.css` with CSS-var theming + dark overrides (v0.7.0) | Theme without JS props; `useSketchTheme`/`useSketchDefaults` read CSS vars |
| 2026-09-17 | Changesets + GitHub Actions release; npm provenance OFF, token publish | Token-based CI publish works today; OIDC trusted publishing deferred (release.yml comment) |
| 2026-09-18 | Node engine `>=22` (v0.7.1) | Commit "update Node.js version requirements and CI workflows to use Node 22". Exact motivation UNVERIFIED |
| 2026-09-18 | SSR-deterministic seeds: `DEFAULT_SEED = 0` first render, random only post-mount; `useIsomorphicLayoutEffect` everywhere (v0.7.2) | Eliminate hydration mismatches and Next.js `useLayoutEffect` warnings |
| 2026-09-18 | No-Go on Vue/Svelte ports | No demand signal; React/Radix coupling (docs/superpowers/specs/2026-09-18-framework-port-feasibility.md) |
| 2026-09-19 | Memoize rough.js generation, cache CSS palette reads, `React.memo` on hot components (RoughSvg, SketchBox, Button, Badge, Card, Table) | 1.35× faster mount, ~6× faster unrelated updates (docs/superpowers/reports/2026-09-18-rendering-performance-audit.md) |
| 2026-09-21 | Built-in MCP server over embedded registry/theming/conventions data (v0.8.0) | Let AI agents discover components offline; structured JSON errors with suggestions |
| 2026-10-24 | Docs "Blocks" gallery: one self-contained file per block under `apps/docs/components/blocks/` | Copy-paste page sections; source shown is read from the file at build time |
| 2026-10-25 | Added project brain (`AGENTS.md`, `.cursor/rules`, `docs/brain`) | Persistent AI context across sessions |
