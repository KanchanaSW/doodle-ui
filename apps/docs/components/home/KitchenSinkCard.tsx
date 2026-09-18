"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Radio,
  RadioGroup,
  Switch,
  Textarea,
} from "doodleui-react";

export function KitchenSinkCard() {
  const [checked, setChecked] = useState(true);
  const [notify, setNotify] = useState(true);

  return (
    <Card title="Components" shadow={false} style={{ width: "100%" }}>
      <div className="grid gap-4">
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
        </div>

        <Input label="Search" placeholder="Search components…" />

        <Textarea
          label="Notes"
          placeholder="Write a quick note…"
          rows={3}
          defaultValue=""
        />

        <div className="flex flex-wrap items-center gap-2">
          <Badge>Badge</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>

        <RadioGroup defaultValue="pen" orientation="horizontal">
          <Radio value="pen" label="Pen" />
          <Radio value="pencil" label="Pencil" />
          <Radio value="marker" label="Marker" />
        </RadioGroup>

        <div className="flex flex-wrap items-center gap-4">
          <Checkbox
            label="Ink on paper"
            checked={checked}
            onCheckedChange={(value) => setChecked(value === true)}
          />
          <Switch
            label="Notify"
            checked={notify}
            onCheckedChange={setNotify}
          />
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              Show Alert Dialog
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Discard this sketch?</AlertDialogTitle>
              <AlertDialogDescription>
                This can&apos;t be undone. Your rough strokes will be gone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Discard</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}
