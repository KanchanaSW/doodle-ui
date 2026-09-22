export interface PropRow {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export function animateProp(description: string): PropRow {
  return {
    name: "animate",
    type: "boolean",
    defaultValue: "true",
    description: `${description} Overrides DoodleUIProvider. Reduced motion disables this unless the provider set forceAnimate.`,
  };
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
  animateProp(
    "Draw-in on mount and seed-morph on hover. Set false for a static sketch.",
  ),
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
  animateProp("Draw-in the border on mount. Seed-morph on focus."),
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
  animateProp("Draw-in the border on mount. Seed-morph on focus."),
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
  animateProp("Draw-in the box on mount. Checkmark path draws in when checked."),
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
  animateProp("Draw-in the ring on mount. Dot scales and draws in on select."),
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
  animateProp("Draw-in the border on mount."),
  ...sharedSketchProps,
];

export const badgeProps: PropRow[] = [
  {
    name: "variant",
    type: '"default" | "accent" | "outline"',
    defaultValue: '"default"',
    description: "Fill and stroke pairing.",
  },
  animateProp("Draw-in the border on mount."),
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
  animateProp("Draw-in the border on mount (~200ms, snappy for dynamic callouts)."),
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
  animateProp(
    "Backdrop fade, panel enter/exit, and border draw-in on open.",
  ),
  ...sharedSketchProps,
];

export const dividerProps: PropRow[] = [
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description: "Axis of the squiggle.",
  },
  animateProp("Draw-in so the line extends across its length."),
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
  animateProp(
    "Draw-in the track on mount. Fill width and roughness redraw as value changes.",
  ),
  ...sharedSketchProps,
];

export const radialProgressProps: PropRow[] = [
  {
    name: "value",
    type: "number | undefined",
    defaultValue: "undefined",
    description:
      "Determinate progress. Omit for indeterminate loading mode.",
  },
  {
    name: "max",
    type: "number",
    defaultValue: "100",
    description: "Maximum value. Sets aria-valuemax.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg" | number',
    defaultValue: '"md"',
    description: "Gauge diameter preset or pixel size.",
  },
  {
    name: "tickCount",
    type: "number",
    defaultValue: "48",
    description: "Number of radial tick bars along the arc.",
  },
  {
    name: "activeColor / trackColor",
    type: "string",
    defaultValue: "theme",
    description: "Active and inactive tick colors.",
  },
  {
    name: "showValue",
    type: "boolean",
    defaultValue: "true",
    description: "Show center percentage or children.",
  },
  {
    name: "waveSpeed",
    type: "number",
    defaultValue: "2",
    description: "Seconds per full wave cycle.",
  },
  animateProp(
    "Traveling height/brightness wave on ticks. Reduced motion freezes the wave.",
  ),
  ...sharedSketchProps,
];

export const radialMenuProps: PropRow[] = [
  {
    name: "items",
    type: "RadialMenuItem[]",
    defaultValue: "—",
    description: "Actions with id, icon, label, optional onSelect / disabled.",
  },
  {
    name: "open / defaultOpen / onOpenChange",
    type: "boolean / (open) => void",
    defaultValue: "uncontrolled false",
    description: "Controlled or uncontrolled open state. Toggle via trigger only.",
  },
  {
    name: "radius",
    type: "number",
    defaultValue: "size preset",
    description: "Distance in px from trigger center to item centers.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    description: "Trigger and item diameter preset.",
  },
  {
    name: "aria-label",
    type: "string",
    defaultValue: '"Open menu"',
    description: "Accessible name for the central trigger button.",
  },
  {
    name: "animate / SketchProps",
    type: "boolean / SketchProps",
    defaultValue: "provider / theme",
    description: "Draw-in, roughness, seed, sketchColor, and related sketch props.",
  },
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
  animateProp("Quick draw-in when the bubble shows (~180ms)."),
  ...sharedSketchProps,
];

export const selectProps: PropRow[] = [
  {
    name: "options",
    type: "SelectOption[]",
    defaultValue: "required",
    description: "Menu items. Each option has value, label, and optional disabled.",
  },
  {
    name: "placeholder",
    type: "string",
    defaultValue: '"Select…"',
    description: "Shown when no value is selected.",
  },
  {
    name: "value / onValueChange",
    type: "string / (value: string) => void",
    defaultValue: "uncontrolled",
    description: "Radix controlled API. Keyboard nav and ARIA come with the primitive.",
  },
  animateProp("Draw-in the trigger on mount. Popover border draws in on open."),
  ...sharedSketchProps,
];

export const switchProps: PropRow[] = [
  {
    name: "label",
    type: "ReactNode",
    defaultValue: "undefined",
    description: "Caption sitting to the right of the track.",
  },
  {
    name: "checked / onCheckedChange",
    type: "boolean / (checked: boolean) => void",
    defaultValue: "uncontrolled",
    description: "Radix controlled API.",
  },
  animateProp("Thumb slides with a spring. Track seed-morphs on toggle."),
  ...sharedSketchProps,
];

export const sliderProps: PropRow[] = [
  {
    name: "value / defaultValue",
    type: "number[]",
    defaultValue: "required (defaultValue)",
    description: "Radix slider values. Use a one-item array for a single thumb.",
  },
  {
    name: "min / max / step",
    type: "number",
    defaultValue: "0 / 100 / 1",
    description: "Range bounds and increment.",
  },
  {
    name: "thumbShape",
    type: '"circle" | "square"',
    defaultValue: '"circle"',
    description: "Rough thumb geometry.",
  },
  ...sharedSketchProps,
];

export const tabsProps: PropRow[] = [
  {
    name: "defaultValue / value",
    type: "string",
    defaultValue: "required",
    description: "Active tab. Switching redraws the underline with a derived seed.",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    defaultValue: "undefined",
    description: "Fires when the active tab changes.",
  },
  animateProp("Active underline redraws and slides to the selected tab."),
  ...sharedSketchProps,
];

export const accordionProps: PropRow[] = [
  {
    name: "type",
    type: '"single" | "multiple"',
    defaultValue: '"single"',
    description: "One open panel, or many.",
  },
  {
    name: "collapsible",
    type: "boolean",
    defaultValue: "true",
    description: "When type is single, allows closing the open item.",
  },
  {
    name: "defaultValue / value",
    type: "string | string[]",
    defaultValue: "undefined",
    description: "Open item id(s).",
  },
  ...sharedSketchProps,
];

export const tableProps: PropRow[] = [
  {
    name: "headerUnderline",
    type: "boolean",
    defaultValue: "true",
    description: "Draw a heavier sketch rule under the header row.",
  },
  animateProp("Row rules draw in on mount, staggered slightly."),
  ...sharedSketchProps,
];

export const toastProps: PropRow[] = [
  {
    name: "variant",
    type: '"info" | "warning" | "error" | "success"',
    defaultValue: '"info"',
    description: "Sets stroke and wash color, matching Alert.",
  },
  {
    name: "title",
    type: "ReactNode",
    defaultValue: "undefined",
    description: "Bold first line.",
  },
  {
    name: "open / onOpenChange",
    type: "boolean / (open: boolean) => void",
    defaultValue: "uncontrolled",
    description: "Radix toast visibility. Auto-dismiss comes from ToastProvider duration.",
  },
  {
    name: "duration",
    type: "number",
    defaultValue: "provider",
    description: "Override auto-dismiss for this toast, in milliseconds.",
  },
  animateProp("Slide-in with a sketchy settle wobble; reverse on exit."),
  ...sharedSketchProps,
];

export const avatarProps: PropRow[] = [
  {
    name: "src",
    type: "string",
    defaultValue: "undefined",
    description: "Image URL. Falls back to initials if missing or loading.",
  },
  {
    name: "fallback",
    type: "ReactNode",
    defaultValue: "undefined",
    description: "Initials or placeholder shown without an image.",
  },
  {
    name: "size",
    type: "number",
    defaultValue: "40",
    description: "Width and height in pixels.",
  },
  {
    name: "shape",
    type: '"circle" | "square"',
    defaultValue: '"circle"',
    description: "Frame geometry.",
  },
  {
    name: "status",
    type: '"online" | "offline" | "busy"',
    defaultValue: "undefined",
    description: "Optional sketch status dot.",
  },
  ...sharedSketchProps,
];

export const paginationProps: PropRow[] = [
  {
    name: "page",
    type: "number",
    defaultValue: "required",
    description: "1-based current page. Gets aria-current.",
  },
  {
    name: "count",
    type: "number",
    defaultValue: "required",
    description: "Total page count.",
  },
  {
    name: "onPageChange",
    type: "(page: number) => void",
    defaultValue: "undefined",
    description: "Fires for numbered buttons and prev/next.",
  },
  ...sharedSketchProps,
];

export const breadcrumbProps: PropRow[] = [
  {
    name: "separator",
    type: '"slash" | "chevron"',
    defaultValue: '"slash"',
    description: "Hand-drawn mark between crumbs.",
  },
  ...sharedSketchProps,
];

export const skeletonProps: PropRow[] = [
  {
    name: "variant",
    type: '"text" | "rect" | "circle"',
    defaultValue: '"rect"',
    description: "Placeholder shape.",
  },
  {
    name: "pulse",
    type: "boolean",
    defaultValue: "true",
    description: "Reseeds the hatch on an interval so the scribble redraws.",
  },
  {
    name: "width / height",
    type: "number | string",
    defaultValue: "varies by variant",
    description: "Box size. Circle defaults to 40×40.",
  },
  ...sharedSketchProps,
];

export const labelProps: PropRow[] = [
  {
    name: "htmlFor",
    type: "string",
    defaultValue: "undefined",
    description: "Ties the label to a field's id, same as the native attribute.",
  },
  {
    name: "required",
    type: "boolean",
    defaultValue: "false",
    description: "Adds a small hand-drawn accent dot after the text.",
  },
  animateProp("Draw-in the required mark on mount."),
  ...sharedSketchProps,
];

export const collapsibleProps: PropRow[] = [
  {
    name: "open / onOpenChange",
    type: "boolean / (open: boolean) => void",
    defaultValue: "uncontrolled",
    description: "Radix controlled API.",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    defaultValue: "false",
    description: "Initial open state when uncontrolled.",
  },
  ...sharedSketchProps,
];

export const popoverProps: PropRow[] = [
  {
    name: "open / onOpenChange",
    type: "boolean / (open: boolean) => void",
    defaultValue: "uncontrolled",
    description: "Radix controlled API.",
  },
  animateProp("Draw-in the panel border when the popover opens."),
  ...sharedSketchProps,
];

export const dropdownMenuProps: PropRow[] = [
  {
    name: "open / onOpenChange",
    type: "boolean / (open: boolean) => void",
    defaultValue: "uncontrolled",
    description: "Radix controlled API.",
  },
  animateProp("Draw-in the panel border when the menu opens."),
  ...sharedSketchProps,
];

export const dialogProps: PropRow[] = [
  {
    name: "open / onOpenChange",
    type: "boolean / (open: boolean) => void",
    defaultValue: "uncontrolled",
    description: "Radix controlled API. Focus trap and Escape are built in.",
  },
  {
    name: "DialogContent contentStyle",
    type: "CSSProperties",
    defaultValue: "undefined",
    description: "Padding for the inner content area. No forced width or shadow, unlike Modal.",
  },
  animateProp("Backdrop fade, panel enter/exit, and border draw-in on open."),
  ...sharedSketchProps,
];

export const alertDialogProps: PropRow[] = [
  {
    name: "open / onOpenChange",
    type: "boolean / (open: boolean) => void",
    defaultValue: "uncontrolled",
    description: "Radix controlled API. No outside-click or Escape dismiss by default.",
  },
  {
    name: "AlertDialogAction / AlertDialogCancel",
    type: "components",
    defaultValue: "n/a",
    description: "Pre-styled confirm (accent Button) and cancel (outline Button).",
  },
  animateProp("Backdrop fade, panel enter/exit, and border draw-in on open."),
  ...sharedSketchProps,
];

export const commandProps: PropRow[] = [
  {
    name: "shouldFilter / filter",
    type: "boolean / (value, search, keywords?) => number",
    defaultValue: "true / cmdk default",
    description: "cmdk's built-in fuzzy filtering, or bring your own.",
  },
  {
    name: "value / onValueChange",
    type: "string / (value: string) => void",
    defaultValue: "uncontrolled",
    description: "Controls the highlighted item value.",
  },
  animateProp("Draw-in the panel border on mount."),
  ...sharedSketchProps,
];

export const comboboxProps: PropRow[] = [
  {
    name: "options",
    type: "SelectOption[]",
    defaultValue: "required",
    description: "Same shape as Select's options: value, label, optional disabled.",
  },
  {
    name: "placeholder / searchPlaceholder",
    type: "string",
    defaultValue: '"Select…" / "Search…"',
    description: "Trigger caption and the Command input's placeholder.",
  },
  {
    name: "emptyMessage",
    type: "ReactNode",
    defaultValue: '"No results."',
    description: "Shown when the search matches nothing.",
  },
  {
    name: "value / onValueChange",
    type: "string / (value: string) => void",
    defaultValue: "uncontrolled",
    description: "Selected option value.",
  },
  animateProp("Draw-in the trigger on mount and the popover border on open."),
  ...sharedSketchProps,
];

export const stepperProps: PropRow[] = [
  {
    name: "steps",
    type: "Array<StepperStep | ReactNode>",
    defaultValue: "required",
    description: "Labels, or { label, description } objects.",
  },
  {
    name: "current",
    type: "number",
    defaultValue: "0",
    description: "0-based active step. Earlier steps fill in.",
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description: "Layout axis for markers and connectors.",
  },
  ...sharedSketchProps,
];

export const kbdProps: PropRow[] = [
  animateProp("Draw-in the key border on mount."),
  ...sharedSketchProps,
];

export const spinnerProps: PropRow[] = [
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    description: "Arc diameter.",
  },
  animateProp("Continuous rotation. Reduced motion shows a static arc."),
  ...sharedSketchProps,
];

export const toggleProps: PropRow[] = [
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    description: "Padding and type size.",
  },
  {
    name: "pressed / onPressedChange",
    type: "boolean / (pressed: boolean) => void",
    defaultValue: "uncontrolled",
    description: "Radix toggle state.",
  },
  animateProp("Draw-in on mount and seed morph when pressed."),
  ...sharedSketchProps,
];

export const toggleGroupProps: PropRow[] = [
  {
    name: "type",
    type: '"single" | "multiple"',
    defaultValue: '"single"',
    description: "Selection mode for the group.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    description: "Passed to each ToggleGroupItem.",
  },
  animateProp("Draw-in and pressed-state morph for items."),
  ...sharedSketchProps,
];

export const inputGroupProps: PropRow[] = [
  animateProp("Draw-in the outer frame; focus within morphs the border seed."),
  ...sharedSketchProps,
];

export const inputOtpProps: PropRow[] = [
  {
    name: "maxLength",
    type: "number",
    defaultValue: "required",
    description: "Number of OTP slots (input-otp).",
  },
  animateProp("Draw-in each slot; active slot uses accent stroke."),
  ...sharedSketchProps,
];

export const scrollAreaProps: PropRow[] = [
  animateProp("Draw-in the outer border on mount."),
  ...sharedSketchProps,
];

export const resizableProps: PropRow[] = [
  {
    name: "withHandle",
    type: "boolean",
    defaultValue: "true",
    description: "Sketchy grip on ResizableHandle.",
  },
  ...sharedSketchProps,
];

export const hoverCardProps: PropRow[] = [
  animateProp("Draw-in the card border when opened on hover."),
  ...sharedSketchProps,
];

export const contextMenuProps: PropRow[] = [
  animateProp("Draw-in the menu panel on open."),
  ...sharedSketchProps,
];

export const navigationMenuProps: PropRow[] = [
  animateProp("Draw-in dropdown panels and indicator."),
  ...sharedSketchProps,
];

export const menubarProps: PropRow[] = [
  animateProp("Draw-in menu panels when opened."),
  ...sharedSketchProps,
];

export const sheetProps: PropRow[] = [
  {
    name: "side",
    type: '"top" | "right" | "bottom" | "left"',
    defaultValue: '"right"',
    description: "Edge the sheet slides from.",
  },
  animateProp("Backdrop fade, slide motion, and border draw-in."),
  ...sharedSketchProps,
];

export const drawerProps: PropRow[] = [
  animateProp("Bottom slide-up panel with sketch handle and draw-in border."),
  ...sharedSketchProps,
];

export const aspectRatioProps: PropRow[] = [
  {
    name: "ratio",
    type: "number",
    defaultValue: "16 / 9",
    description: "Width divided by height for the content box.",
  },
  {
    name: "bordered",
    type: "boolean",
    defaultValue: "false",
    description: "Wrap content in a hand-drawn SketchBox frame.",
  },
  animateProp("Draw-in the frame when bordered is true."),
  ...sharedSketchProps,
];

export const nativeSelectProps: PropRow[] = [
  {
    name: "options",
    type: "NativeSelectOption[]",
    defaultValue: "undefined",
    description: "Optional value/label pairs. Omit to use <option> children.",
  },
  animateProp("Draw-in the border on mount."),
  ...sharedSketchProps,
];

export const emptyProps: PropRow[] = [
  {
    name: "bordered",
    type: "boolean",
    defaultValue: "true",
    description: "Sketch frame and hachure fill around the empty state.",
  },
  animateProp("Draw-in the frame when bordered."),
  ...sharedSketchProps,
];

export const fieldProps: PropRow[] = [
  {
    name: "invalid",
    type: "boolean",
    defaultValue: "false",
    description: "Sets aria-invalid on FieldControl and shows FieldError styling.",
  },
  {
    name: "error",
    type: "ReactNode",
    defaultValue: "undefined",
    description: "Error message rendered by FieldError when children omitted.",
  },
];

export const typographyProps: PropRow[] = [
  {
    name: "level",
    type: "1 | 2 | 3 | 4 | 5 | 6",
    defaultValue: "2",
    description: "Heading renders as h1–h6.",
  },
  {
    name: "accent",
    type: '"none" | "underline" | "highlight"',
    defaultValue: '"none"',
    description: "Optional hand-drawn underline or marker behind Heading text.",
  },
  animateProp("Draw-in accent strokes on Heading, Blockquote, InlineCode, Highlight."),
  ...sharedSketchProps,
];

export const sidebarProps: PropRow[] = [
  {
    name: "defaultCollapsed",
    type: "boolean",
    defaultValue: "false",
    description: "Start in icon-only collapsed width on SidebarProvider.",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    defaultValue: "true",
    description: "Whether Sidebar is visible.",
  },
  ...sharedSketchProps,
];

export const carouselProps: PropRow[] = [
  {
    name: "bordered",
    type: "boolean",
    defaultValue: "false",
    description: "Sketch frame around the slide viewport. Arrows stay outside.",
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description: "Embla scroll axis.",
  },
  animateProp("Draw-in outer frame and nav button borders."),
  ...sharedSketchProps,
];

export const promptInputProps: PropRow[] = [
  {
    name: "variant",
    type: '"solid" | "sketch"',
    defaultValue: '"solid"',
    description: "Sleek pill capsule (solid) or hand-drawn roughjs borders (sketch).",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    description: "Height and font scale preset.",
  },
  {
    name: "onSubmit",
    type: "(value: string) => void",
    defaultValue: "undefined",
    description: "Callback fired when user submits via Enter key or clicking the send button.",
  },
  {
    name: "onVoiceClick",
    type: "(event: MouseEvent) => void",
    defaultValue: "undefined",
    description: "Callback fired when the voice waveform button is clicked.",
  },
  {
    name: "loading",
    type: "boolean",
    defaultValue: "false",
    description: "Replaces the send icon with a spinner.",
  },
  {
    name: "keepOpenOnBlur",
    type: "boolean",
    defaultValue: "false",
    description: "Keeps the send button visible even after focus moves away.",
  },
  animateProp("Spring animation when transitioning between voice waveform and send button."),
  ...sharedSketchProps,
];

