## Summary

Briefly describe what this PR changes and why.

## Motivation / Context

Why is this change needed? Link related discussion if any.

## Related Issues

Fixes #

Closes #

## Type of Change

- [ ] `feat` — new component, prop, or feature
- [ ] `fix` — bug fix
- [ ] `docs` — documentation only
- [ ] `refactor` — code change with no API change
- [ ] `test` — tests only
- [ ] `chore` — tooling, CI, or repo maintenance

## Visual Verification

For any change that affects sketch rendering, attach a **screenshot or GIF** (before/after preferred). This is a visual library — screenshots are the fastest way to review sketch-styling PRs.

## Checklist

- [ ] Tests added or updated (`pnpm test`)
- [ ] Changeset added for `packages/doodle-ui` changes (`pnpm changeset`)
- [ ] Storybook stories added/updated with a pinned `seed` (e.g. `seed={42}`) for Chromatic stability
- [ ] Docs updated in `apps/docs` if adding a component or changing public props
- [ ] SSR hydration safety and reduced-motion behavior considered
- [ ] Bundle size check passes (`pnpm --filter doodleui-react size:check`) when relevant
- [ ] PR title follows conventional commits (`feat`, `fix`, `docs`, …)
