import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../components/Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  args: { seed: 42, children: "New", animate: false },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};
export const Accent: Story = { args: { variant: "accent" } };
export const Outline: Story = { args: { variant: "outline" } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Badge seed={42} animate={false} size="sm">
        sm
      </Badge>
      <Badge seed={43} animate={false} size="md">
        md
      </Badge>
      <Badge seed={44} animate={false} size="lg">
        lg
      </Badge>
    </div>
  ),
};

export const AsChildLink: Story = {
  render: () => (
    <Badge asChild seed={42} animate={false} variant="accent">
      <a href="#art">Art</a>
    </Badge>
  ),
};

export const NoAnimation: Story = { args: { animate: false } };
