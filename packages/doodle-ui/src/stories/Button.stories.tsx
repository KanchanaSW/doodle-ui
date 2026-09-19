import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/Button";

const Icon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
    <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  args: { seed: 42, children: "Sketch me", animate: false },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button seed={42} animate={false} size="sm">
        Small
      </Button>
      <Button seed={43} animate={false} size="md">
        Medium
      </Button>
      <Button seed={44} animate={false} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    startIcon: <Icon />,
    endIcon: <Icon />,
    children: "Continue",
  },
};

export const IconOnly: Story = {
  args: {
    startIcon: <Icon />,
    children: undefined,
    "aria-label": "Add",
  },
};

export const Loading: Story = {
  args: { loading: true, children: "Saving" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AsChildLink: Story = {
  render: () => (
    <Button asChild seed={42} animate={false} variant="primary">
      <a href="#docs">Read the docs</a>
    </Button>
  ),
};

export const NoAnimation: Story = { args: { animate: false } };
