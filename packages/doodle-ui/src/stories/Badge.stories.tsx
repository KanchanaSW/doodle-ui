import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../components/Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  args: { seed: 42, children: "New" },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};
export const Accent: Story = { args: { variant: "accent" } };
export const Outline: Story = { args: { variant: "outline" } };
export const NoAnimation: Story = { args: { animate: false } };
