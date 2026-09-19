import type { Meta, StoryObj } from "@storybook/react";
import { RadialMenu } from "../components/RadialMenu";

const meta: Meta<typeof RadialMenu> = {
  title: "Components/RadialMenu",
  component: RadialMenu,
};

export default meta;
type Story = StoryObj<typeof RadialMenu>;

const icons = {
  hash: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M5 9h14M5 15h14M9 5v14M15 5v14" />
    </svg>
  ),
  text: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M6 5h12M12 5v14" />
    </svg>
  ),
  square: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="6" y="6" width="12" height="12" />
    </svg>
  ),
  pen: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    </svg>
  ),
  star: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.3 6.2 21l1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
    </svg>
  ),
};

export const Default: Story = {
  render: () => (
    <div style={{ minHeight: 280, display: "grid", placeItems: "center" }}>
      <RadialMenu
        seed={42}
        aria-label="Tools"
        items={[
          { id: "crop", icon: icons.hash, label: "Crop" },
          { id: "text", icon: icons.text, label: "Text" },
          { id: "shape", icon: icons.square, label: "Shape" },
          { id: "draw", icon: icons.pen, label: "Draw" },
          { id: "star", icon: icons.star, label: "Favorite" },
        ]}
      />
    </div>
  ),
};

export const Open: Story = {
  render: () => (
    <div style={{ minHeight: 280, display: "grid", placeItems: "center" }}>
      <RadialMenu
        seed={42}
        defaultOpen
        aria-label="Tools"
        items={[
          { id: "crop", icon: icons.hash, label: "Crop" },
          { id: "text", icon: icons.text, label: "Text" },
          { id: "shape", icon: icons.square, label: "Shape" },
          { id: "draw", icon: icons.pen, label: "Draw" },
          { id: "star", icon: icons.star, label: "Favorite" },
        ]}
      />
    </div>
  ),
};
