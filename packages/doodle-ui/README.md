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

Sketch strokes draw in on mount. Set `animate={false}` on a component, or wrap the tree in `DoodleUIProvider animate={false}`, to opt out. Pass `theme="light" | "dark" | "system"` on `DoodleUIProvider` (default `system`) so sketch ink and fills follow dark mode. See the docs for the full animation map.

## Theming

```tsx
import "doodleui-react/styles.css";
```

Override `--doodle-ui-roughness`, `--doodle-ui-stroke-color`, `--doodle-ui-font-family`, and related tokens on `:root`. Dark mode follows `data-theme`, `.dark`, `prefers-color-scheme`, or `DoodleUIProvider theme`. Details: [doodle-ui.netlify.app/docs/theming](https://doodle-ui.netlify.app/docs/theming).

## Shared sketch props

Every component accepts:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `roughness` | `number` | `1.5` | Sketchiness intensity |
| `seed` | `number` | provider / random | Lock the pattern. Omit to follow Shuffle |
| `sketchColor` | `string` | `#1f1d1a` | Stroke color |
| `className` / `style` | standard | | Layout only. No bundled visual CSS framework |

## Components

Button, Input, Textarea, Checkbox, Radio, Select, NativeSelect, Switch, Slider, Card, Badge, Alert, Modal, Divider, Progress, Tooltip, Tabs, Accordion, Table, Toast, Avatar, Pagination, Breadcrumb, Skeleton, Stepper, Label, Field, Collapsible, Popover, DropdownMenu, Dialog, AlertDialog, Command, Combobox, Kbd, Spinner, Toggle, ToggleGroup, InputGroup, InputOTP, ScrollArea, Resizable, HoverCard, ContextMenu, NavigationMenu, Menubar, Sheet, Drawer, AspectRatio, Empty, Heading, Text, Blockquote, InlineCode, Highlight, Sidebar, Carousel, plus the `RoughSvg` primitive.

Most of those sketch in on mount (draw-in) and re-ink on interaction. Default on; pass `animate={false}` to skip. Slider, Accordion, Avatar, Pagination, Breadcrumb, Skeleton, and Stepper stay static for now.

Modal, Tooltip, Checkbox, Radio, Select, Switch, Tabs, Accordion, Slider, Toast, Avatar, Popover, DropdownMenu, Dialog, AlertDialog, Collapsible, Label, HoverCard, ContextMenu, NavigationMenu, Menubar, Sheet, Drawer, and AspectRatio sit on Radix primitives; Command and Combobox add `cmdk` on top for search/filtering. `InputOTP` uses `input-otp`; `Resizable` uses `react-resizable-panels`; `Carousel` uses `embla-carousel-react`.

## Docs

Live site: [doodle-ui.netlify.app](https://doodle-ui.netlify.app)

The source for that site is `apps/docs` in the [doodle-ui](https://github.com/KanchanaSW/doodle-ui) monorepo.

## License

MIT
