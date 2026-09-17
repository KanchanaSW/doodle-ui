import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "../components/Radio";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/Radio",
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="a" aria-label="Choice">
      <Radio seed={42} value="a" label="Option A" />
      <Radio seed={43} value="b" label="Option B" />
      <Radio seed={44} value="c" label="Option C" />
    </RadioGroup>
  ),
};

export const NoAnimation: Story = {
  render: () => (
    <RadioGroup defaultValue="a" aria-label="Choice">
      <Radio seed={42} animate={false} value="a" label="Option A" />
      <Radio seed={43} animate={false} value="b" label="Option B" />
    </RadioGroup>
  ),
};
