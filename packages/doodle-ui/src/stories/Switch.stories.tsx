import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../components/Switch";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  args: { seed: 42, label: "Airplane mode" },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Off: Story = {};
export const On: Story = { args: { defaultChecked: true } };
export const NoAnimation: Story = { args: { animate: false, defaultChecked: true } };
