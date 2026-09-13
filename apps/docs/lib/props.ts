export interface PropRow {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export const sharedSketchProps: PropRow[] = [
  {
    name: "roughness",
    type: "number",
    defaultValue: "1.5",
    description: "How wobbly the stroke is. 0 is almost geometric. 3+ is messy.",
  },
  {
    name: "seed",
    type: "number",
    defaultValue: "provider / random",
    description:
      "Locks the sketch. Omit to follow SketchSeedProvider (Shuffle) or a mount-time random seed.",
  },
  {
    name: "sketchColor",
    type: "string",
    defaultValue: "#1f1d1a",
    description: "Stroke color. Also tints primary/accent fills where relevant.",
  },
  {
    name: "className",
    type: "string",
    defaultValue: "undefined",
    description: "Passed through to the root element.",
  },
  {
    name: "style",
    type: "CSSProperties",
    defaultValue: "undefined",
    description: "Passed through to the root element.",
  },
];

export const buttonProps: PropRow[] = [
  {
    name: "variant",
    type: '"primary" | "secondary" | "outline" | "ghost"',
    defaultValue: '"primary"',
    description: "Fill treatment. Ghost hides the stroke until hover.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    description: "Padding and type size.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Native disabled state. Lowers opacity.",
  },
  ...sharedSketchProps,
];

export const inputProps: PropRow[] = [
  {
    name: "label",
    type: "ReactNode",
    defaultValue: "undefined",
    description: "Optional label rendered above the field.",
  },
  {
    name: "placeholder",
    type: "string",
    defaultValue: "undefined",
    description: "Native placeholder. Not a substitute for label.",
  },
  ...sharedSketchProps,
];

export const textareaProps: PropRow[] = [
  {
    name: "label",
    type: "ReactNode",
    defaultValue: "undefined",
    description: "Optional label rendered above the field.",
  },
  {
    name: "rows",
    type: "number",
    defaultValue: "4",
    description: "Visible line count.",
  },
  ...sharedSketchProps,
];

export const checkboxProps: PropRow[] = [
  {
    name: "label",
    type: "ReactNode",
    defaultValue: "undefined",
    description: "Caption sitting to the right of the box.",
  },
  {
    name: "checked",
    type: "boolean | 'indeterminate'",
    defaultValue: "undefined",
    description: "Radix controlled value.",
  },
  {
    name: "onCheckedChange",
    type: "(checked: boolean | 'indeterminate') => void",
    defaultValue: "undefined",
    description: "Radix change handler.",
  },
  ...sharedSketchProps,
];

export const radioProps: PropRow[] = [
  {
    name: "value",
    type: "string",
    defaultValue: "required",
    description: "Value within RadioGroup.",
  },
  {
    name: "label",
    type: "ReactNode",
    defaultValue: "undefined",
    description: "Caption sitting to the right of the circle.",
  },
  ...sharedSketchProps,
];

export const cardProps: PropRow[] = [
  {
    name: "title",
    type: "ReactNode",
    defaultValue: "undefined",
    description: "Optional heading inside the card.",
  },
  {
    name: "footer",
    type: "ReactNode",
    defaultValue: "undefined",
    description: "Optional footer row.",
  },
  {
    name: "shadow",
    type: "boolean",
    defaultValue: "true",
    description: "Offset hachure rectangle behind the card.",
  },
  {
    name: "fill",
    type: "string",
    defaultValue: "undefined",
    description: "rough.js fill color for the face rectangle.",
  },
  ...sharedSketchProps,
];

export const badgeProps: PropRow[] = [
  {
    name: "variant",
    type: '"default" | "accent" | "outline"',
    defaultValue: '"default"',
    description: "Fill and stroke pairing.",
  },
  ...sharedSketchProps,
];

export const alertProps: PropRow[] = [
  {
    name: "variant",
    type: '"info" | "warning" | "error" | "success"',
    defaultValue: '"info"',
    description: "Sets stroke and wash color.",
  },
  {
    name: "title",
    type: "ReactNode",
    defaultValue: "undefined",
    description: "Bold first line.",
  },
  ...sharedSketchProps,
];

export const modalProps: PropRow[] = [
  {
    name: "trigger",
    type: "ReactNode",
    defaultValue: "undefined",
    description: "Element that opens the dialog (Radix Trigger asChild).",
  },
  {
    name: "title",
    type: "ReactNode",
    defaultValue: "undefined",
    description: "Dialog title. A visually hidden title is used if omitted.",
  },
  {
    name: "description",
    type: "ReactNode",
    defaultValue: "undefined",
    description: "Optional supporting copy.",
  },
  {
    name: "open / onOpenChange",
    type: "boolean / (open: boolean) => void",
    defaultValue: "uncontrolled",
    description: "Radix controlled API. Focus trap and Escape are built in.",
  },
  ...sharedSketchProps,
];

export const dividerProps: PropRow[] = [
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description: "Axis of the squiggle.",
  },
  ...sharedSketchProps,
];

export const progressProps: PropRow[] = [
  {
    name: "value",
    type: "number",
    defaultValue: "0",
    description: "Current value.",
  },
  {
    name: "max",
    type: "number",
    defaultValue: "100",
    description: "Maximum value. Sets aria-valuemax.",
  },
  ...sharedSketchProps,
];

export const tooltipProps: PropRow[] = [
  {
    name: "content",
    type: "ReactNode",
    defaultValue: "required",
    description: "Bubble body.",
  },
  {
    name: "side",
    type: '"top" | "right" | "bottom" | "left"',
    defaultValue: '"top"',
    description: "Radix placement.",
  },
  {
    name: "delayDuration",
    type: "number",
    defaultValue: "200",
    description: "Hover delay in milliseconds.",
  },
  ...sharedSketchProps,
];
