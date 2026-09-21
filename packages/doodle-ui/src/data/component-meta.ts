import type { ComponentCategory } from "../registry/types";

/** Category + search keywords for each registry component (kebab-case keys). */
export const COMPONENT_META: Record<
  string,
  { category: ComponentCategory; keywords: string[] }
> = {
  accordion: {
    category: "layout",
    keywords: ["expand", "collapse", "sections", "faq", "chevron"],
  },
  alert: {
    category: "feedback",
    keywords: ["callout", "banner", "status", "info", "warning", "error", "success"],
  },
  "alert-dialog": {
    category: "overlay",
    keywords: [
      "confirm",
      "confirmation",
      "destructive",
      "delete",
      "prompt",
      "modal",
      "danger",
    ],
  },
  "aspect-ratio": {
    category: "layout",
    keywords: ["ratio", "media", "image", "video", "16:9"],
  },
  avatar: {
    category: "data-display",
    keywords: ["profile", "image", "initials", "user", "photo"],
  },
  badge: {
    category: "data-display",
    keywords: ["tag", "label", "chip", "status"],
  },
  breadcrumb: {
    category: "navigation",
    keywords: ["path", "trail", "hierarchy", "links"],
  },
  button: {
    category: "form",
    keywords: ["click", "action", "submit", "cta", "press"],
  },
  card: {
    category: "layout",
    keywords: ["container", "panel", "box", "surface"],
  },
  carousel: {
    category: "data-display",
    keywords: ["slider", "slides", "gallery", "embla"],
  },
  checkbox: {
    category: "form",
    keywords: ["check", "toggle", "boolean", "agree", "terms"],
  },
  collapsible: {
    category: "layout",
    keywords: ["expand", "collapse", "show", "hide"],
  },
  combobox: {
    category: "form",
    keywords: ["searchable", "select", "autocomplete", "filter", "dropdown"],
  },
  command: {
    category: "overlay",
    keywords: ["cmdk", "palette", "search", "shortcut", "cmd+k"],
  },
  "context-menu": {
    category: "overlay",
    keywords: ["right-click", "menu", "context"],
  },
  dialog: {
    category: "overlay",
    keywords: ["modal", "popup", "overlay", "panel"],
  },
  divider: {
    category: "layout",
    keywords: ["separator", "rule", "hr", "squiggle"],
  },
  drawer: {
    category: "overlay",
    keywords: ["bottom", "sheet", "mobile", "panel", "slide"],
  },
  "dropdown-menu": {
    category: "overlay",
    keywords: ["menu", "dropdown", "actions", "options"],
  },
  empty: {
    category: "feedback",
    keywords: ["empty-state", "placeholder", "no-data", "zero"],
  },
  field: {
    category: "form",
    keywords: ["label", "error", "helper", "form", "validation"],
  },
  "hover-card": {
    category: "overlay",
    keywords: ["hover", "preview", "card", "popover"],
  },
  input: {
    category: "form",
    keywords: ["text", "field", "email", "password", "login"],
  },
  "input-group": {
    category: "form",
    keywords: ["addon", "prefix", "suffix", "group"],
  },
  "input-otp": {
    category: "form",
    keywords: ["otp", "pin", "code", "verification", "2fa"],
  },
  kbd: {
    category: "data-display",
    keywords: ["keyboard", "shortcut", "key"],
  },
  label: {
    category: "form",
    keywords: ["caption", "form", "accessibility"],
  },
  menubar: {
    category: "navigation",
    keywords: ["menu", "app", "file", "edit", "bar"],
  },
  modal: {
    category: "overlay",
    keywords: ["dialog", "popup", "overlay", "confirm"],
  },
  "native-select": {
    category: "form",
    keywords: ["select", "native", "dropdown", "options"],
  },
  "navigation-menu": {
    category: "navigation",
    keywords: ["nav", "horizontal", "links", "dropdown"],
  },
  pagination: {
    category: "navigation",
    keywords: ["pages", "pager", "next", "previous"],
  },
  popover: {
    category: "overlay",
    keywords: ["floating", "panel", "anchor", "popup"],
  },
  progress: {
    category: "feedback",
    keywords: ["bar", "loading", "percent", "completion"],
  },
  "radial-progress": {
    category: "feedback",
    keywords: ["circular", "gauge", "loader", "percent"],
  },
  "radial-menu": {
    category: "navigation",
    keywords: ["pie", "arc", "fan", "actions", "fab"],
  },
  radio: {
    category: "form",
    keywords: ["radio", "choice", "option", "group", "select-one"],
  },
  resizable: {
    category: "layout",
    keywords: ["panels", "drag", "split", "resize"],
  },
  "scroll-area": {
    category: "layout",
    keywords: ["scroll", "overflow", "scrollbar"],
  },
  select: {
    category: "form",
    keywords: ["dropdown", "options", "choose", "picker"],
  },
  sheet: {
    category: "overlay",
    keywords: ["side", "panel", "slide", "drawer", "edge"],
  },
  sidebar: {
    category: "navigation",
    keywords: ["nav", "app", "layout", "collapsible"],
  },
  skeleton: {
    category: "feedback",
    keywords: ["loading", "placeholder", "shimmer", "scribble"],
  },
  slider: {
    category: "form",
    keywords: ["range", "track", "thumb", "volume"],
  },
  spinner: {
    category: "feedback",
    keywords: ["loading", "busy", "wait", "arc"],
  },
  stepper: {
    category: "navigation",
    keywords: ["steps", "wizard", "progress", "multi-step"],
  },
  switch: {
    category: "form",
    keywords: ["toggle", "on", "off", "boolean"],
  },
  table: {
    category: "data-display",
    keywords: ["grid", "rows", "columns", "data"],
  },
  tabs: {
    category: "navigation",
    keywords: ["tab", "panel", "sections", "switch"],
  },
  textarea: {
    category: "form",
    keywords: ["multiline", "text", "notes", "message", "comment"],
  },
  toast: {
    category: "feedback",
    keywords: ["notification", "snackbar", "alert", "message"],
  },
  toggle: {
    category: "form",
    keywords: ["pressed", "button", "on", "off"],
  },
  "toggle-group": {
    category: "form",
    keywords: ["multi-select", "single-select", "toolbar"],
  },
  tooltip: {
    category: "overlay",
    keywords: ["hint", "hover", "help", "bubble"],
  },
  typography: {
    category: "data-display",
    keywords: ["heading", "text", "paragraph", "blockquote", "code"],
  },
};

export function getComponentMeta(kebab: string): {
  category: ComponentCategory;
  keywords: string[];
} {
  return (
    COMPONENT_META[kebab] ?? {
      category: "layout" as ComponentCategory,
      keywords: [],
    }
  );
}
