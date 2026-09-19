"use client";

import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
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
  useSketchSeed,
} from "doodleui-react";

function ShuffleButton() {
  const { shuffle } = useSketchSeed();
  return (
    <Button variant="outline" onClick={shuffle}>
      Shuffle
    </Button>
  );
}

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "48px 24px 64px",
        display: "grid",
        gap: 24,
      }}
    >
      <header style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <Badge variant="accent">Next.js App Router</Badge>
          <Badge variant="outline">doodleui-react</Badge>
        </div>
        <h1 style={{ margin: 0, fontSize: "2.5rem", lineHeight: 1.1 }}>
          Sketch starter
        </h1>
        <p style={{ margin: 0, color: "var(--mute)", maxWidth: "46ch", lineHeight: 1.5 }}>
          App Router template with doodleui-react. Shuffle redraws every unlocked
          stroke. Dialogs and tabs work out of the box.
        </p>
        <div>
          <ShuffleButton />
        </div>
      </header>

      <Card title="Notebook" shadow>
        <div style={{ display: "grid", gap: 20 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>

          <Input label="Project name" placeholder="Field notes" />

          <Tabs defaultValue="ink">
            <TabList>
              <Tab value="ink">Ink</Tab>
              <Tab value="wash">Wash</Tab>
              <Tab value="paper">Paper</Tab>
            </TabList>
            <TabPanel value="ink">Real HTML under a sketch underline.</TabPanel>
            <TabPanel value="wash">Switching tabs redraws the rule.</TabPanel>
            <TabPanel value="paper">Shuffle still wobbles every stroke.</TabPanel>
          </Tabs>

          <Table headerUnderline>
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

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename sketch</DialogTitle>
                <DialogDescription>
                  Give this notebook page a new title.
                </DialogDescription>
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
        </div>
      </Card>
    </main>
  );
}
