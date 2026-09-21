import sdk from "@stackblitz/sdk";

const PACKAGE_VERSION = "^0.8.0";

/** PascalCase tags that are doodleui-react exports (plus known compound names). */
const DOODLE_EXPORTS = new Set([
  "Accordion",
  "AccordionContent",
  "AccordionItem",
  "AccordionTrigger",
  "Alert",
  "AlertDialog",
  "AlertDialogAction",
  "AlertDialogCancel",
  "AlertDialogContent",
  "AlertDialogDescription",
  "AlertDialogFooter",
  "AlertDialogHeader",
  "AlertDialogTitle",
  "AlertDialogTrigger",
  "AspectRatio",
  "Avatar",
  "Badge",
  "Blockquote",
  "Breadcrumb",
  "BreadcrumbItem",
  "Button",
  "Card",
  "Carousel",
  "CarouselContent",
  "CarouselItem",
  "CarouselNext",
  "CarouselPrevious",
  "Checkbox",
  "Collapsible",
  "CollapsibleContent",
  "CollapsibleTrigger",
  "Combobox",
  "Command",
  "CommandEmpty",
  "CommandGroup",
  "CommandInput",
  "CommandItem",
  "CommandList",
  "ContextMenu",
  "ContextMenuContent",
  "ContextMenuItem",
  "ContextMenuTrigger",
  "Dialog",
  "DialogClose",
  "DialogContent",
  "DialogDescription",
  "DialogFooter",
  "DialogHeader",
  "DialogTitle",
  "DialogTrigger",
  "Divider",
  "Drawer",
  "DrawerContent",
  "DrawerDescription",
  "DrawerFooter",
  "DrawerHeader",
  "DrawerTitle",
  "DrawerTrigger",
  "DropdownMenu",
  "DropdownMenuContent",
  "DropdownMenuItem",
  "DropdownMenuLabel",
  "DropdownMenuSeparator",
  "DropdownMenuTrigger",
  "Empty",
  "EmptyAction",
  "EmptyDescription",
  "EmptyMedia",
  "EmptyTitle",
  "Field",
  "FieldControl",
  "FieldDescription",
  "FieldError",
  "FieldLabel",
  "Heading",
  "Highlight",
  "HoverCard",
  "HoverCardContent",
  "HoverCardTrigger",
  "InlineCode",
  "Input",
  "InputGroup",
  "InputGroupAddon",
  "InputGroupInput",
  "InputOTP",
  "InputOTPGroup",
  "InputOTPSeparator",
  "InputOTPSlot",
  "Kbd",
  "Label",
  "Menubar",
  "MenubarContent",
  "MenubarItem",
  "MenubarMenu",
  "MenubarTrigger",
  "Modal",
  "NativeSelect",
  "NavigationMenu",
  "NavigationMenuContent",
  "NavigationMenuItem",
  "NavigationMenuList",
  "NavigationMenuTrigger",
  "Pagination",
  "Popover",
  "PopoverContent",
  "PopoverTrigger",
  "Progress",
  "Radio",
  "RadioGroup",
  "ResizableHandle",
  "ResizablePanel",
  "ResizablePanelGroup",
  "ScrollArea",
  "ScrollAreaViewport",
  "ScrollBar",
  "Select",
  "Sheet",
  "SheetContent",
  "SheetDescription",
  "SheetHeader",
  "SheetTitle",
  "SheetTrigger",
  "Sidebar",
  "SidebarContent",
  "SidebarFooter",
  "SidebarGroup",
  "SidebarHeader",
  "SidebarInset",
  "SidebarItem",
  "SidebarLayout",
  "SidebarProvider",
  "SidebarTrigger",
  "Skeleton",
  "Slider",
  "Spinner",
  "Stepper",
  "Switch",
  "Tab",
  "Table",
  "TableBody",
  "TableCell",
  "TableHead",
  "TableHeader",
  "TableHeaderCell",
  "TableRow",
  "TabList",
  "TabPanel",
  "Tabs",
  "Text",
  "Textarea",
  "Toast",
  "ToastProvider",
  "Toggle",
  "ToggleGroup",
  "ToggleGroupItem",
  "Tooltip",
]);

function extractImports(snippet: string): string[] {
  const tags = new Set<string>();
  const re = /<\/?([A-Z][A-Za-z0-9]*)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(snippet)) !== null) {
    const name = match[1];
    if (name && DOODLE_EXPORTS.has(name)) tags.add(name);
  }
  tags.add("Button");
  return Array.from(tags).sort();
}

function indentSnippet(snippet: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return snippet
    .trim()
    .split("\n")
    .map((line) => (line.length ? pad + line : line))
    .join("\n");
}

function buildAppTsx(title: string, snippet: string): string {
  const imports = extractImports(snippet);
  const componentImports = imports;

  const importLines = [
    `import { useState } from "react";`,
    `import {`,
    ...componentImports.map((n) => `  ${n},`),
    `  useSketchSeed,`,
    `  DoodleUIProvider,`,
    `  SketchSeedProvider,`,
    `  TooltipProvider,`,
    `} from "doodleui-react";`,
    `import "doodleui-react/styles.css";`,
  ];

  return `${importLines.join("\n")}

function ShuffleButton() {
  const { shuffle } = useSketchSeed();
  return (
    <Button variant="outline" size="sm" onClick={shuffle}>
      Shuffle
    </Button>
  );
}

function Demo() {
  const [page, setPage] = useState(2);
  void page;
  void setPage;

  return (
    <>
${indentSnippet(snippet, 6)}
    </>
  );
}

export default function App() {
  return (
    <SketchSeedProvider>
      <DoodleUIProvider theme="light">
        <TooltipProvider>
          <main
            style={{
              fontFamily: "Outfit, system-ui, sans-serif",
              minHeight: "100vh",
              margin: 0,
              background: "#eef0ea",
              color: "#1f1d1a",
            }}
          >
            <header
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "12px 20px",
                borderBottom: "1px solid #1f1d1a14",
              }}
            >
              <strong style={{ fontFamily: '"Patrick Hand", cursive', fontSize: 20 }}>
                doodle-ui · ${title}
              </strong>
              <ShuffleButton />
            </header>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 40,
                minHeight: 280,
              }}
            >
              <Demo />
            </div>
          </main>
        </TooltipProvider>
      </DoodleUIProvider>
    </SketchSeedProvider>
  );
}
`;
}

function buildProjectFiles(title: string, snippet: string): Record<string, string> {
  return {
    "package.json": JSON.stringify(
      {
        name: `doodleui-${title.toLowerCase().replace(/\s+/g, "-")}-playground`,
        private: true,
        version: "0.0.0",
        type: "module",
        scripts: {
          dev: "vite",
          build: "tsc && vite build",
          preview: "vite preview",
        },
        dependencies: {
          "doodleui-react": PACKAGE_VERSION,
          react: "^18.3.1",
          "react-dom": "^18.3.1",
        },
        devDependencies: {
          "@types/react": "^18.3.18",
          "@types/react-dom": "^18.3.5",
          "@vitejs/plugin-react": "^4.3.4",
          typescript: "^5.7.2",
          vite: "^6.0.7",
        },
      },
      null,
      2,
    ),
    "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>doodle-ui · ${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Outfit:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    <style>
      :root { --doodle-ui-font: "Patrick Hand", cursive; }
      body { margin: 0; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    "vite.config.ts": `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`,
    "tsconfig.json": JSON.stringify(
      {
        compilerOptions: {
          target: "ES2020",
          useDefineForClassFields: true,
          lib: ["ES2020", "DOM", "DOM.Iterable"],
          module: "ESNext",
          skipLibCheck: true,
          moduleResolution: "bundler",
          allowImportingTsExtensions: true,
          isolatedModules: true,
          moduleDetection: "force",
          noEmit: true,
          jsx: "react-jsx",
          strict: true,
        },
        include: ["src"],
      },
      null,
      2,
    ),
    "src/main.tsx": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`,
    "src/App.tsx": buildAppTsx(title, snippet),
    "src/vite-env.d.ts": `/// <reference types="vite/client" />\n`,
  };
}

/**
 * Opens a self-contained Vite + React StackBlitz project preloaded with the
 * current docs playground snippet.
 */
export function openStackBlitzProject(title: string, snippet: string): void {
  const files = buildProjectFiles(title, snippet);
  sdk.openProject(
    {
      title: `doodle-ui · ${title}`,
      description: `Live playground for the doodleui-react ${title} example`,
      template: "node",
      files,
    },
    {
      newWindow: true,
      openFile: "src/App.tsx",
    },
  );
}
