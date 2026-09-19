# RadialMenu — Design

## Goal

Add a sketch-styled `RadialMenu` to `packages/doodle-ui`: a central `+` trigger that
rotates toward `×` on click and fans action items in a semicircle above the trigger.
Motion and chrome follow existing doodle-ui conventions (rough.js circles, framer-motion,
`SketchProps`, `useAnimate` / reduced-motion).

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Visual style | Sketch (rough.js ellipses), not the polished dark FAB reference |
| Arc layout | Semicircle above the trigger only |
| API | Single component + `items` data array |
| Close behavior | Trigger toggle only; selecting an item does **not** close |
| Implementation | Self-contained component (no Radix Popover shell) |

## Approach

Self-contained sketch FAB: one `RadialMenu` owns open state, trigger, item positioning,
and animation. Uses `RoughSvg` ellipses for chrome, HTML/SVG icons for content, and
framer-motion for fan-out + icon rotation (same dependency already used by Modal, Dialog,
Toast, Switch).

## API

```tsx
<RadialMenu
  items={[
    { id: "crop", icon: <Hash />, label: "Crop", onSelect: () => {} },
    { id: "text", icon: <Type />, label: "Text", onSelect: () => {} },
  ]}
  open={open}                 // optional controlled
  defaultOpen={false}         // uncontrolled default
  onOpenChange={(open) => {}}
  radius={88}                 // px from trigger center to item centers
  size="md"                   // "sm" | "md" | "lg"
  // + SketchProps: roughness, seed, sketchColor, bowing, fillStyle, strokeWidth, …
  // + animate?: boolean
/>
```

### Item shape

```ts
interface RadialMenuItem {
  id: string;
  icon: ReactNode;
  /** Accessible name; applied as aria-label on the item button. Required. */
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
}
```

### Behavior

- Closed: one sketch circle with a `+` icon.
- Trigger click: `+` rotates 45° (reads as `×`); items animate outward along a 180° arc
  above the trigger.
- Trigger click again: reverse animation; menu closes.
- Item click: calls `onSelect`; menu stays open.
- No Escape dismiss, no outside-click dismiss (v1).
- Controlled (`open` + `onOpenChange`) and uncontrolled (`defaultOpen`) both supported.
- `label` is required for a11y on each item.

## Layout, visuals & animation

### Geometry

- Items evenly spaced on a semicircle above the trigger.
- Arc spans approximately 180° with slight end padding so edge items are not perfectly
  horizontal (e.g. ~200° → −20° in standard polar math, or equivalent).
- Positions computed as offsets from the trigger center via `transform: translate(x, y)`.
- Closed state: items stacked at the trigger center with `scale(0)` and `opacity: 0`
  so open reads as expand-from-trigger.

### Visuals

- Trigger and items: rough.js ellipses via `RoughSvg` / existing circle patterns.
- Icons remain crisp HTML/SVG over sketch chrome (library convention).
- Colors from `useSketchTheme` (ink/paper); optional light fill so circles read on paper.
- Stable per-item wobble via `deriveSeed(resolvedSeed, item.id)`.

### Motion

- Trigger icon: rotate `0°` → `45°` when open (framer-motion).
- Items: staggered fan-out (~30–40ms between items), ~300–400ms ease-out or spring.
- `useAnimate` / `prefers-reduced-motion`: snap open/closed; skip stagger and rotation tween.

### Accessibility

- Trigger: `aria-expanded`, `aria-haspopup="menu"`, `aria-controls` → items container id.
- Items stay mounted for exit animation; when closed they are `aria-hidden` and not
  focusable (`tabIndex={-1}` / `inert` as appropriate). When open, container has
  `role="menu"`.
- Each item: `role="menuitem"`, `aria-label={label}`, honor `disabled`.
- Keyboard: trigger is a focusable `<button>`; items are focusable buttons when open.
  Arrow-key roving focus is out of scope for v1.

## Packaging & delivery

### Library

- `packages/doodle-ui/src/components/RadialMenu.tsx` — component + exported types
- Export from `packages/doodle-ui/src/index.ts`
- `packages/doodle-ui/src/stories/RadialMenu.stories.tsx`
- `packages/doodle-ui/src/components/__tests__/RadialMenu.test.tsx`
  - toggle open/close via trigger
  - `onSelect` does not close
  - a11y attributes present
  - reduced-motion path does not throw / snaps state
- CLI / registry entry so `doodleui-react add radial-menu` works (same pipeline as peers)

### Docs

- `apps/docs/app/docs/radial-menu/page.mdx`
- Playground branch in `ComponentPlayground.tsx`
- Props table entry in `lib/props.ts`
- Nav entry in `lib/nav.ts`

## Out of scope (v1)

- Full-circle or custom angle-range props
- Compound `RadialMenuTrigger` / `RadialMenuItem` API
- Escape / outside-click dismiss
- Nested radial menus
- Drag-to-select / pie-slice hit targeting
- Arrow-key roving focus (optional follow-up)

## Dependencies

No new packages. Reuse existing: `roughjs`, `framer-motion`, sketch hooks/primitives.

## Success criteria

- Matches sketch aesthetic of sibling components
- Semicircle fan + `+` rotation matches the approved interaction
- Items array API works in docs playground and Storybook
- Unit tests cover open/close, select-without-close, and basic a11y attrs
- Exported from the package and installable via CLI registry
