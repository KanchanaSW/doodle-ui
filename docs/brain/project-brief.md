# Project brief

## What
`doodleui-react` — an open-source (MIT) React component library with a hand-drawn, Excalidraw-like look. Real HTML/Radix handles behavior and accessibility; rough.js draws the sketchy borders, fills, and lines.

- Repo: https://github.com/KanchanaSW/doodle-ui (author KanchanaSW), created 2026-09-13
- npm: `doodleui-react` v0.8.0
- Docs: https://doodle-ui.netlify.app

## Users
- React developers (Next.js App Router, Vite) who want a sketch aesthetic for prototypes, landing pages, playful apps.
- AI coding agents via the MCP server (`npx doodleui-react mcp`) — tools: `list_components`, `get_component_docs`, `get_installation_command`, `get_theming_reference`, `search_components`, `get_conventions`.

## Distribution modes
1. npm package: `import { Button } from "doodleui-react"` + `import "doodleui-react/styles.css"`.
2. shadcn-style CLI: `npx doodleui-react init` / `add <component>` copies source + shared internals into the consumer project.
3. Copy-paste **Blocks** (page sections) from the docs site `/blocks` page.

## Goals (as evidenced in the repo)
- shadcn/ui-level component coverage (56 components; comparison page at `/docs/vs-shadcn`).
- SSR/hydration safety in Next.js.
- WCAG 2.1 AA contrast and Radix-grade a11y (`A11Y-AUDIT.md`).
- Small, tree-shakeable bundle (size-limit budgets in CI).
- Works under npm, pnpm, yarn classic/berry, and bun (CI matrix).

## Out of scope (decided)
- Vue/Svelte ports — No-Go as of 2026-09-18 (`docs/superpowers/specs/2026-09-18-framework-port-feasibility.md`).

## UNVERIFIED
- Monetization, target user volume, or roadmap beyond what's in commits/specs — none found in repo.
