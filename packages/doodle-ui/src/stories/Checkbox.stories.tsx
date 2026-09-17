import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../components/Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: { seed: 42, label: "Accept terms" },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const NoAnimation: Story = { args: { animate: false, defaultChecked: true } };
