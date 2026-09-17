# Accessibility Audit — doodleui-react

**Date:** 2026-09-17  
**Scope:** WCAG 2.1 AA contrast (1.4.3 / 1.4.11), Radix-wrapped screen reader semantics, decorative RoughSvg isolation, reduced-motion behavior  
**Status:** Pass (after token and semantics fixes below)  
**Runner:** `pnpm --filter doodleui-react audit:contrast` → [`packages/doodle-ui/scripts/audit-contrast.ts`](packages/doodle-ui/scripts/audit-contrast.ts)

---

## Executive summary

doodleui-react keeps interactive semantics on real HTML / Radix primitives and draws chrome with rough.js. This pass:

1. Audited **239** stroke/text/background pairs in light and dark mode (nominal + effective sketchy-stroke contrast).
2. Fixed **5** failing light-mode pairs via shared theme tokens (warning/error, accent badge ink/fill, alert fills, slider track opacity).
3. Hardened decorative SVG isolation and label wiring on Switch / Slider.
4. Documented reduced-motion support on the docs Animation page and added a live playground indicator.

Default ink/paper pairs already exceeded AA by a wide margin (~15:1 light, ~16:1 dark). Failures were concentrated in **status and accent washes**, where brand colors sat on pale fills.

---

## 1. Hand-drawn stroke & text contrast

### Method

- WCAG relative luminance and contrast ratio (same formula as WCAG 2).
- **UI boundaries** (sketch strokes): minimum **3:1** (1.4.11).
- **Text**: minimum **4.5:1** (1.4.3 AA).
- **Effective** stroke contrast = nominal × **0.85** to account for thin (~1.4–1.75px), wobbly, anti-aliased rough.js paths (not solid CSS borders).

Re-run anytime:

```bash
pnpm --filter doodleui-react audit:contrast
```

### Shared defaults (after fix)

| Mode | Pair | Nominal | Effective | Threshold | Result |
| --- | --- | --- | --- | --- | --- |
| Light | Stroke `#1f1d1a` on `#f7f6f2` | 15.55:1 | 13.22:1 | 3:1 | Pass |
| Light | Text `#1f1d1a` on `#f7f6f2` | 15.55:1 | — | 4.5:1 | Pass |
| Dark | Stroke `#f3f4f6` on `#131923` | 16.02:1 | 13.62:1 | 3:1 | Pass |
| Dark | Text `#f3f4f6` on `#131923` | 16.02:1 | — | 4.5:1 | Pass |

Components that use default ink on paper (Button, Card, Input, Select, Dialog, menus, etc.) inherit these ratios in both themes — **pass**.

### Failures found (before) → after

| Component | Mode | Kind | Before | After | Fix |
| --- | --- | --- | --- | --- | --- |
| Badge `accent` | Light | Text | `#e24b3b` on `#f4c4bc` **2.54:1** | `accentInk` `#9b2c20` on `#fce8e4` **6.42:1** | Darker accent ink + lighter wash |
| Badge `accent` | Light | UI | same **2.54:1** (eff. 2.16) | **6.42:1** (eff. 5.45) | Same |
| Alert / Toast warning | Light | UI | `#c47b17` on `#f3e2c0` **2.66:1** | `#8a5200` on `#f8ebd0` **5.41:1** (eff. 4.60) | Darker `--doodle-ui-color-warning` + lighter fill |
| Alert warning title | Light | Text | `#c47b17` on paper **3.14:1** | `#8a5200` on paper **5.91:1** / on fill **5.41:1** | Same warning token |
| (proactive) Error status | Light | — | borderline on old fill | `#b91c1c` + lighter error fill | Shared error token |
| (proactive) Slider track | Dark | UI | `rgba(ink,0.4)` ~3.6:1 (eff. ~3.0) | `rgba(ink,0.55)` **5.61:1** (eff. 4.77) | Opacity bump |

### Token changes (source of truth)

| Token / constant | Light before → after |
| --- | --- |
| `--doodle-ui-color-warning` / `SKETCH_COLORS.warning` | `#c47b17` → `#8a5200` |
| `--doodle-ui-color-error` / `SKETCH_COLORS.error` | `#c0392b` → `#b91c1c` |
| `SKETCH_COLORS.accentFill` | `#f4c4bc` → `#fce8e4` |
| `SKETCH_COLORS.accentInk` (new) | — → `#9b2c20` |
| Alert/Toast warning fill | `#f3e2c0` → `#f8ebd0` |
| Alert/Toast error fill | `#f3d0cc` → `#f8d4d0` |
| Slider dark track | `0.4` → `0.55` opacity |

Dark-mode status colors (`#60a5fa`, `#fbbf24`, `#f87171`, `#34d399` on `#131923`) already passed text and UI thresholds; left unchanged.

### Post-fix audit

**239 pairs, 0 failures** (nominal + effective).

---

## 2. Screen reader & keyboard (Radix-wrapped)

### Approach

- **Code audit** of every Radix / cmdk / sliding-panel wrapper: roles come from primitives; sketch chrome must stay decorative.
- **VoiceOver (macOS)** against docs playgrounds for representative controls (Switch, Checkbox, Tabs, Dialog, Select, Slider).
- **NVDA (Windows):** not executed in this environment; checklist below is based on Radix contracts + the same DOM attributes VoiceOver exercises. Re-validate on Windows before a major release if possible.

### Decorative RoughSvg

| Check | Result |
| --- | --- |
| Overlay wrapper `aria-hidden="true"` | Pass ([`RoughSvg.tsx`](packages/doodle-ui/src/primitives/RoughSvg.tsx)) |
| Inner `<svg aria-hidden="true" focusable="false">` | Pass (hardened this pass) |
| `pointer-events: none` on overlay | Pass |
| No `<title>` / `<desc>` injected by rough.js usage | Pass |

All sketch borders, fills, checkmarks, radio dots, and menu chevrons route through `RoughSvg` or wrappers that are themselves `aria-hidden`.

### Component checklist

| Component | Role / name / state | Decorative SVG hidden | Keyboard (Radix intent) | Notes |
| --- | --- | --- | --- | --- |
| Dialog / Modal | Pass | Pass | Pass | Focus trap, Escape, title/description |
| Alert Dialog | Pass | Pass | Pass | |
| Sheet / Drawer | Pass | Pass | Pass | Dialog primitive via SlidingPanel |
| Popover | Pass | Pass | Pass | |
| Tooltip | Pass | Pass | Pass | |
| Hover Card | Pass | Pass | Pass | |
| Dropdown Menu | Pass | Pass | Pass | Arrow / Enter / Escape |
| Context Menu | Pass | Pass | Pass | |
| Menubar | Pass | Pass | Pass | |
| Navigation Menu | Pass | Pass | Pass | |
| Select | Pass | Pass | Pass | |
| Combobox | Pass | Pass | Pass | cmdk + Popover |
| Command | Pass | Pass | Pass | cmdk listbox pattern |
| Tabs | Pass | Pass | Pass | `aria-selected`, arrows |
| Accordion | Pass | Pass | Pass | `aria-expanded` |
| Collapsible | Pass | Pass | Pass | |
| Switch | Pass | Pass | Pass | **Fixed:** `useId` + `htmlFor` when `label` set |
| Checkbox | Pass | Pass | Pass | Draw-in is visual only; state updates immediately |
| Radio | Pass | Pass | Pass | Same as Checkbox |
| Slider | Pass | Pass | Pass | **Fixed:** `aria-label` / `aria-labelledby` on Thumb |
| Toast | Pass | Pass | Pass | |
| Scroll Area | Pass | Pass | Pass | |
| Resizable | Pass | Pass | Pass | `react-resizable-panels` |
| Toggle / Toggle Group | Pass | Pass | Pass | Pressed state from Radix |

### Interaction animations vs announcement

Checkbox checkmark, Radio dot, and Switch thumb motion use `useAnimate` / Framer transitions. With reduced motion (or `animate={false}`), motion duration is zero. Checked/pressed state is driven by Radix props and is not gated on animation completion.

---

## 3. Reduced motion

Already implemented in [`resolveAnimate`](packages/doodle-ui/src/animations/resolveAnimate.ts) + [`usePrefersReducedMotion`](packages/doodle-ui/src/animations/usePrefersReducedMotion.ts):

- `prefers-reduced-motion: reduce` → animations off unless `forceAnimate` on `DoodleUIProvider`.
- Docs: [Animation → Reduced Motion Support](https://doodle-ui.netlify.app/docs/animation#reduced-motion-support) (also in-repo [`apps/docs/app/docs/animation/page.mdx`](apps/docs/app/docs/animation/page.mdx)).
- Playgrounds show a live note when the visitor’s browser has reduced motion enabled.

`forceAnimate` is an intentional escape hatch for demos — not recommended as a product default.

---

## 4. Contributor guidelines

1. Run `pnpm --filter doodleui-react audit:contrast` when changing `--doodle-ui-*` colors, `SKETCH_COLORS`, or status fills.
2. Keep all rough.js output inside `RoughSvg` (or an `aria-hidden` ancestor).
3. Prefer fixing **shared tokens** over one-off component colors.
4. When adding a Radix wrapper, verify label association (`id` / `htmlFor` or `aria-labelledby`) and that decorative SVG cannot receive focus.
5. File GitHub issues for any VoiceOver/NVDA regressions found in the wild and fix before the next release.

---

## Related links

- Theme tokens: [`packages/doodle-ui/src/styles.css`](packages/doodle-ui/src/styles.css), [`packages/doodle-ui/src/types.ts`](packages/doodle-ui/src/types.ts)
- Docs theming: `/docs/theming`
- Docs animation / reduced motion: `/docs/animation`
