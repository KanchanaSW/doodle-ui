import type { Meta, StoryObj } from "@storybook/react";
import { Combobox } from "../components/Combobox";

const OPTIONS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
];

const meta: Meta<typeof Combobox> = {
  title: "Components/Combobox",
  component: Combobox,
  args: {
    seed: 42,
    options: OPTIONS,
    placeholder: "Pick framework",
    "aria-label": "Framework",
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: "react" } };
export const NoAnimation: Story = { args: { animate: false } };
