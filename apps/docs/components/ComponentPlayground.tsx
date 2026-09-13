"use client";

import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Input,
  Modal,
  Progress,
  Radio,
  RadioGroup,
  Textarea,
  Tooltip,
} from "doodleui-react";
import type { ComponentSlug } from "@/lib/nav";
import {
  Playground,
  sketchControls,
  sketchSnippetProps,
  type Control,
} from "@/components/Playground";

const LOCKED_SEED = 42;

function seedFrom(values: Record<string, unknown>): number | undefined {
  return values.lockSeed ? LOCKED_SEED : undefined;
}

export function ComponentPlayground({ name }: { name: ComponentSlug }) {
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
    case "tooltip":
      return <TooltipPlayground />;
    default:
      return null;
  }
}

function ButtonPlayground() {
  const controls: Control[] = [
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
  ];
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <Button
          variant={v.variant as "primary"}
          size={v.size as "md"}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
        >
          Draw me
        </Button>
      )}
      snippet={(v) =>
        `<Button variant="${v.variant}" size="${v.size}" ${sketchSnippetProps(v)}>
  Draw me
</Button>`
      }
    />
  );
}

function InputPlayground() {
  return (
    <Playground
      controls={sketchControls}
      render={(v) => (
        <div className="w-full max-w-sm">
          <Input
            label="Email"
            placeholder="you@studio.dev"
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
          />
        </div>
      )}
      snippet={(v) =>
        `<Input label="Email" placeholder="you@studio.dev" ${sketchSnippetProps(v)} />`
      }
    />
  );
}

function TextareaPlayground() {
  return (
    <Playground
      controls={sketchControls}
      render={(v) => (
        <div className="w-full max-w-sm">
          <Textarea
            label="Note"
            placeholder="Scratch something down"
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
          />
        </div>
      )}
      snippet={(v) =>
        `<Textarea label="Note" placeholder="Scratch something down" ${sketchSnippetProps(v)} />`
      }
    />
  );
}

function CheckboxPlayground() {
  return (
    <Playground
      controls={sketchControls}
      render={(v) => (
        <LiveCheckbox roughness={Number(v.roughness)} seed={seedFrom(v)} />
      )}
      snippet={(v) =>
        `<Checkbox label="Keep the wobble" defaultChecked ${sketchSnippetProps(v)} />`
      }
    />
  );
}

function LiveCheckbox({
  roughness,
  seed,
}: {
  roughness: number;
  seed?: number;
}) {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox
      label="Keep the wobble"
      checked={checked}
      onCheckedChange={(value) => setChecked(value === true)}
      roughness={roughness}
      seed={seed}
    />
  );
}

function RadioPlayground() {
  return (
    <Playground
      controls={sketchControls}
      render={(v) => (
        <LiveRadio roughness={Number(v.roughness)} seed={seedFrom(v)} />
      )}
      snippet={(v) =>
        `<RadioGroup defaultValue="pen">
  <Radio value="pen" label="Pen" ${sketchSnippetProps(v)} />
  <Radio value="pencil" label="Pencil" ${sketchSnippetProps(v)} />
</RadioGroup>`
      }
    />
  );
}

function LiveRadio({ roughness, seed }: { roughness: number; seed?: number }) {
  const [value, setValue] = useState("pen");
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <Radio value="pen" label="Pen" roughness={roughness} seed={seed} />
      <Radio value="pencil" label="Pencil" roughness={roughness} seed={seed} />
    </RadioGroup>
  );
}

function CardPlayground() {
  const controls: Control[] = [
    ...sketchControls,
    { type: "toggle", key: "shadow", label: "Shadow", defaultValue: true },
  ];
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <Card
          title="Field notes"
          shadow={Boolean(v.shadow)}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          style={{ width: 280 }}
        >
          A container with a sketch border. Text inside stays HTML.
        </Card>
      )}
      snippet={(v) =>
        `<Card title="Field notes" shadow={${Boolean(v.shadow)}} ${sketchSnippetProps(v)}>
  A container with a sketch border.
</Card>`
      }
    />
  );
}

function BadgePlayground() {
  const controls: Control[] = [
    ...sketchControls,
    {
      type: "select",
      key: "variant",
      label: "Variant",
      options: ["default", "accent", "outline"],
      defaultValue: "accent",
    },
  ];
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <Badge
          variant={v.variant as "accent"}
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
        >
          sketch
        </Badge>
      )}
      snippet={(v) =>
        `<Badge variant="${v.variant}" ${sketchSnippetProps(v)}>sketch</Badge>`
      }
    />
  );
}

function AlertPlayground() {
  const controls: Control[] = [
    ...sketchControls,
    {
      type: "select",
      key: "variant",
      label: "Variant",
      options: ["info", "warning", "error", "success"],
      defaultValue: "info",
    },
  ];
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <Alert
          variant={v.variant as "info"}
          title="Heads up"
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          style={{ maxWidth: 360 }}
        >
          Callouts keep a color-coded stroke and a light wash fill.
        </Alert>
      )}
      snippet={(v) =>
        `<Alert variant="${v.variant}" title="Heads up" ${sketchSnippetProps(v)}>
  Callouts keep a color-coded stroke.
</Alert>`
      }
    />
  );
}

function ModalPlayground() {
  return (
    <Playground
      controls={sketchControls}
      render={(v) => (
        <Modal
          title="Scratch pad"
          description="Radix handles focus, Escape, and ARIA. doodle-ui draws the frame."
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
          trigger={<Button roughness={Number(v.roughness)} seed={seedFrom(v)}>Open modal</Button>}
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
  ${sketchSnippetProps(v)}
>
  Content
</Modal>`
      }
    />
  );
}

function DividerPlayground() {
  const controls: Control[] = [
    ...sketchControls,
    {
      type: "select",
      key: "orientation",
      label: "Orientation",
      options: ["horizontal", "vertical"],
      defaultValue: "horizontal",
    },
  ];
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
            orientation={v.orientation as "horizontal"}
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
          />
        </div>
      )}
      snippet={(v) =>
        `<Divider orientation="${v.orientation}" ${sketchSnippetProps(v)} />`
      }
    />
  );
}

function ProgressPlayground() {
  const controls: Control[] = [
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
  ];
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <div className="w-full max-w-sm">
          <Progress
            value={Number(v.value)}
            roughness={Number(v.roughness)}
            seed={seedFrom(v)}
          />
        </div>
      )}
      snippet={(v) =>
        `<Progress value={${Number(v.value)}} ${sketchSnippetProps(v)} />`
      }
    />
  );
}

function TooltipPlayground() {
  return (
    <Playground
      controls={sketchControls}
      render={(v) => (
        <Tooltip
          content="A small sketch bubble"
          roughness={Number(v.roughness)}
          seed={seedFrom(v)}
        >
          <Button variant="outline" roughness={Number(v.roughness)} seed={seedFrom(v)}>
            Hover me
          </Button>
        </Tooltip>
      )}
      snippet={(v) =>
        `<Tooltip content="A small sketch bubble" ${sketchSnippetProps(v)}>
  <Button variant="outline">Hover me</Button>
</Tooltip>`
      }
    />
  );
}
