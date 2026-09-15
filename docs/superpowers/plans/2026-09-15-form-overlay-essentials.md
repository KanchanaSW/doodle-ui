# Form & Overlay Essentials Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Label, Collapsible, Popover, Dropdown Menu, Dialog, Alert Dialog,
Command, Combobox to `doodleui-react`, with docs pages, then bump to 0.4.0.

**Architecture:** Each component is a self-contained file in
`packages/doodle-ui/src/components/`, following the existing "sketch context +
RoughSvg/SketchBox + Radix primitive" pattern (see `Select.tsx`, `Accordion.tsx`,
`Modal.tsx`). No shared abstraction is introduced — duplication across components
matches existing repo style.

**Tech Stack:** React 18, Radix UI primitives, roughjs, framer-motion, cmdk (new),
tsup, Next.js docs app (MDX + custom `Playground`/`PropsTable`).

## Global Constraints
- Every component: `animate?: boolean` (default `true` via `useAnimate`),
  `roughness?`, `seed?`, `sketchColor?`, `bowing?`, `fillStyle?`, `strokeWidth?`,
  `className`/`style` pass-through, full TS types.
- Bordered/panel components (Popover, DropdownMenu, Dialog, AlertDialog, Command)
  draw in their border on mount/open via `useDrawIn` (reuse `SketchBox`).
- No unit test framework exists in this repo (`tsc --noEmit` is the only check —
  see `packages/doodle-ui/package.json` `lint`/`typecheck` scripts). Verification
  per task = `pnpm --filter doodleui-react typecheck` passes, consistent with
  existing project practice.
- New deps go in `packages/doodle-ui/package.json` `dependencies` AND in
  `tsup.config.ts` `external`.
- Docs: `apps/docs/lib/nav.ts` (`COMPONENT_PAGES`), `apps/docs/lib/props.ts`
  (`PropRow[]`), `apps/docs/components/ComponentPlayground.tsx` (switch branch +
  `*Playground` fn), `apps/docs/app/docs/<slug>/page.mdx`.
- Commit per component (conventional commits): `feat(label): ...`,
  `feat(collapsible): ...`, etc.

---

### Task 1: Label
**Files:** Create `packages/doodle-ui/src/components/Label.tsx`; modify
`packages/doodle-ui/package.json` (add `@radix-ui/react-label`), `tsup.config.ts`
(external already covers `/^@radix-ui\//`), `src/index.ts` (export `Label`,
`LabelProps`).
- [ ] Add `@radix-ui/react-label` to dependencies; `pnpm install`.
- [ ] Write `Label.tsx`: wraps `LabelPrimitive.Root`, props `htmlFor`, `children`,
  `required?: boolean`, `sketchColor`, `roughness`, `seed`, `bowing`, `strokeWidth`,
  `className`, `style`. When `required`, render a small RoughSvg dot/asterisk mark
  next to the text using `SKETCH_COLORS.accent`.
- [ ] Export from `src/index.ts`.
- [ ] `pnpm --filter doodleui-react typecheck` passes.
- [ ] Commit: `feat(label): add Label component`.

### Task 2: Collapsible
**Files:** Create `packages/doodle-ui/src/components/Collapsible.tsx`; modify
`package.json` (`@radix-ui/react-collapsible`), `src/index.ts`.
- [ ] Add dep, install.
- [ ] Write `Collapsible.tsx`: `Collapsible` (Root + sketch context),
  `CollapsibleTrigger` (row with rotating RoughSvg chevron, same path/rotation
  logic as `AccordionTrigger`), `CollapsibleContent`.
- [ ] Export, typecheck, commit `feat(collapsible): add Collapsible component`.

### Task 3: Popover
**Files:** Create `Popover.tsx`; modify `package.json`
(`@radix-ui/react-popover`), `src/index.ts`.
- [ ] Add dep, install.
- [ ] Write `Popover.tsx`: `Popover` (Root + sketch context), `PopoverTrigger`,
  `PopoverAnchor`, `PopoverContent` (Portal → `SketchBox`, `position="popper"`
  same recipe as `SelectContent`, `useDrawIn` via `SketchBox`'s own `animate` prop).
- [ ] Export, typecheck, commit `feat(popover): add Popover component`.

### Task 4: Dropdown Menu
**Files:** Create `DropdownMenu.tsx`; modify `package.json`
(`@radix-ui/react-dropdown-menu`), `src/index.ts`.
- [ ] Add dep, install.
- [ ] Write `DropdownMenu.tsx`: `DropdownMenu`, `DropdownMenuTrigger`,
  `DropdownMenuContent` (SketchBox), `DropdownMenuItem` (hover underline mark like
  `SelectItem`), `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`/
  `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`
  (RoughSvg line, not `<hr>`).
- [ ] Export, typecheck, commit `feat(dropdown-menu): add DropdownMenu component`.

### Task 5: Dialog
**Files:** Create `Dialog.tsx`; modify `src/index.ts` (Modal already provides the
`@radix-ui/react-dialog` dep).
- [ ] Write `Dialog.tsx`: `Dialog` (Root), `DialogTrigger`, `DialogPortal`,
  `DialogOverlay`, `DialogContent` (framer-motion fade/scale like `Modal`, wraps
  `SketchBox` with no forced width/shadow), `DialogHeader`, `DialogFooter` (flex
  slots), `DialogTitle`, `DialogDescription`, `DialogClose`.
- [ ] Export, typecheck, commit `feat(dialog): add composable Dialog component`.

### Task 6: Alert Dialog
**Files:** Create `AlertDialog.tsx`; modify `package.json`
(`@radix-ui/react-alert-dialog`), `src/index.ts`.
- [ ] Add dep, install.
- [ ] Write `AlertDialog.tsx`: same shape as Dialog plus `AlertDialogAction`
  (`Button variant="primary"`, accent) and `AlertDialogCancel`
  (`Button variant="outline"`).
- [ ] Export, typecheck, commit `feat(alert-dialog): add AlertDialog component`.

### Task 7: Command
**Files:** Create `Command.tsx`; modify `package.json` (`cmdk`), `tsup.config.ts`
(add `cmdk` to `external`), `src/index.ts`.
- [ ] Add `cmdk` dep, install.
- [ ] Write `Command.tsx`: `Command` (SketchBox wrapping `cmdk`'s `Command`),
  `CommandInput` (borderless input + RoughSvg divider below), `CommandList`,
  `CommandEmpty`, `CommandGroup`, `CommandItem` (selected/hover underline mark),
  `CommandSeparator`, `CommandShortcut`.
- [ ] Export, typecheck, commit `feat(command): add Command component`.

### Task 8: Combobox
**Files:** Create `Combobox.tsx`; modify `src/index.ts`.
- [ ] Write `Combobox.tsx`: ready-made component composing `Popover` +
  `Command` + a `SelectTrigger`-styled button. Props: `options: SelectOption[]`,
  `value`/`onValueChange`, `placeholder`, `searchPlaceholder`, `emptyMessage`,
  full `SketchProps` + `animate`.
- [ ] Export, typecheck, commit `feat(combobox): add Combobox component`.

### Task 9: Package metadata
**Files:** `packages/doodle-ui/package.json`, `CHANGELOG.md`, `README.md` (package
and root).
- [ ] Bump version `0.3.0` → `0.4.0`.
- [ ] Add `## 0.4.0` CHANGELOG entry summarizing the 8 new components.
- [ ] Update component lists in both READMEs.
- [ ] `pnpm --filter doodleui-react build` succeeds.
- [ ] Commit `chore(doodle-ui): bump to 0.4.0, update changelog and readme`.

### Task 10: Docs pages (one sub-task per component)
**Files per component:** `apps/docs/lib/nav.ts`, `apps/docs/lib/props.ts`,
`apps/docs/components/ComponentPlayground.tsx`, `apps/docs/app/docs/<slug>/page.mdx`.
- [ ] Append entries to `COMPONENT_PAGES` for all 8 slugs.
- [ ] Add a `PropRow[]` export per component to `props.ts`.
- [ ] Add a `*Playground` function + switch branch per component to
  `ComponentPlayground.tsx`.
- [ ] Add `page.mdx` per component (Usage snippet + `<ComponentPlayground>` +
  `<PropsTable>`).
- [ ] `pnpm --filter docs typecheck` / `pnpm --filter docs build` succeeds.
- [ ] Commit `docs: add docs pages for form & overlay essentials`.

### Task 11: Rebuild static export
**Files:** `apps/docs/out/**` (generated).
- [ ] Run the docs app's static export build.
- [ ] Commit `chore(docs): rebuild static export`.

## Self-Review Notes
- Spec coverage: all 8 components + docs + package updates are covered above.
- No placeholders: each task names exact files and exact sub-parts to implement.
- No test framework exists in this repo; typecheck/build stand in for tests,
  matching existing project conventions.
