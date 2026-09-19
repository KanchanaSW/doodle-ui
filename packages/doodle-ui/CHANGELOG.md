# Changelog

## 0.7.2

SSR/hydration safety (deterministic first-render seeds, isomorphic layout effects, theme sync after mount) and component API hardening: shared sizing, icons, form validation props, compound Card/Table/Accordion/Field, and `asChild` on Button/Card/Badge.

## 0.7.1

Accessibility hardening for rough SVG isolation and Radix labels, WCAG AA theme stroke/fill token adjustments, Node.js engine requirement raised to `>=22`, and component theme polish. CLI/registry version aligned with the package.

## 0.7.0

CSS theming: ship `doodleui-react/styles.css` with `:root` defaults, dark overrides (`data-theme`, `.dark`, `prefers-color-scheme`), and semantic color tokens. `useSketchDefaults` respects CSS variables when provider props are unset. `useSketchTheme` reads palette from CSS vars. `DoodleUIProvider` sets scoped `data-theme` for light/dark subtrees.

## 0.6.2

CLI component installer: `npx doodleui-react init`, `add`, `list`, and `diff` copy sketch component source into your project (shadcn-style). Ships a generated component registry and `doodleui` / `doodleui-react` binaries.

## 0.6.1

Dark mode: components resolve sketch ink, paper, and fills through `useSketchTheme`. `DoodleUIProvider` accepts `theme="light" | "dark" | "system"` (default `system`, following `html.dark`, `data-theme="dark"`, or `prefers-color-scheme`). Dark tokens: `DEFAULT_DARK_INK`, `DEFAULT_DARK_PAPER`, `DEFAULT_DARK_CARD_BG`, `DARK_SKETCH_COLORS`.

## 0.6.0

Layout and content helpers: `AspectRatio`, `NativeSelect`, `Empty`, `Field`, typography (`Heading`, `Text`, `Paragraph`, `Blockquote`, `InlineCode`, `Highlight`), `Sidebar`, and `Carousel`.

New dependencies: `@radix-ui/react-aspect-ratio` and `embla-carousel-react`.

## 0.5.0

Navigation & layout utilities: `Kbd`, `Spinner`, `Toggle`, `ToggleGroup`, `InputGroup`, `InputOTP`, `ScrollArea`, `Resizable`, `HoverCard`, `ContextMenu`, `NavigationMenu`, `Menubar`, `Sheet`, and `Drawer`.

New dependencies: Radix hover-card, context-menu, navigation-menu, menubar, toggle, toggle-group, scroll-area, plus `react-resizable-panels` and `input-otp`. `Sheet` and `Drawer` share an internal sliding-panel engine (Radix Dialog + framer-motion). `Spinner` loops continuously unless reduced motion is active.

## 0.4.0

Form & overlay essentials: `Label`, `Collapsible`, `Popover`, `DropdownMenu`, `Dialog`, `AlertDialog`, `Command`, and `Combobox`.

`Dialog` is a lighter, fully composable sibling to `Modal` (no forced width/shadow/close button). `AlertDialog` adds the confirm/destructive variant on top of the same shape. `Command` is powered by `cmdk` (new dependency) and `Combobox` composes `Popover` + `Command` behind a sketchy trigger, matching shadcn's own approach since Radix has no dedicated Combobox primitive. All eight ship with the same `animate`/`roughness`/`seed`/`sketchColor` props as the rest of the library.

## 0.3.0

Sketch animations are now on across the library, not just Button.

Draw-in on mount plus interaction motion (hover/focus morph, check/radio marks, progress fill redraw, tab underline slide, modal/toast enter-exit, switch thumb spring) default on. Opt out with `animate={false}` or `<DoodleUIProvider animate={false}>`. `prefers-reduced-motion: reduce` still disables motion unless `forceAnimate` is set.
