# Changelog

## 0.3.0

Sketch animations are now on across the library, not just Button.

Draw-in on mount plus interaction motion (hover/focus morph, check/radio marks, progress fill redraw, tab underline slide, modal/toast enter-exit, switch thumb spring) default on. Opt out with `animate={false}` or `<DoodleUIProvider animate={false}>`. `prefers-reduced-motion: reduce` still disables motion unless `forceAnimate` is set.
