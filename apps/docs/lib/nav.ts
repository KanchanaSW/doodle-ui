export const COMPONENT_PAGES = [
  { slug: "button", title: "Button", blurb: "Click target with sketchy chrome" },
  { slug: "input", title: "Input", blurb: "Text field with a wobbling border" },
  { slug: "textarea", title: "Textarea", blurb: "Multi-line sketch box" },
  { slug: "checkbox", title: "Checkbox", blurb: "Square plus a drawn check" },
  { slug: "radio", title: "Radio", blurb: "Circle with a hand-filled dot" },
  { slug: "card", title: "Card", blurb: "Container with an optional offset shadow" },
  { slug: "badge", title: "Badge", blurb: "Small tagged label" },
  { slug: "alert", title: "Alert", blurb: "Color-coded callout" },
  { slug: "modal", title: "Modal", blurb: "Radix dialog with sketch framing" },
  { slug: "divider", title: "Divider", blurb: "Squiggly rule, horizontal or vertical" },
  { slug: "progress", title: "Progress", blurb: "Outer bar plus a rougher fill" },
  { slug: "tooltip", title: "Tooltip", blurb: "Radix tooltip in a sketch bubble" },
] as const;

export type ComponentSlug = (typeof COMPONENT_PAGES)[number]["slug"];
