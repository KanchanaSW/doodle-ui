import type { Meta, StoryObj } from "@storybook/react";
import { RadialProgress } from "../components/RadialProgress";

const meta: Meta<typeof RadialProgress> = {
  title: "Components/RadialProgress",
  component: RadialProgress,
  args: {
    seed: 42,
    value: 75,
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof RadialProgress>;

export const Determinate: Story = {};

export const Indeterminate: Story = {
  render: () => <RadialProgress seed={42} size="md" />,
};

export const Small: Story = {
  args: { size: "sm", value: 40 },
};

export const Large: Story = {
  args: { size: "lg", value: 90 },
};

export const CustomSize: Story = {
  args: { size: 220, value: 55 },
};

export const CustomColors: Story = {
  args: {
    value: 65,
    activeColor: "#22c55e",
    trackColor: "#3e4247",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const CustomLabel: Story = {
  args: {
    value: 8,
    max: 10,
    formatValue: (v, m) => `${v}/${m}`,
  },
};

export const WithChildren: Story = {
  args: {
    value: 50,
    children: "Half",
  },
};

export const NoAnimation: Story = {
  args: {
    value: 75,
    animate: false,
  },
};
