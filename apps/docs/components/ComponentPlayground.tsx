"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AspectRatio,
  Alert,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Blockquote,
  Button,
  Card,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Drawer,
  Empty,
  EmptyAction,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Divider,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Heading,
  Highlight,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  InlineCode,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  Kbd,
  Label,
  Modal,
  NativeSelect,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadialMenu,
  RadialProgress,
  Radio,
  RadioGroup,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  ScrollAreaViewport,
  ScrollBar,
  Select,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarLayout,
  SidebarProvider,
  SidebarTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Slider,
  Spinner,
  Stepper,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TabList,
  TabPanel,
  Tabs,
  Text,
  Textarea,
  Toast,
  ToastProvider,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
} from "doodleui-react";
import type { ComponentSlug } from "@/lib/nav";
import {
  Playground,
  PlaygroundTitleContext,
  sketchControls,
  sketchSnippetProps,
  type Control,
} from "@/components/Playground";

const LOCKED_SEED = 42;

function slugToTitle(slug: ComponentSlug): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const animateControl: Control = {
  type: "toggle",
  key: "animate",
  label: "Animate",
  defaultValue: true,
};

function withAnimate(controls: Control[]): Control[] {
  return [...controls, animateControl];
}

function snippetExtras(v: Record<string, unknown>): string {
  return [Boolean(v.animate) ? null : "animate={false}", sketchSnippetProps(v)]
    .filter(Boolean)
    .join(" ");
}

function seedFrom(values: Record<string, unknown>): number | undefined {
  return values.lockSeed ? LOCKED_SEED : undefined;
}

export function ComponentPlayground({ name }: { name: ComponentSlug }) {
  const title = slugToTitle(name);
  return (
    <PlaygroundTitleContext.Provider value={title}>
      <ComponentPlaygroundInner name={name} />
    </PlaygroundTitleContext.Provider>
  );
}

function ComponentPlaygroundInner({ name }: { name: ComponentSlug }) {
  switch (name) {
    case "button":
      return <ButtonPlayground />;
    case "input":
      return <InputPlayground />;
    case "textarea":
      return <TextareaPlayground />;
    case "checkbox":
      return <CheckboxPlayground />;
    case "radio":
      return <RadioPlayground />;
    case "card":
      return <CardPlayground />;
    case "badge":
      return <BadgePlayground />;
    case "alert":
      return <AlertPlayground />;
    case "modal":
      return <ModalPlayground />;
    case "divider":
      return <DividerPlayground />;
    case "progress":
      return <ProgressPlayground />;
    case "radial-progress":
      return <RadialProgressPlayground />;
    case "radial-menu":
      return <RadialMenuPlayground />;
    case "tooltip":
      return <TooltipPlayground />;
    case "select":
      return <SelectPlayground />;
    case "switch":
      return <SwitchPlayground />;
    case "slider":
      return <SliderPlayground />;
    case "tabs":
      return <TabsPlayground />;
    case "accordion":
      return <AccordionPlayground />;
    case "table":
      return <TablePlayground />;
    case "toast":
      return <ToastPlayground />;
    case "avatar":
      return <AvatarPlayground />;
    case "pagination":
      return <PaginationPlayground />;
    case "breadcrumb":
      return <BreadcrumbPlayground />;
    case "skeleton":
      return <SkeletonPlayground />;
    case "stepper":
      return <StepperPlayground />;
    case "label":
      return <LabelPlayground />;
    case "collapsible":
      return <CollapsiblePlayground />;
    case "popover":
      return <PopoverPlayground />;
    case "dropdown-menu":
      return <DropdownMenuPlayground />;
    case "dialog":
      return <DialogPlayground />;
    case "alert-dialog":
      return <AlertDialogPlayground />;
    case "command":
      return <CommandPlayground />;
    case "combobox":
      return <ComboboxPlayground />;
    case "kbd":
      return <KbdPlayground />;
    case "spinner":
      return <SpinnerPlayground />;
    case "toggle":
      return <TogglePlayground />;
    case "toggle-group":
      return <ToggleGroupPlayground />;
    case "input-group":
      return <InputGroupPlayground />;
    case "input-otp":
      return <InputOtpPlayground />;
    case "scroll-area":
      return <ScrollAreaPlayground />;
    case "resizable":
      return <ResizablePlayground />;
    case "hover-card":
      return <HoverCardPlayground />;
    case "context-menu":
      return <ContextMenuPlayground />;
    case "navigation-menu":
      return <NavigationMenuPlayground />;
    case "menubar":
      return <MenubarPlayground />;
    case "sheet":
      return <SheetPlayground />;
    case "drawer":
      return <DrawerPlayground />;
    case "aspect-ratio":
      return <AspectRatioPlayground />;
    case "native-select":
      return <NativeSelectPlayground />;
    case "empty":
      return <EmptyPlayground />;
    case "field":
      return <FieldPlayground />;
    case "typography":
      return <TypographyPlayground />;
    case "sidebar":
      return <SidebarPlayground />;
    case "carousel":
      return <CarouselPlayground />;
    default:
      return null;
  }
}

function ButtonPlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    {
      type: "select",
      key: "variant",
      label: "Variant",
      options: ["primary", "secondary", "outline", "ghost"],
      defaultValue: "primary",
    },
    {
      type: "select",
      key: "size",
      label: "Size",
      options: ["sm", "md", "lg"],
      defaultValue: "md",
    },
  ]);
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <Button
          key={String(v.animate)}
          variant={v.variant as "primary"}
          size={v.size as "md"}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          Draw me
        </Button>
      )}
      snippet={(v) =>
        `<Button variant="${v.variant}" size="${v.size}" ${snippetExtras(v)}>
  Draw me
</Button>`
      }
    />
  );
}

function InputPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <div className="w-full max-w-sm">
          <Input
            key={String(v.animate)}
            label="Email"
            placeholder="you@studio.dev"
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
            animate={Boolean(v.animate)}
          />
        </div>
      )}
      snippet={(v) =>
        `<Input label="Email" placeholder="you@studio.dev" ${snippetExtras(v)} />`
      }
    />
  );
}

function TextareaPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <div className="w-full max-w-sm">
          <Textarea
            key={String(v.animate)}
            label="Note"
            placeholder="Scratch something down"
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
            animate={Boolean(v.animate)}
          />
        </div>
      )}
      snippet={(v) =>
        `<Textarea label="Note" placeholder="Scratch something down" ${snippetExtras(v)} />`
      }
    />
  );
}

function CheckboxPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <LiveCheckbox
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        />
      )}
      snippet={(v) =>
        `<Checkbox label="Keep the wobble" defaultChecked ${snippetExtras(v)} />`
      }
    />
  );
}

function LiveCheckbox({
  roughness,
  seed,
  animate,
}: {
  roughness: number;
  seed?: number;
  animate: boolean;
}) {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox
      label="Keep the wobble"
      checked={checked}
      onCheckedChange={(value) => setChecked(value === true)}
      roughness={roughness}
      seed={seed}
      animate={animate}
    />
  );
}

function RadioPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <LiveRadio
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        />
      )}
      snippet={(v) =>
        `<RadioGroup defaultValue="pen">
  <Radio value="pen" label="Pen" ${snippetExtras(v)} />
  <Radio value="pencil" label="Pencil" ${snippetExtras(v)} />
</RadioGroup>`
      }
    />
  );
}

function LiveRadio({
  roughness,
  seed,
  animate,
}: {
  roughness: number;
  seed?: number;
  animate: boolean;
}) {
  const [value, setValue] = useState("pen");
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <Radio
        value="pen"
        label="Pen"
        roughness={roughness}
        seed={seed}
        animate={animate}
      />
      <Radio
        value="pencil"
        label="Pencil"
        roughness={roughness}
        seed={seed}
        animate={animate}
      />
    </RadioGroup>
  );
}

function CardPlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    { type: "toggle", key: "shadow", label: "Shadow", defaultValue: true },
  ]);
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <Card
          key={String(v.animate)}
          title="Field notes"
          shadow={Boolean(v.shadow)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
          style={{ width: 280 }}
        >
          A container with a sketch border. Text inside stays HTML.
        </Card>
      )}
      snippet={(v) =>
        `<Card title="Field notes" shadow={${Boolean(v.shadow)}} ${snippetExtras(v)}>
  A container with a sketch border.
</Card>`
      }
    />
  );
}

function BadgePlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    {
      type: "select",
      key: "variant",
      label: "Variant",
      options: ["default", "accent", "outline"],
      defaultValue: "accent",
    },
  ]);
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <Badge
          key={String(v.animate)}
          variant={v.variant as "accent"}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          sketch
        </Badge>
      )}
      snippet={(v) =>
        `<Badge variant="${v.variant}" ${snippetExtras(v)}>sketch</Badge>`
      }
    />
  );
}

function AlertPlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    {
      type: "select",
      key: "variant",
      label: "Variant",
      options: ["info", "warning", "error", "success"],
      defaultValue: "info",
    },
  ]);
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <Alert
          key={String(v.animate)}
          variant={v.variant as "info"}
          title="Heads up"
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
          style={{ maxWidth: 360 }}
        >
          Callouts keep a color-coded stroke and a light wash fill.
        </Alert>
      )}
      snippet={(v) =>
        `<Alert variant="${v.variant}" title="Heads up" ${snippetExtras(v)}>
  Callouts keep a color-coded stroke.
</Alert>`
      }
    />
  );
}

function ModalPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <Modal
          title="Scratch pad"
          description="Radix handles focus, Escape, and ARIA. doodle-ui draws the frame."
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
          trigger={
            <Button
              roughness={Number(v.roughness)}
              seed={seedFrom(v)}
              animate={Boolean(v.animate)}
            >
              Open modal
            </Button>
          }
        >
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
            Drop any HTML in here. The sketch layer stays behind the content.
          </p>
        </Modal>
      )}
      snippet={(v) =>
        `<Modal
  title="Scratch pad"
  trigger={<Button>Open modal</Button>}
  ${snippetExtras(v)}
>
  Content
</Modal>`
      }
    />
  );
}

function DividerPlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    {
      type: "select",
      key: "orientation",
      label: "Orientation",
      options: ["horizontal", "vertical"],
      defaultValue: "horizontal",
    },
  ]);
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <div
          className={
            v.orientation === "vertical"
              ? "h-32 flex justify-center"
              : "w-full max-w-sm"
          }
        >
          <Divider
            key={`${v.orientation}-${String(v.animate)}`}
            orientation={v.orientation as "horizontal"}
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
            animate={Boolean(v.animate)}
          />
        </div>
      )}
      snippet={(v) =>
        `<Divider orientation="${v.orientation}" ${snippetExtras(v)} />`
      }
    />
  );
}

function ProgressPlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    {
      type: "slider",
      key: "value",
      label: "Value",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 62,
    },
  ]);
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <div className="w-full max-w-sm">
          <Progress
            key={String(v.animate)}
            value={Number(v.value)}
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
            animate={Boolean(v.animate)}
          />
        </div>
      )}
      snippet={(v) =>
        `<Progress value={${Number(v.value)}} ${snippetExtras(v)} />`
      }
    />
  );
}

function RadialProgressPlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    {
      type: "slider",
      key: "value",
      label: "Value",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 75,
    },
    {
      type: "select",
      key: "size",
      label: "Size",
      options: ["sm", "md", "lg"],
      defaultValue: "md",
    },
    {
      type: "color",
      key: "activeColor",
      label: "Color",
      defaultValue: "#2d6a4f",
    },
    {
      type: "toggle",
      key: "indeterminate",
      label: "Indeterminate",
      defaultValue: false,
    },
  ]);
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <RadialProgress
          key={`${String(v.animate)}-${String(v.indeterminate)}`}
          value={v.indeterminate ? undefined : Number(v.value)}
          size={v.size as "sm" | "md" | "lg"}
          activeColor={String(v.activeColor)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        />
      )}
      snippet={(v) =>
        v.indeterminate
          ? `<RadialProgress size="${v.size}" activeColor="${String(v.activeColor)}" ${snippetExtras(v)} />`
          : `<RadialProgress value={${Number(v.value)}} size="${v.size}" activeColor="${String(v.activeColor)}" ${snippetExtras(v)} />`
      }
    />
  );
}

function RadialMenuPlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    {
      type: "select",
      key: "size",
      label: "Size",
      options: ["sm", "md", "lg"],
      defaultValue: "md",
    },
    {
      type: "slider",
      key: "radius",
      label: "Radius",
      min: 56,
      max: 140,
      step: 4,
      defaultValue: 88,
    },
  ]);
  const demoItems = [
    { id: "a", icon: <span style={{ fontSize: 14 }}>#</span>, label: "Crop" },
    { id: "b", icon: <span style={{ fontSize: 14 }}>T</span>, label: "Text" },
    { id: "c", icon: <span style={{ fontSize: 14 }}>□</span>, label: "Shape" },
    { id: "d", icon: <span style={{ fontSize: 14 }}>✎</span>, label: "Draw" },
    { id: "e", icon: <span style={{ fontSize: 14 }}>☆</span>, label: "Star" },
  ];
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <div style={{ minHeight: 260, display: "grid", placeItems: "end center", paddingBottom: 24 }}>
          <RadialMenu
            key={String(v.animate)}
            items={demoItems}
            size={v.size as "sm" | "md" | "lg"}
            radius={Number(v.radius)}
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
            animate={Boolean(v.animate)}
            aria-label="Tools"
          />
        </div>
      )}
      snippet={(v) =>
        `<RadialMenu size="${v.size}" radius={${Number(v.radius)}} items={[/* ... */]} ${snippetExtras(v)} />`
      }
    />
  );
}

function TooltipPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <Tooltip
          content="A small sketch bubble"
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <Button
            variant="outline"
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
            animate={Boolean(v.animate)}
          >
            Hover me
          </Button>
        </Tooltip>
      )}
      snippet={(v) =>
        `<Tooltip content="A small sketch bubble" ${snippetExtras(v)}>
  <Button variant="outline">Hover me</Button>
</Tooltip>`
      }
    />
  );
}

function SelectPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <LiveSelect
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        />
      )}
      snippet={(v) =>
        `<Select
  placeholder="Pick a tool"
  options={[
    { value: "pen", label: "Pen" },
    { value: "pencil", label: "Pencil" },
    { value: "brush", label: "Brush" },
  ]}
  ${snippetExtras(v)}
/>`
      }
    />
  );
}

function LiveSelect({
  roughness,
  seed,
  animate,
}: {
  roughness: number;
  seed?: number;
  animate: boolean;
}) {
  const [value, setValue] = useState("pen");
  return (
    <Select
      value={value}
      onValueChange={setValue}
      placeholder="Pick a tool"
      aria-label="Pick a tool"
      options={[
        { value: "pen", label: "Pen" },
        { value: "pencil", label: "Pencil" },
        { value: "brush", label: "Brush" },
      ]}
      roughness={roughness}
      seed={seed}
      animate={animate}
    />
  );
}

function SwitchPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <LiveSwitch
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        />
      )}
      snippet={(v) =>
        `<Switch label="Keep the wobble" defaultChecked ${snippetExtras(v)} />`
      }
    />
  );
}

function LiveSwitch({
  roughness,
  seed,
  animate,
}: {
  roughness: number;
  seed?: number;
  animate: boolean;
}) {
  const [checked, setChecked] = useState(true);
  return (
    <Switch
      label="Keep the wobble"
      checked={checked}
      onCheckedChange={setChecked}
      roughness={roughness}
      seed={seed}
      animate={animate}
    />
  );
}

function SliderPlayground() {
  const controls: Control[] = [
    ...sketchControls,
    {
      type: "select",
      key: "thumbShape",
      label: "Thumb",
      options: ["circle", "square"],
      defaultValue: "circle",
    },
  ];
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <div className="w-full max-w-sm">
          <LiveSlider
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
            thumbShape={v.thumbShape as "circle"}
          />
        </div>
      )}
      snippet={(v) =>
        `<Slider defaultValue={[40]} thumbShape="${v.thumbShape}" ${sketchSnippetProps(v)} />`
      }
    />
  );
}

function LiveSlider({
  roughness,
  seed,
  thumbShape,
}: {
  roughness: number;
  seed?: number;
  thumbShape: "circle" | "square";
}) {
  const [value, setValue] = useState([40]);
  return (
    <Slider
      value={value}
      onValueChange={setValue}
      thumbShape={thumbShape}
      roughness={roughness}
      seed={seed}
    />
  );
}

function TabsPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <div className="w-full max-w-md">
          <LiveTabs
            key={String(v.animate)}
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
            animate={Boolean(v.animate)}
          />
        </div>
      )}
      snippet={(v) =>
        `<Tabs defaultValue="ink" ${snippetExtras(v)}>
  <TabList>
    <Tab value="ink">Ink</Tab>
    <Tab value="wash">Wash</Tab>
  </TabList>
  <TabPanel value="ink">Real HTML under a sketch underline.</TabPanel>
  <TabPanel value="wash">Switching tabs redraws the rule.</TabPanel>
</Tabs>`
      }
    />
  );
}

function LiveTabs({
  roughness,
  seed,
  animate,
}: {
  roughness: number;
  seed?: number;
  animate: boolean;
}) {
  return (
    <Tabs
      defaultValue="ink"
      roughness={roughness}
      seed={seed}
      animate={animate}
    >
      <TabList>
        <Tab value="ink">Ink</Tab>
        <Tab value="wash">Wash</Tab>
        <Tab value="paper">Paper</Tab>
      </TabList>
      <TabPanel value="ink">Real HTML under a sketch underline.</TabPanel>
      <TabPanel value="wash">Switching tabs redraws the rule.</TabPanel>
      <TabPanel value="paper">Shuffle still wobbles every stroke.</TabPanel>
    </Tabs>
  );
}

function AccordionPlayground() {
  return (
    <Playground
      controls={sketchControls}
      render={(v) => (
        <div className="w-full max-w-md">
          <Accordion
            defaultValue="one"
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
          >
            <AccordionItem value="one">
              <AccordionTrigger>What is a seed?</AccordionTrigger>
              <AccordionContent>
                A number that locks the wobble. Omit it and Shuffle redraws every line.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="two">
              <AccordionTrigger>Is the text sketched?</AccordionTrigger>
              <AccordionContent>
                No. Text stays HTML so it stays crisp and selectable.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
      snippet={(v) =>
        `<Accordion defaultValue="one" ${sketchSnippetProps(v)}>
  <AccordionItem value="one">
    <AccordionTrigger>What is a seed?</AccordionTrigger>
    <AccordionContent>A number that locks the wobble.</AccordionContent>
  </AccordionItem>
</Accordion>`
      }
    />
  );
}

function TablePlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    {
      type: "toggle",
      key: "headerUnderline",
      label: "Header underline",
      defaultValue: true,
    },
  ]);
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <div className="w-full max-w-md">
          <Table
            key={String(v.animate)}
            headerUnderline={Boolean(v.headerUnderline)}
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
            animate={Boolean(v.animate)}
          >
            <TableHeader>
              <TableRow>
                <TableHead>Tool</TableHead>
                <TableHead>Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Pen</TableCell>
                <TableCell>0.5</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pencil</TableCell>
                <TableCell>2B</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brush</TableCell>
                <TableCell>6</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
      snippet={(v) =>
        `<Table headerUnderline={${Boolean(v.headerUnderline)}} ${snippetExtras(v)}>
  <TableHeader>
    <TableRow>
      <TableHead>Tool</TableHead>
      <TableHead>Weight</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Pen</TableCell>
      <TableCell>0.5</TableCell>
    </TableRow>
  </TableBody>
</Table>`
      }
    />
  );
}

function ToastPlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    {
      type: "select",
      key: "variant",
      label: "Variant",
      options: ["info", "warning", "error", "success"],
      defaultValue: "success",
    },
  ]);
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <LiveToast
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          variant={v.variant as "success"}
          animate={Boolean(v.animate)}
        />
      )}
      snippet={(v) =>
        `<Toast variant="${v.variant}" title="Saved" ${snippetExtras(v)}>
  The sketch is in the notebook.
</Toast>`
      }
    />
  );
}

function LiveToast({
  roughness,
  seed,
  variant,
  animate,
}: {
  roughness: number;
  seed?: number;
  variant: "info" | "warning" | "error" | "success";
  animate: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <ToastProvider duration={3200}>
      <div className="flex flex-col items-center gap-3">
        <Button
          variant="outline"
          roughness={roughness}
          seed={seed}
          animate={animate}
          onClick={() => setOpen(true)}
        >
          Show toast
        </Button>
        <Toast
          open={open}
          onOpenChange={setOpen}
          variant={variant}
          title="Saved"
          duration={3200}
          roughness={roughness}
          seed={seed}
          animate={animate}
        >
          The sketch is in the notebook.
        </Toast>
      </div>
    </ToastProvider>
  );
}

function AvatarPlayground() {
  const controls: Control[] = [
    ...sketchControls,
    {
      type: "select",
      key: "shape",
      label: "Shape",
      options: ["circle", "square"],
      defaultValue: "circle",
    },
    {
      type: "select",
      key: "status",
      label: "Status",
      options: ["online", "offline", "busy"],
      defaultValue: "online",
    },
  ];
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <Avatar
          fallback="AL"
          alt="Ada Lovelace"
          size={48}
          shape={v.shape as "circle"}
          status={v.status as "online"}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
        />
      )}
      snippet={(v) =>
        `<Avatar fallback="AL" shape="${v.shape}" status="${v.status}" ${sketchSnippetProps(v)} />`
      }
    />
  );
}

function PaginationPlayground() {
  return (
    <Playground
      controls={sketchControls}
      render={(v) => (
        <LivePagination roughness={Number(v.roughness)} seed={seedFrom(v)} />
      )}
      snippet={(v) =>
        `<Pagination page={2} count={8} onPageChange={setPage} ${sketchSnippetProps(v)} />`
      }
    />
  );
}

function LivePagination({
  roughness,
  seed,
}: {
  roughness: number;
  seed?: number;
}) {
  const [page, setPage] = useState(2);
  return (
    <Pagination
      page={page}
      count={8}
      onPageChange={setPage}
      roughness={roughness}
      seed={seed}
    />
  );
}

function BreadcrumbPlayground() {
  const controls: Control[] = [
    ...sketchControls,
    {
      type: "select",
      key: "separator",
      label: "Separator",
      options: ["slash", "chevron"],
      defaultValue: "slash",
    },
  ];
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <Breadcrumb
          separator={v.separator as "slash"}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
        >
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
          <BreadcrumbItem current>Breadcrumb</BreadcrumbItem>
        </Breadcrumb>
      )}
      snippet={(v) =>
        `<Breadcrumb separator="${v.separator}" ${sketchSnippetProps(v)}>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem current>Breadcrumb</BreadcrumbItem>
</Breadcrumb>`
      }
    />
  );
}

function SkeletonPlayground() {
  const controls: Control[] = [
    ...sketchControls,
    {
      type: "select",
      key: "variant",
      label: "Variant",
      options: ["text", "rect", "circle"],
      defaultValue: "rect",
    },
    { type: "toggle", key: "pulse", label: "Pulse", defaultValue: true },
  ];
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <div className="w-full max-w-xs">
          <Skeleton
            variant={v.variant as "rect"}
            pulse={Boolean(v.pulse)}
            height={v.variant === "circle" ? 48 : v.variant === "text" ? 16 : 72}
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
          />
        </div>
      )}
      snippet={(v) =>
        `<Skeleton variant="${v.variant}" pulse={${Boolean(v.pulse)}} ${sketchSnippetProps(v)} />`
      }
    />
  );
}

function StepperPlayground() {
  const controls: Control[] = [
    ...sketchControls,
    {
      type: "slider",
      key: "current",
      label: "Current",
      min: 0,
      max: 2,
      step: 1,
      defaultValue: 1,
    },
  ];
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <div className="w-full max-w-md">
          <Stepper
            steps={["Details", "Sketch", "Publish"]}
            current={Number(v.current)}
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
          />
        </div>
      )}
      snippet={(v) =>
        `<Stepper
  steps={["Details", "Sketch", "Publish"]}
  current={${Number(v.current)}}
  ${sketchSnippetProps(v)}
/>`
      }
    />
  );
}

function LabelPlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    { type: "toggle", key: "required", label: "Required", defaultValue: true },
  ]);
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <div className="flex flex-col gap-2">
          <Label
            key={String(v.animate)}
            htmlFor="playground-email"
            required={Boolean(v.required)}
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
            animate={Boolean(v.animate)}
          >
            Email
          </Label>
          <Input id="playground-email" placeholder="you@studio.dev" />
        </div>
      )}
      snippet={(v) =>
        `<Label htmlFor="email" required={${Boolean(v.required)}} ${snippetExtras(v)}>
  Email
</Label>
<Input id="email" placeholder="you@studio.dev" />`
      }
    />
  );
}

function CollapsiblePlayground() {
  return (
    <Playground
      controls={sketchControls}
      render={(v) => (
        <div className="w-full max-w-md">
          <Collapsible
            defaultOpen
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
          >
            <CollapsibleTrigger>What is a seed?</CollapsibleTrigger>
            <CollapsibleContent>
              A number that locks the wobble. Omit it and Shuffle redraws every line.
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
      snippet={(v) =>
        `<Collapsible defaultOpen ${sketchSnippetProps(v)}>
  <CollapsibleTrigger>What is a seed?</CollapsibleTrigger>
  <CollapsibleContent>A number that locks the wobble.</CollapsibleContent>
</Collapsible>`
      }
    />
  );
}

function PopoverPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <Popover
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-sm m-0">A sketchy floating panel anchored to its trigger.</p>
          </PopoverContent>
        </Popover>
      )}
      snippet={(v) =>
        `<Popover ${snippetExtras(v)}>
  <PopoverTrigger asChild>
    <Button variant="outline">Open popover</Button>
  </PopoverTrigger>
  <PopoverContent>A sketchy floating panel.</PopoverContent>
</Popover>`
      }
    />
  );
}

function DropdownMenuPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <DropdownMenu
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Tools</DropdownMenuLabel>
            <DropdownMenuItem>Pen</DropdownMenuItem>
            <DropdownMenuItem>Pencil</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Brush</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      snippet={(v) =>
        `<DropdownMenu ${snippetExtras(v)}>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Tools</DropdownMenuLabel>
    <DropdownMenuItem>Pen</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Brush</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`
      }
    />
  );
}

function DialogPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <Dialog
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <DialogTrigger asChild>
            <Button variant="outline">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename sketch</DialogTitle>
              <DialogDescription>Give this notebook page a new title.</DialogDescription>
            </DialogHeader>
            <Input defaultValue="Field notes" />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="primary">Save</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      snippet={(v) =>
        `<Dialog ${snippetExtras(v)}>
  <DialogTrigger asChild>
    <Button variant="outline">Open dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Rename sketch</DialogTitle>
      <DialogDescription>Give this notebook page a new title.</DialogDescription>
    </DialogHeader>
    <Input defaultValue="Field notes" />
    <DialogFooter>
      <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
      <DialogClose asChild><Button variant="primary">Save</Button></DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`
      }
    />
  );
}

function AlertDialogPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <AlertDialog
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <AlertDialogTrigger asChild>
            <Button variant="outline">Delete sketch</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this sketch?</AlertDialogTitle>
              <AlertDialogDescription>
                This can&apos;t be undone. The page and its history are gone for good.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      snippet={(v) =>
        `<AlertDialog ${snippetExtras(v)}>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Delete sketch</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this sketch?</AlertDialogTitle>
      <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`
      }
    />
  );
}

const COMMAND_TOOLS = ["Pen", "Pencil", "Brush", "Eraser", "Ruler"];

function CommandPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <div className="w-full max-w-sm">
          <Command
            key={String(v.animate)}
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
            animate={Boolean(v.animate)}
          >
            <CommandInput placeholder="Search tools…" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup>
                {COMMAND_TOOLS.map((tool) => (
                  <CommandItem key={tool} value={tool}>
                    {tool}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
      snippet={(v) =>
        `<Command ${snippetExtras(v)}>
  <CommandInput placeholder="Search tools…" />
  <CommandList>
    <CommandEmpty>No results.</CommandEmpty>
    <CommandGroup>
      <CommandItem value="Pen">Pen</CommandItem>
      <CommandItem value="Pencil">Pencil</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`
      }
    />
  );
}

function ComboboxPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <div className="w-full max-w-sm">
          <LiveCombobox
            key={String(v.animate)}
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
            animate={Boolean(v.animate)}
          />
        </div>
      )}
      snippet={(v) =>
        `<Combobox
  options={[
    { value: "pen", label: "Pen" },
    { value: "pencil", label: "Pencil" },
    { value: "brush", label: "Brush" },
  ]}
  placeholder="Select a tool…"
  ${snippetExtras(v)}
/>`
      }
    />
  );
}

function LiveCombobox({
  roughness,
  seed,
  animate,
}: {
  roughness: number;
  seed?: number;
  animate: boolean;
}) {
  const [value, setValue] = useState("pencil");
  return (
    <Combobox
      options={[
        { value: "pen", label: "Pen" },
        { value: "pencil", label: "Pencil" },
        { value: "brush", label: "Brush" },
        { value: "ruler", label: "Ruler" },
      ]}
      value={value}
      onValueChange={setValue}
      placeholder="Select a tool…"
      roughness={roughness}
      seed={seed}
      animate={animate}
    />
  );
}

function KbdPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <p className="text-sm m-0">
          Press <Kbd roughness={Number(v.roughness)} seed={seedFrom(v)} animate={Boolean(v.animate)}>⌘</Kbd>{" "}
          <Kbd roughness={Number(v.roughness)} seed={seedFrom(v)} animate={Boolean(v.animate)}>K</Kbd> to search
        </p>
      )}
      snippet={(v) => `<Kbd ${snippetExtras(v)}>⌘</Kbd> <Kbd ${snippetExtras(v)}>K</Kbd>`}
    />
  );
}

function SpinnerPlayground() {
  return (
    <Playground
      controls={withAnimate([
        ...sketchControls,
        {
          type: "select",
          key: "size",
          label: "Size",
          options: ["sm", "md", "lg"],
          defaultValue: "md",
        },
      ])}
      render={(v) => (
        <Spinner
          key={String(v.animate)}
          size={v.size as "sm" | "md" | "lg"}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        />
      )}
      snippet={(v) => `<Spinner size="${v.size}" ${snippetExtras(v)} />`}
    />
  );
}

function TogglePlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <Toggle
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
          aria-label="Bold"
        >
          B
        </Toggle>
      )}
      snippet={(v) => `<Toggle ${snippetExtras(v)} aria-label="Bold">B</Toggle>`}
    />
  );
}

function ToggleGroupPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <ToggleGroup
          key={String(v.animate)}
          type="single"
          defaultValue="center"
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
      )}
      snippet={(v) =>
        `<ToggleGroup type="single" defaultValue="center" ${snippetExtras(v)}>
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
</ToggleGroup>`
      }
    />
  );
}

function InputGroupPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <InputGroup
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <InputGroupAddon>@</InputGroupAddon>
          <InputGroupInput placeholder="username" />
        </InputGroup>
      )}
      snippet={(v) =>
        `<InputGroup ${snippetExtras(v)}>
  <InputGroupAddon>@</InputGroupAddon>
  <InputGroupInput placeholder="username" />
</InputGroup>`
      }
    />
  );
}

function InputOtpPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <InputOTP
          key={String(v.animate)}
          maxLength={6}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      )}
      snippet={(v) =>
        `<InputOTP maxLength={6} ${snippetExtras(v)}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
  </InputOTPGroup>
</InputOTP>`
      }
    />
  );
}

function ScrollAreaPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <ScrollArea
          key={String(v.animate)}
          style={{ height: 160, width: 280 }}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <ScrollAreaViewport style={{ padding: 12 }}>
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i} className="text-sm m-0 mb-2">
                Sketchy scroll line {i + 1}
              </p>
            ))}
          </ScrollAreaViewport>
          <ScrollBar />
        </ScrollArea>
      )}
      snippet={(v) =>
        `<ScrollArea style={{ height: 160 }} ${snippetExtras(v)}>
  <ScrollAreaViewport>...</ScrollAreaViewport>
  <ScrollBar />
</ScrollArea>`
      }
    />
  );
}

function ResizablePlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <ResizablePanelGroup
          key={String(v.animate)}
          direction="horizontal"
          style={{ height: 160, maxWidth: 420 }}
        >
          <ResizablePanel defaultSize={50}>
            <div className="p-3 text-sm">Panel A</div>
          </ResizablePanel>
          <ResizableHandle
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
          />
          <ResizablePanel defaultSize={50}>
            <div className="p-3 text-sm">Panel B</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
      snippet={() =>
        `<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={50}>A</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={50}>B</ResizablePanel>
</ResizablePanelGroup>`
      }
    />
  );
}

function HoverCardPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <HoverCard
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <HoverCardTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm m-0">Sketch card appears on hover, not click.</p>
          </HoverCardContent>
        </HoverCard>
      )}
      snippet={(v) =>
        `<HoverCard ${snippetExtras(v)}>
  <HoverCardTrigger asChild>
    <Button variant="outline">Hover me</Button>
  </HoverCardTrigger>
  <HoverCardContent>...</HoverCardContent>
</HoverCard>`
      }
    />
  );
}

function ContextMenuPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <ContextMenu
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <ContextMenuTrigger asChild>
            <Button variant="outline">Right-click here</Button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Back</ContextMenuItem>
            <ContextMenuItem>Forward</ContextMenuItem>
            <ContextMenuItem>Reload</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )}
      snippet={(v) =>
        `<ContextMenu ${snippetExtras(v)}>
  <ContextMenuTrigger asChild>
    <Button variant="outline">Right-click</Button>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Back</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`
      }
    />
  );
}

function NavigationMenuPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <NavigationMenu
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Product</NavigationMenuTrigger>
              <NavigationMenuContent>
                <p className="text-sm m-0">Features, pricing, changelog.</p>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Company</NavigationMenuTrigger>
              <NavigationMenuContent>
                <p className="text-sm m-0">About, careers, contact.</p>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
      snippet={(v) =>
        `<NavigationMenu ${snippetExtras(v)}>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Product</NavigationMenuTrigger>
      <NavigationMenuContent>...</NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`
      }
    />
  );
}

function MenubarPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <Menubar
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New</MenubarItem>
              <MenubarItem>Open</MenubarItem>
              <MenubarItem>Save</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Undo</MenubarItem>
              <MenubarItem>Redo</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )}
      snippet={(v) =>
        `<Menubar ${snippetExtras(v)}>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`
      }
    />
  );
}

function SheetPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <Sheet
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <SheetTrigger asChild>
            <Button variant="outline">Open sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sketch sheet</SheetTitle>
              <SheetDescription>Slides in from the right edge.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
      snippet={(v) =>
        `<Sheet ${snippetExtras(v)}>
  <SheetTrigger asChild>
    <Button variant="outline">Open sheet</Button>
  </SheetTrigger>
  <SheetContent>...</SheetContent>
</Sheet>`
      }
    />
  );
}

function DrawerPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <Drawer
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Bottom drawer</DrawerTitle>
              <DrawerDescription>Includes a sketchy pull handle.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Continue</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
      snippet={(v) =>
        `<Drawer ${snippetExtras(v)}>
  <DrawerTrigger asChild>
    <Button variant="outline">Open drawer</Button>
  </DrawerTrigger>
  <DrawerContent>...</DrawerContent>
</Drawer>`
      }
    />
  );
}

function AspectRatioPlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    { type: "toggle", key: "bordered", label: "Bordered", defaultValue: true },
    {
      type: "select",
      key: "ratio",
      label: "Ratio",
      defaultValue: "16/9",
      options: ["16/9", "4/3", "1"],
    },
  ]);
  return (
    <Playground
      controls={controls}
      render={(v) => {
        const ratio =
          v.ratio === "4/3" ? 4 / 3 : v.ratio === "1" ? 1 : 16 / 9;
        return (
          <AspectRatio
            key={`${v.animate}-${v.bordered}-${v.ratio}`}
            ratio={ratio}
            bordered={Boolean(v.bordered)}
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
            animate={Boolean(v.animate)}
            style={{ maxWidth: 420 }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#d7e3d4",
                fontFamily: "inherit",
              }}
            >
              Media slot
            </div>
          </AspectRatio>
        );
      }}
      snippet={(v) =>
        `<AspectRatio ratio={16 / 9} bordered ${snippetExtras(v)}>
  <img src="..." alt="" />
</AspectRatio>`
      }
    />
  );
}

function NativeSelectPlayground() {
  const options = [
    { value: "draft", label: "Draft" },
    { value: "review", label: "In review" },
    { value: "done", label: "Done" },
  ];
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <NativeSelect
          key={String(v.animate)}
          defaultValue="draft"
          options={options}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
          style={{ maxWidth: 280 }}
        />
      )}
      snippet={(v) =>
        `<NativeSelect options={options} defaultValue="draft" ${snippetExtras(v)} />`
      }
    />
  );
}

function EmptyPlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    { type: "toggle", key: "bordered", label: "Bordered", defaultValue: true },
  ]);
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <Empty
          key={String(v.animate)}
          bordered={Boolean(v.bordered)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          animate={Boolean(v.animate)}
        >
          <EmptyMedia>
            <span style={{ fontSize: 36 }}>✎</span>
          </EmptyMedia>
          <EmptyTitle>No sketches yet</EmptyTitle>
          <EmptyDescription>
            Start a new drawing or import from your notebook.
          </EmptyDescription>
          <EmptyAction>
            <Button size="sm">Create</Button>
          </EmptyAction>
        </Empty>
      )}
      snippet={(v) =>
        `<Empty ${snippetExtras(v)}>
  <EmptyTitle>No sketches yet</EmptyTitle>
  <EmptyDescription>...</EmptyDescription>
</Empty>`
      }
    />
  );
}

function FieldPlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    { type: "toggle", key: "invalid", label: "Invalid", defaultValue: false },
  ]);
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <Field
          invalid={Boolean(v.invalid)}
          error={v.invalid ? "Enter a valid email." : undefined}
          style={{ maxWidth: 320 }}
        >
          <FieldLabel required>Email</FieldLabel>
          <FieldControl>
            <Input placeholder="you@studio.dev" />
          </FieldControl>
          <FieldDescription>We will never share your address.</FieldDescription>
          <FieldError />
        </Field>
      )}
      snippet={() =>
        `<Field invalid error="Enter a valid email.">
  <FieldLabel required>Email</FieldLabel>
  <FieldControl>
    <Input placeholder="you@studio.dev" />
  </FieldControl>
  <FieldDescription>Helper text</FieldDescription>
  <FieldError />
</Field>`
      }
    />
  );
}

function TypographyPlayground() {
  const controls: Control[] = withAnimate([
    ...sketchControls,
    {
      type: "select",
      key: "accent",
      label: "Heading accent",
      defaultValue: "underline",
      options: ["none", "underline", "highlight"],
    },
  ]);
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <div className="flex flex-col gap-4 max-w-md">
          <Heading
            key={String(v.animate)}
            level={2}
            accent={v.accent as "none" | "underline" | "highlight"}
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
            animate={Boolean(v.animate)}
          >
            Sketch journal
          </Heading>
          <Text variant="lead">Lead paragraph with doodle typography.</Text>
          <Text>
            Body copy with an <Highlight seed={seedFrom(v)}>inline highlight</Highlight> and{" "}
            <InlineCode>inline code</InlineCode>.
          </Text>
          <Blockquote roughness={Number(v.roughness)} seed={seedFrom(v)} animate={Boolean(v.animate)}>
            Ideas look better when the border wobbles.
          </Blockquote>
        </div>
      )}
      snippet={(v) =>
        `<Heading level={2} accent="underline" ${snippetExtras(v)}>
  Sketch journal
</Heading>
<Text variant="lead">...</Text>`
      }
    />
  );
}

function SidebarPlayground() {
  return (
    <Playground
      controls={withAnimate(sketchControls)}
      render={(v) => (
        <SidebarProvider
          key={String(v.animate)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
        >
          <SidebarLayout style={{ border: "1px solid #1f1d1a22", borderRadius: 8 }}>
            <Sidebar>
              <SidebarHeader>
                <SidebarTrigger />
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup title="Workspace">
                  <SidebarItem active>Home</SidebarItem>
                  <SidebarItem>Projects</SidebarItem>
                  <SidebarItem>Archive</SidebarItem>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter>
                <SidebarItem>Settings</SidebarItem>
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <Text>Main content beside the sketch sidebar.</Text>
            </SidebarInset>
          </SidebarLayout>
        </SidebarProvider>
      )}
      snippet={(v) =>
        `<SidebarProvider ${snippetExtras(v)}>
  <SidebarLayout>
    <Sidebar>...</Sidebar>
    <SidebarInset>...</SidebarInset>
  </SidebarLayout>
</SidebarProvider>`
      }
    />
  );
}

function CarouselPlayground() {
  const slides = [1, 2, 3, 4, 5];
  const controls: Control[] = withAnimate([
    ...sketchControls,
    { type: "toggle", key: "bordered", label: "Bordered", defaultValue: false },
  ]);
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <div style={{ width: "100%", padding: "4px 48px" }}>
          <div style={{ maxWidth: 240, margin: "0 auto" }}>
            <Carousel
              key={String(v.animate)}
              bordered={Boolean(v.bordered)}
              roughness={Number(v.roughness)}
              seed={seedFrom(v)}
              animate={Boolean(v.animate)}
            >
              <CarouselContent>
                {slides.map((n) => (
                  <CarouselItem key={n}>
                    <Card
                      roughness={Number(v.roughness)}
                      seed={seedFrom(v)}
                      animate={Boolean(v.animate)}
                    >
                      <div
                        style={{
                          aspectRatio: "1 / 1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 48,
                          fontWeight: 600,
                          lineHeight: 1,
                        }}
                      >
                        {n}
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      )}
      snippet={(v) =>
        `<Carousel ${snippetExtras(v)}>
  <CarouselContent>
    <CarouselItem>
      <Card>1</Card>
    </CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`
      }
    />
  );
}
