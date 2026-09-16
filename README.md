# doodle-ui

Hand-drawn React components with an Excalidraw-like sketch aesthetic. Chrome is drawn with [rough.js](https://roughjs.com). Text stays real HTML, so it remains crisp and accessible.

The published package is `[doodleui-react](https://www.npmjs.com/package/doodleui-react)`. Docs live at [doodle-ui.netlify.app](https://doodle-ui.netlify.app).

![image](https://github.com/user-attachments/assets/5ebf0f9f-2ae0-41a6-bba1-66b796d99050)

## CLI Component Installer (shadcn-style)

Copy component source code directly into your project to customize sketch styling directly:

```bash
# Initialize doodleui config & copy shared utilities
npx doodleui-react init

# Add components directly into your codebase
npx doodleui-react add button card dialog

# List available components and local install status
npx doodleui-react list

# Compare local modifications against upstream registry
npx doodleui-react diff button
```

## Install (npm dependency)

```bash
npm install doodleui-react
# or
pnpm add doodleui-react
```

Peer dependencies: `react` and `react-dom` >= 18. rough.js ships with the package.

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

Wrap the tree in `SketchSeedProvider` so Shuffle can redraw every unlocked sketch. Wrap in `TooltipProvider` if you use tooltips. Pass `seed={123}` on a component to lock its wobble. Sketch animations are on by default; wrap in `DoodleUIProvider` or pass `animate={false}` to opt out. Pass `theme` on `DoodleUIProvider` (`light` / `dark` / `system`) so sketch colors follow dark mode.

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

```bash
pnpm install
pnpm dev

npx pnpm install
npx pnpm dev
```

Docs run at [http://localhost:3000](http://localhost:3000). The library rebuilds in watch mode through Turborepo.

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

`doodle-ui` is blocked on npm by an unpublished stub, so the package name is `doodleui-react`.

## License

MIT