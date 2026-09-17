import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "../components/Slider";

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
  args: {
    seed: 42,
    defaultValue: [40],
    min: 0,
    max: 100,
    step: 1,
    "aria-label": "Volume",
    style: { width: 280 },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {};
export const SquareThumb: Story = { args: { thumbShape: "square" } };
