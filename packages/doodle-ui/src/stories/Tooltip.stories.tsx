import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipProvider } from "../components/Tooltip";
import { Button } from "../components/Button";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <TooltipProvider delayDuration={0}>
      <Tooltip seed={42} content="Helpful tip" delayDuration={0}>
        <Button seed={42}>Hover me</Button>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const NoAnimation: Story = {
  render: () => (
    <TooltipProvider delayDuration={0}>
      <Tooltip seed={42} animate={false} content="Static tip" delayDuration={0}>
        <Button seed={42}>Hover me</Button>
      </Tooltip>
    </TooltipProvider>
  ),
};
