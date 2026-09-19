# RadialMenu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a sketch-styled `RadialMenu` — central `+` trigger rotates toward `×`, items fan in a semicircle above — with tests, Storybook, docs, and CLI registry entry.

**Architecture:** One self-contained component in `packages/doodle-ui/src/components/RadialMenu.tsx`. Open state is controlled or uncontrolled. Items come from an `items` array. Rough.js ellipses for chrome; framer-motion for fan-out and icon rotation. No Radix menu shell. Selecting an item does not close the menu.

**Tech Stack:** React 18, roughjs (`RoughSvg`), framer-motion, vitest + Testing Library, Next.js docs MDX, existing sketch hooks (`useResolvedSeed`, `useSketchTheme`, `useAnimate`, `deriveSeed`).

**Spec:** `docs/superpowers/specs/2026-09-19-radial-menu-design.md`

## Global Constraints

- Sketch style only (rough.js ellipses); not the polished dark FAB reference.
- Semicircle above the trigger only (no full-circle prop in v1).
- API is a single component + `items` array (no compound parts in v1).
- Close via trigger toggle only — item `onSelect` must not close; no Escape / outside-click dismiss.
- Every component: `animate?: boolean` via `useAnimate`, full `SketchProps`, `className`/`style` pass-through.
- Honor `prefers-reduced-motion` (snap; no stagger / rotation tween).
- Conventional commits; keep commit messages ≤ 30 words.
- No new npm dependencies.

---

## File map

| Path | Role |
| --- | --- |
| `packages/doodle-ui/src/components/RadialMenu.tsx` | Component + types |
| `packages/doodle-ui/src/components/__tests__/RadialMenu.test.tsx` | Unit tests |
| `packages/doodle-ui/src/stories/RadialMenu.stories.tsx` | Storybook |
| `packages/doodle-ui/src/index.ts` | Public exports |
| `apps/docs/app/docs/radial-menu/page.mdx` | Docs page |
| `apps/docs/lib/nav.ts` | Nav entry |
| `apps/docs/lib/props.ts` | Props table rows |
| `apps/docs/components/ComponentPlayground.tsx` | Live playground |
| `packages/doodle-ui/src/registry/data.ts` | Regenerated via `pnpm --filter doodleui-react build:registry` |

---

### Task 1: Failing tests for RadialMenu

**Files:**
- Create: `packages/doodle-ui/src/components/__tests__/RadialMenu.test.tsx`
- (Import target does not exist yet — that is intentional.)

**Interfaces:**
- Consumes: nothing yet
- Produces: test contract for `RadialMenu`, `RadialMenuProps`, `RadialMenuItem`

- [ ] **Step 1: Write the failing test file**

```tsx
import { afterEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadialMenu } from "../RadialMenu";
import {
  renderWithProviders,
  setPrefersReducedMotion,
} from "../../test/test-utils";
import { resetPrefersReducedMotion } from "../../test/match-media";

const sampleItems = [
  { id: "a", icon: <span>A</span>, label: "Alpha", onSelect: vi.fn() },
  { id: "b", icon: <span>B</span>, label: "Beta", onSelect: vi.fn() },
  { id: "c", icon: <span>C</span>, label: "Gamma", onSelect: vi.fn() },
];

describe("RadialMenu", () => {
  afterEach(() => {
    resetPrefersReducedMotion();
    setPrefersReducedMotion(false);
    sampleItems.forEach((item) => item.onSelect.mockClear());
  });

  it("toggles open/close via the trigger and sets aria-expanded", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <RadialMenu
        seed={42}
        items={sampleItems}
        onOpenChange={onOpenChange}
        aria-label="Actions"
      />,
    );

    const trigger = screen.getByRole("button", { name: "Actions" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");

    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const menu = screen.getByRole("menu");
    expect(within(menu).getByRole("menuitem", { name: "Alpha" })).toBeInTheDocument();

    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onSelect without closing the menu", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <RadialMenu
        seed={42}
        defaultOpen
        items={sampleItems}
        onOpenChange={onOpenChange}
        aria-label="Actions"
      />,
    );

    await user.click(screen.getByRole("menuitem", { name: "Beta" }));
    expect(sampleItems[1].onSelect).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("supports controlled open", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = renderWithProviders(
      <RadialMenu
        seed={42}
        open={false}
        onOpenChange={onOpenChange}
        items={sampleItems}
        aria-label="Actions"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    rerender(
      <RadialMenu
        seed={42}
        open
        onOpenChange={onOpenChange}
        items={sampleItems}
        aria-label="Actions"
      />,
    );
    expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("still toggles when reduced motion is preferred", async () => {
    setPrefersReducedMotion(true);
    const user = userEvent.setup();
    renderWithProviders(
      <RadialMenu seed={42} items={sampleItems} aria-label="Actions" />,
      { animate: true },
    );

    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "Alpha" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL (module not found)**

```bash
pnpm --filter doodleui-react exec vitest run src/components/__tests__/RadialMenu.test.tsx
```

Expected: FAIL resolving `../RadialMenu` (or similar).

- [ ] **Step 3: Commit the failing tests**

```bash
git add packages/doodle-ui/src/components/__tests__/RadialMenu.test.tsx
git commit -m "$(cat <<'EOF'
test: add failing RadialMenu behavior tests

EOF
)"
```

---

### Task 2: Implement RadialMenu

**Files:**
- Create: `packages/doodle-ui/src/components/RadialMenu.tsx`
- Test: `packages/doodle-ui/src/components/__tests__/RadialMenu.test.tsx`

**Interfaces:**
- Consumes: `RoughSvg`, `useAnimate`, `useDrawIn`, `useResolvedSeed`, `useSketchTheme`, `useBaseRoughness`, `deriveSeed`, `cn`, `SketchProps`, framer-motion
- Produces:

```ts
export type RadialMenuSize = "sm" | "md" | "lg";

export interface RadialMenuItem {
  id: string;
  icon: ReactNode;
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface RadialMenuProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "color" | "onSelect">,
    SketchProps {
  items: RadialMenuItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  radius?: number;
  size?: RadialMenuSize;
  animate?: boolean;
  /** Accessible name for the trigger button. @default "Open menu" */
  "aria-label"?: string;
}

export function RadialMenu(props: RadialMenuProps): JSX.Element;
```

- [ ] **Step 1: Create `RadialMenu.tsx` with the following implementation**

Size tokens (trigger diameter / item diameter / default radius):

```ts
const SIZE_PX: Record<RadialMenuSize, { trigger: number; item: number; radius: number }> = {
  sm: { trigger: 40, item: 32, radius: 72 },
  md: { trigger: 52, item: 40, radius: 88 },
  lg: { trigger: 64, item: 48, radius: 108 },
};
```

Polar layout helper (semicircle above; slight padding so edges aren’t flat):

```ts
/** Degrees: 0 = right, 90 = up. Arc from ~200° to ~-20° (above). */
function itemOffset(
  index: number,
  count: number,
  radius: number,
): { x: number; y: number } {
  if (count <= 0) return { x: 0, y: 0 };
  const startDeg = 200;
  const endDeg = -20;
  const t = count === 1 ? 0.5 : index / (count - 1);
  const deg = startDeg + (endDeg - startDeg) * t;
  const rad = (deg * Math.PI) / 180;
  return { x: Math.cos(rad) * radius, y: -Math.sin(rad) * radius };
}
```

Component structure (implement fully in the file):

1. Resolve `open` from controlled `open` prop or internal `defaultOpen` state.
2. `menuId = useId()`; trigger `aria-controls={menuId}`.
3. Root: relatively positioned box large enough for trigger + radius + item radius (padding so items aren’t clipped). Center the trigger.
4. Trigger `<button type="button">`:
   - `aria-expanded={isOpen}`, `aria-haspopup="menu"`, `aria-controls={menuId}`, `aria-label` from props (default `"Open menu"`).
   - Absolute `RoughSvg shape="ellipse"` fill with light paper wash (`theme.paper` or ink at low opacity).
   - Inner `motion.span` with a Plus SVG (`viewBox="0 0 24 24"`, two rects or path), animate `rotate: isOpen ? 45 : 0`, transition spring when `shouldAnimate` else `{ duration: 0 }`.
   - `onClick` → toggle; call `onOpenChange`.
   - `useDrawIn` on the trigger sketch wrapper.
5. Items layer (`id={menuId}`, `role="menu"`, `aria-hidden={!isOpen}`):
   - Map `items`; each item button absolutely centered on the trigger, then `motion` animate to `{ x, y, scale: 1, opacity: 1 }` when open else `{ x: 0, y: 0, scale: 0, opacity: 0 }`.
   - Stagger: `transition={{ delay: shouldAnimate && isOpen ? index * 0.035 : 0, duration: shouldAnimate ? 0.32 : 0, ease: "easeOut" }}`.
   - Each: `role="menuitem"`, `aria-label={item.label}`, `tabIndex={isOpen && !item.disabled ? 0 : -1}`, `disabled={item.disabled}`, `onClick={() => item.onSelect?.()}` — **do not** call close.
   - Per-item `RoughSvg` ellipse with `seed={deriveSeed(resolvedSeed, item.id)}`.
6. Pass through `SketchProps` and root `className`/`style` like `RadialProgress` / `Switch`.

Use `"use client";` at top. Prefer `forwardRef` on the root `div` if other single-root components do; otherwise a plain function export matching `RadialProgress` is fine.

Reference patterns:
- Ellipse button chrome: `Pagination.tsx` `PageButton`
- framer-motion + `shouldAnimate`: `Switch.tsx`
- Controlled/uncontrolled open: `Collapsible` / design spec

- [ ] **Step 2: Run tests — expect PASS**

```bash
pnpm --filter doodleui-react exec vitest run src/components/__tests__/RadialMenu.test.tsx
```

Expected: all 4 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add packages/doodle-ui/src/components/RadialMenu.tsx \
  packages/doodle-ui/src/components/__tests__/RadialMenu.test.tsx
git commit -m "$(cat <<'EOF'
feat: add RadialMenu with sketch fan animation

EOF
)"
```

---

### Task 3: Package export + Storybook

**Files:**
- Modify: `packages/doodle-ui/src/index.ts` (add export next to `RadialProgress`)
- Create: `packages/doodle-ui/src/stories/RadialMenu.stories.tsx`

**Interfaces:**
- Consumes: `RadialMenu`, `RadialMenuProps` from Task 2
- Produces: public package exports + Storybook story

- [ ] **Step 1: Export from `index.ts`**

Insert after the `RadialProgress` export block:

```ts
export {
  RadialMenu,
  type RadialMenuProps,
  type RadialMenuItem,
  type RadialMenuSize,
} from "./components/RadialMenu";
```

- [ ] **Step 2: Add Storybook story**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { RadialMenu } from "../components/RadialMenu";

const meta: Meta<typeof RadialMenu> = {
  title: "Components/RadialMenu",
  component: RadialMenu,
};

export default meta;
type Story = StoryObj<typeof RadialMenu>;

const icons = {
  hash: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M5 9h14M5 15h14M9 5v14M15 5v14" />
    </svg>
  ),
  text: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M6 5h12M12 5v14" />
    </svg>
  ),
  square: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="6" y="6" width="12" height="12" />
    </svg>
  ),
  pen: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    </svg>
  ),
  star: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.3 6.2 21l1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
    </svg>
  ),
};

export const Default: Story = {
  render: () => (
    <div style={{ minHeight: 280, display: "grid", placeItems: "center" }}>
      <RadialMenu
        seed={42}
        aria-label="Tools"
        items={[
          { id: "crop", icon: icons.hash, label: "Crop" },
          { id: "text", icon: icons.text, label: "Text" },
          { id: "shape", icon: icons.square, label: "Shape" },
          { id: "draw", icon: icons.pen, label: "Draw" },
          { id: "star", icon: icons.star, label: "Favorite" },
        ]}
      />
    </div>
  ),
};

export const Open: Story = {
  render: () => (
    <div style={{ minHeight: 280, display: "grid", placeItems: "center" }}>
      <RadialMenu
        seed={42}
        defaultOpen
        aria-label="Tools"
        items={[
          { id: "crop", icon: icons.hash, label: "Crop" },
          { id: "text", icon: icons.text, label: "Text" },
          { id: "shape", icon: icons.square, label: "Shape" },
          { id: "draw", icon: icons.pen, label: "Draw" },
          { id: "star", icon: icons.star, label: "Favorite" },
        ]}
      />
    </div>
  ),
};
```

- [ ] **Step 3: Typecheck**

```bash
pnpm --filter doodleui-react typecheck
```

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add packages/doodle-ui/src/index.ts \
  packages/doodle-ui/src/stories/RadialMenu.stories.tsx
git commit -m "$(cat <<'EOF'
feat: export RadialMenu and add Storybook story

EOF
)"
```

---

### Task 4: Docs site (nav, props, playground, MDX)

**Files:**
- Modify: `apps/docs/lib/nav.ts` — insert alphabetically after `radial-progress`
- Modify: `apps/docs/lib/props.ts` — add `radialMenuProps`
- Modify: `apps/docs/components/ComponentPlayground.tsx` — import, switch case, playground fn
- Create: `apps/docs/app/docs/radial-menu/page.mdx`

**Interfaces:**
- Consumes: exported `RadialMenu` from `doodleui-react` (docs already imports package components)
- Produces: `/docs/radial-menu` page with playground + props table

- [ ] **Step 1: Nav entry**

In `COMPONENT_PAGES`, after the `radial-progress` row:

```ts
{ slug: "radial-menu", title: "Radial Menu", blurb: "Plus trigger fans sketch actions in an arc" },
```

- [ ] **Step 2: Props rows in `props.ts`**

```ts
export const radialMenuProps: PropRow[] = [
  {
    name: "items",
    type: "RadialMenuItem[]",
    defaultValue: "—",
    description: "Actions with id, icon, label, optional onSelect / disabled.",
  },
  {
    name: "open / defaultOpen / onOpenChange",
    type: "boolean / (open) => void",
    defaultValue: "uncontrolled false",
    description: "Controlled or uncontrolled open state. Toggle via trigger only.",
  },
  {
    name: "radius",
    type: "number",
    defaultValue: "size preset",
    description: "Distance in px from trigger center to item centers.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    description: "Trigger and item diameter preset.",
  },
  {
    name: "aria-label",
    type: "string",
    defaultValue: '"Open menu"',
    description: "Accessible name for the central trigger button.",
  },
  {
    name: "animate / SketchProps",
    type: "boolean / SketchProps",
    defaultValue: "provider / theme",
    description: "Draw-in, roughness, seed, sketchColor, and related sketch props.",
  },
];
```

- [ ] **Step 3: Playground**

1. Import `RadialMenu` alongside `RadialProgress`.
2. In the `switch (name)` add:

```ts
case "radial-menu":
  return <RadialMenuPlayground />;
```

3. Add function (icons can be simple text/SVG like the story):

```tsx
function RadialMenuPlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    {
      type: "select",
      key: "size",
      label: "Size",
      options: ["sm", "md", "lg"],
      defaultValue: "md",
    },
    {
      type: "slider",
      key: "radius",
      label: "Radius",
      min: 56,
      max: 140,
      step: 4,
      defaultValue: 88,
    },
  ]);
  const demoItems = [
    { id: "a", icon: <span style={{ fontSize: 14 }}>#</span>, label: "Crop" },
    { id: "b", icon: <span style={{ fontSize: 14 }}>T</span>, label: "Text" },
    { id: "c", icon: <span style={{ fontSize: 14 }}>□</span>, label: "Shape" },
    { id: "d", icon: <span style={{ fontSize: 14 }}>✎</span>, label: "Draw" },
    { id: "e", icon: <span style={{ fontSize: 14 }}>☆</span>, label: "Star" },
  ];
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <div style={{ minHeight: 260, display: "grid", placeItems: "end center", paddingBottom: 24 }}>
          <RadialMenu
            key={String(v.animate)}
            items={demoItems}
            size={v.size as "sm" | "md" | "lg"}
            radius={Number(v.radius)}
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
            animate={Boolean(v.animate)}
            aria-label="Tools"
          />
        </div>
      )}
      snippet={(v) =>
        `<RadialMenu size="${v.size}" radius={${Number(v.radius)}} items={[/* ... */]} ${snippetExtras(v)} />`
      }
    />
  );
}
```

- [ ] **Step 4: MDX page**

Create `apps/docs/app/docs/radial-menu/page.mdx` mirroring `apps/docs/app/docs/radial-progress/page.mdx`:

- Title: `# Radial Menu`
- One-line blurb matching the nav entry
- `<ComponentPlayground name="radial-menu" />`
- `<ComponentCliInstallTabs name="radial-menu" />`
- Usage section importing `RadialMenu` from `doodleui-react` with a 2-item `items` example and `aria-label="Tools"`
- Note: click trigger to open/close; item `onSelect` leaves the menu open
- `<PropsTable rows={radialMenuProps} />`

- [ ] **Step 5: Spot-check docs typecheck / build if available**

```bash
pnpm --filter docs exec tsc --noEmit
```

If the docs package has no `tsc` script, open `/docs/radial-menu` via the running `pnpm dev` and confirm the playground renders.

- [ ] **Step 6: Commit**

```bash
git add apps/docs/lib/nav.ts apps/docs/lib/props.ts \
  apps/docs/components/ComponentPlayground.tsx \
  apps/docs/app/docs/radial-menu/page.mdx
git commit -m "$(cat <<'EOF'
docs: add Radial Menu page and playground

EOF
)"
```

---

### Task 5: Registry rebuild + final verification

**Files:**
- Regenerate: `packages/doodle-ui/src/registry/data.ts` (and any `apps/docs/public` registry JSON the script writes)

**Interfaces:**
- Consumes: finished `RadialMenu.tsx` + docs blurb from MDX
- Produces: CLI-installable `radial-menu` registry entry

- [ ] **Step 1: Rebuild registry**

```bash
pnpm --filter doodleui-react build:registry
```

Expected: `radial-menu` appears in generated registry data; no manual edits to `data.ts`.

- [ ] **Step 2: Re-run unit tests + typecheck**

```bash
pnpm --filter doodleui-react exec vitest run src/components/__tests__/RadialMenu.test.tsx
pnpm --filter doodleui-react typecheck
```

Expected: PASS / exit 0.

- [ ] **Step 3: Commit registry output**

```bash
git add packages/doodle-ui/src/registry/data.ts apps/docs/public
git commit -m "$(cat <<'EOF'
chore: regenerate registry for radial-menu

EOF
)"
```

(Only stage paths that actually changed.)

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| Sketch rough.js circles | Task 2 |
| Semicircle above trigger | Task 2 (`itemOffset`) |
| `items` array API | Tasks 1–2 |
| `+` rotates 45° | Task 2 |
| Trigger-only close; select keeps open | Tasks 1–2 |
| Controlled + uncontrolled | Tasks 1–2 |
| `prefers-reduced-motion` | Tasks 1–2 |
| Export / Storybook | Task 3 |
| Docs + playground + props + nav | Task 4 |
| CLI registry | Task 5 |
| Out of scope (full circle, compound API, Escape dismiss, roving focus) | Not implemented |

## Plan self-review notes

- No TBD placeholders; types and helpers named consistently (`RadialMenuItem`, `itemOffset`, `SIZE_PX`).
- Arc angles fixed to `200° → -20°` (matches design’s “slight padding”).
- Default trigger `aria-label` is `"Open menu"`; docs/playground pass `"Tools"` / `"Actions"` explicitly.
