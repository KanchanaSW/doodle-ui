import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../components/Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: { seed: 42, label: "Accept terms", animate: false },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Checkbox seed={42} animate={false} size="sm" label="Small" />
      <Checkbox seed={43} animate={false} size="md" label="Medium" />
      <Checkbox seed={44} animate={false} size="lg" label="Large" />
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    label: "Required",
    error: "You must accept",
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};

export const NoAnimation: Story = {
  args: { animate: false, defaultChecked: true },
};
