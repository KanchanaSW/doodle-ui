# Form & Overlay Essentials (doodleui-react v4) — Design

## Goal
Add 8 missing components — Label, Collapsible, Popover, Dropdown Menu, Dialog, Alert
Dialog, Command, Combobox — to `packages/doodle-ui`, following existing conventions
(RoughSvg / SketchBox for chrome, Radix primitives for logic, `animate`/`roughness`/
`seed`/`sketchColor` on every component), plus docs pages and a version bump.

## Conventions confirmed from existing code
- Shared sketch props (`SketchProps`): `roughness`, `seed`, `sketchColor`, `bowing`,
  `fillStyle`, `strokeWidth`. Plus `animate?: boolean` (resolved via `useAnimate`,
  which reads `DoodleUIProvider` and `prefers-reduced-motion`).
- `useDrawIn(ref, duration, enabled, replayKey?)` sketches in the rough.js outline
  stroke on mount / key change. `DRAW_IN_DURATION_MS` (400) is the default panel
  duration; smaller constants exist for transient UI (`DRAW_IN_TOOLTIP_MS` 180,
  `DRAW_IN_ALERT_MS` 200, `DRAW_IN_MARK_MS` 240).
- `SketchBox` = bordered panel primitive (RoughSvg rectangle + optional shadow +
  content slot), already used by Modal and Select's popover content. Reuse it for
  every new bordered panel (Popover, DropdownMenu, Dialog, AlertDialog, Command).
- `RoughSvg` = raw shape/line/path primitive for chevrons, separators, item-highlight
  underlines (see Accordion's chevron, Select's item underline).
- `useResolvedSeed` / `deriveSeed(base, key)` — per-item/per-state stable wobble
  variation (hover, focus, per-list-item).
- Component internal "sketch context" pattern (React context holding resolved sketch
  props + ink color, e.g. `SelectSketchContext`, `AccordionSketchContext`) so
  compound sub-parts (`Trigger`, `Content`, `Item`, ...) share one resolved seed/ink
  without prop drilling. New compound components (Popover, DropdownMenu, Dialog,
  AlertDialog, Command) follow the same pattern.
- Text stays real HTML (`doodleUiFontFamily` / `doodleUiFontWeight` CSS vars) — only
  borders/lines/marks are rough.js SVG.
- Package exports are flat named exports added to `src/index.ts`; docs add one
  `page.mdx` + a `*Playground` branch in `ComponentPlayground.tsx` + a `PropRow[]`
  array in `lib/props.ts` + an entry in `lib/nav.ts`.

## Component decisions
1. **Label** — thin wrapper around `@radix-ui/react-label`. Minimal chrome: styled
   text (ink color, font vars) plus an optional small hand-drawn dot/asterisk mark
   (RoughSvg) when `required`. No border.
2. **Collapsible** — `@radix-ui/react-collapsible`. Single trigger row (chevron via
   RoughSvg, rotates open/closed like Accordion's) + content region. No box border,
   no divider (single section, unlike Accordion's multi-item dividers).
3. **Popover** — `@radix-ui/react-popover`. `Popover` (Root), `PopoverTrigger`,
   `PopoverContent` (Portal + `SketchBox`, border draw-in on open, same recipe as
   `SelectContent`), `PopoverAnchor` passthrough.
4. **Dropdown Menu** — `@radix-ui/react-dropdown-menu`. `DropdownMenu`, `Trigger`,
   `Content` (SketchBox), `Item` (hover underline mark like `SelectItem`),
   `CheckboxItem`, `RadioGroup`/`RadioItem`, `Label`, `Separator` (RoughSvg line, not
   a plain `<hr>`).
5. **Dialog** — distinct from `Modal` (Modal = fixed-width, always-shadowed,
   single-prop API with forced Close button). Dialog is the shadcn-style composable
   set built on `@radix-ui/react-dialog`: `Dialog`, `DialogTrigger`, `DialogContent`
   (SketchBox, no forced width/shadow — caller sizes via `style`/`className`),
   `DialogHeader`, `DialogFooter` (plain flex slots), `DialogTitle`,
   `DialogDescription`, `DialogClose`. Framer-motion overlay/panel transitions match
   Modal's approach.
6. **Alert Dialog** — `@radix-ui/react-alert-dialog`. Same shape as Dialog
   (`AlertDialog`, `Trigger`, `Content`, `Header`, `Footer`, `Title`, `Description`)
   plus `AlertDialogAction` (accent-filled `Button`) and `AlertDialogCancel`
   (outline `Button`) for the confirm/destructive pattern.
7. **Command** — built on `cmdk` (new dependency), skinned like the other panels:
   `Command` (SketchBox wrapping `cmdk`'s `Command`), `CommandInput` (borderless,
   sits above a RoughSvg divider line), `CommandList`, `CommandEmpty`,
   `CommandGroup`, `CommandItem` (hover/selected underline mark), `CommandSeparator`,
   `CommandShortcut`.
8. **Combobox** — a single ready-made component (parallel to `Select`'s API):
   `options`, `value`/`onValueChange`, `placeholder`, `searchPlaceholder`,
   `emptyMessage`. Internally composes `Popover` (trigger = sketchy button styled
   like `SelectTrigger`) + `Command` for the searchable list. No separate Radix
   primitive exists for this pattern (matches shadcn's own approach).

## Dependencies added to `packages/doodle-ui/package.json`
`@radix-ui/react-popover`, `@radix-ui/react-dropdown-menu`,
`@radix-ui/react-collapsible`, `@radix-ui/react-alert-dialog`,
`@radix-ui/react-label`, `cmdk`. All added to `external` in `tsup.config.ts`
alongside the existing Radix externals (`cmdk` too, so it isn't bundled).

## Docs
One `apps/docs/app/docs/<slug>/page.mdx` per component (Usage + `ComponentPlayground`
+ `PropsTable`), one `*Playground` function per component in `ComponentPlayground.tsx`,
one `PropRow[]` per component in `lib/props.ts`, one entry per component appended to
`COMPONENT_PAGES` in `lib/nav.ts`. After all pages exist, rebuild `apps/docs/out`
via the docs app's static export build.

## Package/version
Bump `packages/doodle-ui/package.json` version `0.3.0` → `0.4.0`. Add a `## 0.4.0`
entry to `CHANGELOG.md`. Update `packages/doodle-ui/README.md` and the root
`README.md` component list. Build (`pnpm --filter doodle-ui build`) to verify types.
Actual `npm publish` is left to the user (out of scope for this session).

## Build order (per user spec)
Label → Collapsible → Popover → Dropdown Menu → Dialog → Alert Dialog → Command →
Combobox. One git commit per component (conventional commits), then a final commit
for docs-index/package/version/CHANGELOG/README and one for the docs static rebuild.

## Out of scope
- Actually running `npm publish`.
- Nested/sub dropdown menus (`DropdownMenuSub`).
- Multi-select combobox.
