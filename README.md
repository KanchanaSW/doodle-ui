# doodle-ui

Hand-drawn React components with an Excalidraw-like sketch aesthetic. Chrome is drawn with [rough.js](https://roughjs.com). Text stays real HTML, so it remains crisp and accessible.

The published package is `[doodleui-react](https://www.npmjs.com/package/doodleui-react)`. Docs live at [doodle-ui.netlify.app](https://doodle-ui.netlify.app).

![npm](https://img.shields.io/npm/v/doodleui-react.svg)
![bundle size](https://img.shields.io/bundlephobia/minzip/doodleui-react)
![CI](https://github.com/KanchanaSW/doodle-ui/actions/workflows/ci.yml/badge.svg)

![image](https://github.com/user-attachments/assets/009a6a79-b002-48dd-b211-a224d10129b4)

## CLI Component Installer (shadcn-style)

Copy component source code directly into your project to customize sketch styling directly:

```bash
# npm
npx doodleui-react init
npx doodleui-react add button card dialog

# pnpm
pnpm dlx doodleui-react init
pnpm dlx doodleui-react add button card dialog

# yarn
yarn dlx doodleui-react init
yarn dlx doodleui-react add button card dialog

# bun
bunx doodleui-react init
bunx doodleui-react add button card dialog
```

The CLI detects your package manager from lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb` / `bun.lock`) when installing runtime dependencies.



## Install (npm dependency)

```bash
npm install doodleui-react
```

```bash
pnpm add doodleui-react
```

```bash
yarn add doodleui-react
```

```bash
bun add doodleui-react
```

Peer dependencies: `react` and `react-dom` >= 18.0.0. rough.js ships with the package.



## Online Playgrounds & Starters

Zero-setup templates you can open in the browser:


| Template           | StackBlitz                                                                                         | CodeSandbox                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Next.js App Router | [Open](https://stackblitz.com/github/KanchanaSW/doodle-ui/tree/master/examples/nextjs-starter)     | [Open](https://codesandbox.io/p/sandbox/github/KanchanaSW/doodle-ui/tree/master/examples/nextjs-starter)     |
| Vite + React       | [Open](https://stackblitz.com/github/KanchanaSW/doodle-ui/tree/master/examples/vite-react-starter) | [Open](https://codesandbox.io/p/sandbox/github/KanchanaSW/doodle-ui/tree/master/examples/vite-react-starter) |
| Full showcase      | [Open](https://stackblitz.com/github/KanchanaSW/doodle-ui/tree/master/examples/showcase)           | [Open](https://codesandbox.io/p/sandbox/github/KanchanaSW/doodle-ui/tree/master/examples/showcase)           |


Source lives in `[examples/](examples/)` in this repo.

## Quickstart

```tsx
import {
  SketchSeedProvider,
  TooltipProvider,
  Button,
  Card,
  useSketchSeed,
} from "doodleui-react";

function Shuffle() {
  const { shuffle } = useSketchSeed();
  return <Button onClick={shuffle}>Shuffle</Button>;
}

export function App() {
  return (
    <SketchSeedProvider>
      <TooltipProvider>
        <Shuffle />
        <Card title="Notebook">
          <Button variant="primary">Draw something</Button>
        </Card>
      </TooltipProvider>
    </SketchSeedProvider>
  );
}
```

Wrap the tree in `SketchSeedProvider` so Shuffle can redraw every unlocked sketch. Wrap in `TooltipProvider` if you use tooltips. Pass `seed={123}` on a component to lock its wobble. Sketch animations are on by default; wrap in `DoodleUIProvider` or pass `animate={false}` to opt out. Pass `theme` on `DoodleUIProvider` (`light` / `dark` / `system`) so sketch colors follow dark mode. The library respects `prefers-reduced-motion` automatically — see [Animation docs](https://doodle-ui.netlify.app/docs/animation#reduced-motion-support).

## Accessibility

doodleui-react targets **WCAG 2.1 AA** for default light and dark themes:

- Sketch stroke and text contrast audited programmatically (including an effective ratio for thin rough.js strokes)
- Interactive roles, names, and keyboard behavior come from Radix (and related) primitives; decorative RoughSvg layers are `aria-hidden`
- Reduced motion is honored unless you set `forceAnimate` on the provider

Full results, before/after contrast tables, and the screen-reader checklist: **[A11Y-AUDIT.md](A11Y-AUDIT.md)**. Re-run the contrast suite with `pnpm --filter doodleui-react audit:contrast`.

## Theming

Import the base stylesheet once, then override CSS variables globally or on a scoped wrapper:

```tsx
import "doodleui-react/styles.css";
```

See [Theming](https://doodle-ui.netlify.app/docs/theming) on the docs site for the full `--doodle-ui-*` reference, dark mode setup, and handwriting font pairings.

## Shared sketch props

Every component accepts:


| Prop                  | Type     | Default           | Notes                                    |
| --------------------- | -------- | ----------------- | ---------------------------------------- |
| `roughness`           | `number` | `1.5`             | Sketchiness intensity                    |
| `seed`                | `number` | provider / random | Lock the pattern. Omit to follow Shuffle |
| `sketchColor`         | `string` | `#1f1d1a`         | Stroke color                             |
| `className` / `style` | standard |                   | Layout only. No bundled visual CSS       |




## Components

Button, Input, Textarea, Checkbox, Radio, Select, NativeSelect, Switch, Slider, Card, Badge, Alert, Modal, Divider, Progress, Tooltip, Tabs, Accordion, Table, Toast, Avatar, Pagination, Breadcrumb, Skeleton, Stepper, Label, Field, Collapsible, Popover, DropdownMenu, Dialog, AlertDialog, Command, Combobox, Kbd, Spinner, Toggle, ToggleGroup, InputGroup, InputOTP, ScrollArea, Resizable, HoverCard, ContextMenu, NavigationMenu, Menubar, Sheet, Drawer, AspectRatio, Empty, Heading, Text, Blockquote, InlineCode, Highlight, Sidebar, Carousel, plus the `RoughSvg` primitive.

Most components draw in on mount and re-ink on interaction (default on, opt out with `animate={false}` or `DoodleUIProvider`).

Modal, Tooltip, Checkbox, Radio, Select, Switch, Tabs, Accordion, Slider, Toast, Avatar, Popover, DropdownMenu, Dialog, AlertDialog, Collapsible, Label, HoverCard, ContextMenu, NavigationMenu, Menubar, Sheet, Drawer, and AspectRatio sit on Radix primitives, so focus traps, Escape, and ARIA come with the sketch chrome. Command and Combobox add `cmdk` for search/filtering. `InputOTP` uses `input-otp`; `Resizable` uses `react-resizable-panels`; `Carousel` uses `embla-carousel-react`.

## Monorepo

- `packages/doodle-ui` — the component library (published as `doodleui-react`)
- `apps/docs` — Next.js 14 App Router documentation site
- `examples/` — Vite, Next.js, and kitchen-sink playground starters

```bash
pnpm install
pnpm dev

npx pnpm install
npx pnpm dev
```

Docs run at [http://localhost:3001](http://localhost:3000). The library rebuilds in watch mode through Turborepo.

```bash
pnpm build
pnpm typecheck
```



## Publish (library)

```bash
npm login
npm whoami

pnpm --filter doodleui-react publish --access public

npx pnpm --filter doodleui-react publish --access public --no-git-checks
```



## Community & Contributing

- [Contributing Guide](CONTRIBUTING.md) — setup, component conventions, changesets, and PR checklist
- [Code of Conduct](CODE_OF_CONDUCT.md) — expectations for community participation
- [Security Policy](SECURITY.md) — how to report vulnerabilities privately
- [GitHub Discussions](https://github.com/KanchanaSW/doodle-ui/discussions) — questions and ideas



## License

[MIT](LICENSE) © 2026 KanchanaSW