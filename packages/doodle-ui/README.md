# doodle-ui

Hand-drawn React components with an Excalidraw-like sketch aesthetic. Chrome is drawn with [rough.js](https://roughjs.com). Text stays real HTML, so it remains crisp and accessible.

## Install

```bash
npm install doodleui-react
# or
pnpm add doodleui-react
```

Peer dependencies: `react` and `react-dom` >= 18.

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

Wrap the tree in `SketchSeedProvider` so a Shuffle action can redraw every unlocked sketch. Pass `seed={123}` on a component to lock its wobble.

## Shared sketch props

Every component accepts:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `roughness` | `number` | `1.5` | Sketchiness intensity |
| `seed` | `number` | provider / random | Lock the pattern. Omit to follow Shuffle |
| `sketchColor` | `string` | `#1f1d1a` | Stroke color |
| `className` / `style` | standard | | Layout only. No bundled visual CSS framework |

## Components

Button, Input, Textarea, Checkbox, Radio, Card, Badge, Alert, Modal, Divider, Progress, Tooltip, plus the `RoughSvg` primitive.

## Docs

See the documentation site in `apps/docs` of this monorepo.

## License

MIT
