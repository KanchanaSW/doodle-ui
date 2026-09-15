# Changelog

## 0.4.0

Form & overlay essentials: `Label`, `Collapsible`, `Popover`, `DropdownMenu`, `Dialog`, `AlertDialog`, `Command`, and `Combobox`.

`Dialog` is a lighter, fully composable sibling to `Modal` (no forced width/shadow/close button). `AlertDialog` adds the confirm/destructive variant on top of the same shape. `Command` is powered by `cmdk` (new dependency) and `Combobox` composes `Popover` + `Command` behind a sketchy trigger, matching shadcn's own approach since Radix has no dedicated Combobox primitive. All eight ship with the same `animate`/`roughness`/`seed`/`sketchColor` props as the rest of the library.

## 0.3.0

Sketch animations are now on across the library, not just Button.

Draw-in on mount plus interaction motion (hover/focus morph, check/radio marks, progress fill redraw, tab underline slide, modal/toast enter-exit, switch thumb spring) default on. Opt out with `animate={false}` or `<DoodleUIProvider animate={false}>`. `prefers-reduced-motion: reduce` still disables motion unless `forceAnimate` is set.
