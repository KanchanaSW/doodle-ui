import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../components/Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  args: { seed: 42, placeholder: "Type here…", "aria-label": "Demo input" },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const NoAnimation: Story = { args: { animate: false } };
