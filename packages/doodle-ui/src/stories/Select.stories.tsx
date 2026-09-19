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
    animate: false,
    options: OPTIONS,
    placeholder: "Pick fruit",
    "aria-label": "Fruit",
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: "banana" } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 240 }}>
      <Select
        seed={42}
        animate={false}
        size="sm"
        options={OPTIONS}
        aria-label="sm"
      />
      <Select
        seed={43}
        animate={false}
        size="md"
        options={OPTIONS}
        aria-label="md"
      />
      <Select
        seed={44}
        animate={false}
        size="lg"
        options={OPTIONS}
        aria-label="lg"
      />
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    error: "Pick a fruit",
    invalid: true,
  },
};

export const Disabled: Story = { args: { disabled: true } };
export const NoAnimation: Story = { args: { animate: false } };
