import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "../components/Select";

const OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  args: {
    seed: 42,
    options: OPTIONS,
    placeholder: "Pick fruit",
    "aria-label": "Fruit",
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: "banana" } };
export const NoAnimation: Story = { args: { animate: false } };
