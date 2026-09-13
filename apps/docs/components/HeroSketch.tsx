"use client";

import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Progress,
} from "doodle-ui";

export function HeroSketch() {
  const [checked, setChecked] = useState(true);

  return (
    <Card
      title={
        <span className="flex items-center justify-between gap-3">
          Scratch sheet
          <Badge variant="accent">live</Badge>
        </span>
      }
      footer="Every stroke is SVG. The type is still HTML."
      style={{ width: "100%" }}
    >
      <div className="grid gap-4">
        <Input label="Title" defaultValue="Coastal path, dusk" />
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Save</Button>
          <Button size="sm" variant="outline">
            Export
          </Button>
          <Button size="sm" variant="ghost">
            Clear
          </Button>
        </div>
        <Checkbox
          label="Ink on paper"
          checked={checked}
          onCheckedChange={(value) => setChecked(value === true)}
        />
        <Progress value={68} />
        <Alert variant="success" title="Looks right">
          Shuffle the page to redraw every line without touching the copy.
        </Alert>
      </div>
    </Card>
  );
}
