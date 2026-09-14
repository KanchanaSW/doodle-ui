# doodle-ui

Hand-drawn React components with an Excalidraw-like sketch aesthetic. Chrome is drawn with [rough.js](https://roughjs.com). Text stays real HTML, so it remains crisp and accessible.

The published package is `[doodleui-react](https://www.npmjs.com/package/doodleui-react)`. Docs live at [doodle-ui.netlify.app](https://doodle-ui.netlify.app).

<img width="2964" height="4067" alt="image" src="https://github.com/user-attachments/assets/5ebf0f9f-2ae0-41a6-bba1-66b796d99050" />

Install

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

Wrap the tree in `SketchSeedProvider` so Shuffle can redraw every unlocked sketch. Wrap in `TooltipProvider` if you use tooltips. Pass `seed={123}` on a component to lock its wobble.

## Shared sketch props

Every component accepts:


| Prop                  | Type     | Default           | Notes                                    |
| --------------------- | -------- | ----------------- | ---------------------------------------- |
| `roughness`           | `number` | `1.5`             | Sketchiness intensity                    |
| `seed`                | `number` | provider / random | Lock the pattern. Omit to follow Shuffle |
| `sketchColor`         | `string` | `#1f1d1a`         | Stroke color                             |
| `className` / `style` | standard |                   | Layout only. No bundled visual CSS       |




## Components

Button, Input, Textarea, Checkbox, Radio, Select, Switch, Slider, Card, Badge, Alert, Modal, Divider, Progress, Tooltip, Tabs, Accordion, Table, Toast, Avatar, Pagination, Breadcrumb, Skeleton, Stepper, plus the `RoughSvg` primitive.

Modal, Tooltip, Checkbox, Radio, Select, Switch, Tabs, Accordion, Slider, Toast, and Avatar sit on Radix primitives, so focus traps, Escape, and ARIA come with the sketch chrome.

## Monorepo

- `packages/doodle-ui` — the component library (published as `doodleui-react`)
- `apps/docs` — Next.js 14 App Router documentation site

```bash
pnpm install
pnpm dev
```

Docs run at [http://localhost:3000](http://localhost:3000). The library rebuilds in watch mode through Turborepo.

```bash
pnpm build
pnpm typecheck
```



## Publish (library)

```bash
pnpm --filter doodleui-react publish --access public
```

`doodle-ui` is blocked on npm by an unpublished stub, so the package name is `doodleui-react`.

## License

MIT
