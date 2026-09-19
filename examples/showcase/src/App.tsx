import { useState, createContext, useContext } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
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
  Button,
  Card,
  Checkbox,
  Combobox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Empty,
  EmptyAction,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  Kbd,
  Modal,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Slider,
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
  Textarea,
  Tooltip,
  useSketchSeed,
} from "doodleui-react";

interface SketchControls {
  roughness: number;
  animate: boolean;
}

const SketchCtx = createContext<SketchControls>({
  roughness: 1.5,
  animate: true,
});

function useSketch() {
  return useContext(SketchCtx);
}

function ShuffleButton() {
  const { shuffle } = useSketchSeed();
  return (
    <Button variant="outline" size="sm" onClick={shuffle}>
      Shuffle
    </Button>
  );
}

function FormsCard() {
  const { roughness, animate } = useSketch();
  const [checked, setChecked] = useState(true);
  const [notify, setNotify] = useState(true);
  const [tool, setTool] = useState("pen");
  const [combo, setCombo] = useState("pencil");
  const [slider, setSlider] = useState([40]);

  return (
    <Card title="Forms" shadow={false} roughness={roughness} animate={animate}>
      <div className="stack">
        <Field>
          <FieldLabel required>Email</FieldLabel>
          <FieldControl>
            <Input
              placeholder="you@studio.dev"
              roughness={roughness}
              animate={animate}
            />
          </FieldControl>
          <FieldDescription>We never share your address.</FieldDescription>
          <FieldError />
        </Field>

        <Textarea
          label="Notes"
          placeholder="Scratch something down"
          rows={3}
          roughness={roughness}
          animate={animate}
        />

        <Select
          value={tool}
          onValueChange={setTool}
          placeholder="Pick a tool"
          aria-label="Pick a tool"
          options={[
            { value: "pen", label: "Pen" },
            { value: "pencil", label: "Pencil" },
            { value: "brush", label: "Brush" },
          ]}
          roughness={roughness}
          animate={animate}
        />

        <Combobox
          options={[
            { value: "pen", label: "Pen" },
            { value: "pencil", label: "Pencil" },
            { value: "brush", label: "Brush" },
            { value: "ruler", label: "Ruler" },
          ]}
          value={combo}
          onValueChange={setCombo}
          placeholder="Select a tool…"
          roughness={roughness}
          animate={animate}
        />

        <RadioGroup defaultValue="pen" orientation="horizontal">
          <Radio value="pen" label="Pen" roughness={roughness} animate={animate} />
          <Radio value="pencil" label="Pencil" roughness={roughness} animate={animate} />
          <Radio value="marker" label="Marker" roughness={roughness} animate={animate} />
        </RadioGroup>

        <div className="row">
          <Checkbox
            label="Ink on paper"
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
            roughness={roughness}
            animate={animate}
          />
          <Switch
            label="Notify"
            checked={notify}
            onCheckedChange={setNotify}
            roughness={roughness}
            animate={animate}
          />
        </div>

        <Slider
          value={slider}
          onValueChange={setSlider}
          roughness={roughness}
        />
      </div>
    </Card>
  );
}

function OverlaysCard() {
  const { roughness, animate } = useSketch();

  return (
    <Card title="Overlays" shadow={false} roughness={roughness} animate={animate}>
      <div className="stack">
        <div className="row">
          <Dialog roughness={roughness} animate={animate}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" roughness={roughness} animate={animate}>
                Dialog
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename sketch</DialogTitle>
                <DialogDescription>Give this page a new title.</DialogDescription>
              </DialogHeader>
              <Input defaultValue="Field notes" />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Save</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog roughness={roughness} animate={animate}>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" roughness={roughness} animate={animate}>
                Alert
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Discard this sketch?</AlertDialogTitle>
                <AlertDialogDescription>
                  This can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Discard</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Modal
            title="Scratch pad"
            description="Radix focus trap with a sketch frame."
            roughness={roughness}
            animate={animate}
            trigger={
              <Button size="sm" variant="outline" roughness={roughness} animate={animate}>
                Modal
              </Button>
            }
          >
            <p style={{ margin: 0, fontSize: 14 }}>Content stays crisp HTML.</p>
          </Modal>
        </div>

        <div className="row">
          <Sheet roughness={roughness} animate={animate}>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" roughness={roughness} animate={animate}>
                Sheet
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sketch sheet</SheetTitle>
                <SheetDescription>Slides in from the edge.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <Drawer roughness={roughness} animate={animate}>
            <DrawerTrigger asChild>
              <Button size="sm" variant="outline" roughness={roughness} animate={animate}>
                Drawer
              </Button>
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

          <Popover roughness={roughness} animate={animate}>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" roughness={roughness} animate={animate}>
                Popover
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <p style={{ margin: 0, fontSize: 14 }}>Floating sketch panel.</p>
            </PopoverContent>
          </Popover>

          <Tooltip content="A small sketch bubble" roughness={roughness} animate={animate}>
            <Button size="sm" variant="ghost" roughness={roughness} animate={animate}>
              Tooltip
            </Button>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
}

function NavigationCard() {
  const { roughness, animate } = useSketch();
  const [page, setPage] = useState(2);

  return (
    <Card title="Navigation" shadow={false} roughness={roughness} animate={animate}>
      <div className="stack">
        <Breadcrumb roughness={roughness}>
          <BreadcrumbItem href="#">Home</BreadcrumbItem>
          <BreadcrumbItem href="#">Docs</BreadcrumbItem>
          <BreadcrumbItem current>Showcase</BreadcrumbItem>
        </Breadcrumb>

        <Tabs defaultValue="ink" roughness={roughness} animate={animate}>
          <TabList>
            <Tab value="ink">Ink</Tab>
            <Tab value="wash">Wash</Tab>
            <Tab value="paper">Paper</Tab>
          </TabList>
          <TabPanel value="ink">Real HTML under a sketch underline.</TabPanel>
          <TabPanel value="wash">Switching tabs redraws the rule.</TabPanel>
          <TabPanel value="paper">Shuffle still wobbles every stroke.</TabPanel>
        </Tabs>

        <Accordion defaultValue="one" roughness={roughness}>
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

        <Pagination
          page={page}
          count={8}
          onPageChange={setPage}
          roughness={roughness}
        />
      </div>
    </Card>
  );
}

function DisplayCard() {
  const { roughness, animate } = useSketch();

  return (
    <Card title="Display" shadow={false} roughness={roughness} animate={animate}>
      <div className="stack">
        <div className="row">
          <Badge roughness={roughness} animate={animate}>
            Default
          </Badge>
          <Badge variant="accent" roughness={roughness} animate={animate}>
            Accent
          </Badge>
          <Badge variant="outline" roughness={roughness} animate={animate}>
            Outline
          </Badge>
          <Avatar fallback="DU" size={40} status="online" roughness={roughness} />
        </div>

        <Alert variant="info" title="Heads up" roughness={roughness} animate={animate}>
          Callouts keep a color-coded stroke and a light wash fill.
        </Alert>

        <Progress value={62} roughness={roughness} animate={animate} />

        <Skeleton variant="rect" height={48} pulse roughness={roughness} />

        <p style={{ margin: 0, fontSize: 14 }}>
          Press <Kbd roughness={roughness} animate={animate}>⌘</Kbd>{" "}
          <Kbd roughness={roughness} animate={animate}>K</Kbd> to search
        </p>

        <Table headerUnderline roughness={roughness} animate={animate}>
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

        <Empty bordered roughness={roughness} animate={animate}>
          <EmptyMedia>
            <span style={{ fontSize: 28 }}>✎</span>
          </EmptyMedia>
          <EmptyTitle>No sketches yet</EmptyTitle>
          <EmptyDescription>Start a new drawing or import from your notebook.</EmptyDescription>
          <EmptyAction>
            <Button size="sm">Create</Button>
          </EmptyAction>
        </Empty>
      </div>
    </Card>
  );
}

export default function App() {
  const [roughness, setRoughness] = useState(1.5);
  const [animate, setAnimate] = useState(true);

  return (
    <SketchCtx.Provider value={{ roughness, animate }}>
      <header className="toolbar">
        <div>
          <strong style={{ fontFamily: '"Patrick Hand", cursive', fontSize: 22 }}>
            doodle-ui showcase
          </strong>
          <span style={{ marginLeft: 10, color: "var(--mute)", fontSize: 13 }}>
            Kitchen sink playground
          </span>
        </div>
        <div className="toolbar-controls">
          <label>
            Roughness
            <input
              type="range"
              min={0}
              max={3.5}
              step={0.1}
              value={roughness}
              onChange={(e) => setRoughness(Number(e.target.value))}
            />
            <span style={{ fontFamily: "monospace", minWidth: 28 }}>
              {roughness.toFixed(1)}
            </span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={animate}
              onChange={(e) => setAnimate(e.target.checked)}
            />
            Animate
          </label>
          <ShuffleButton />
        </div>
      </header>

      <div className="grid">
        <FormsCard />
        <OverlaysCard />
        <NavigationCard />
        <DisplayCard />
      </div>
    </SketchCtx.Provider>
  );
}
