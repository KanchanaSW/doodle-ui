import type { Meta, StoryObj } from "@storybook/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/Popover";
import { Button } from "../components/Button";

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Open: Story = {
  render: () => (
    <Popover seed={42} defaultOpen>
      <PopoverTrigger asChild>
        <Button seed={42}>Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p style={{ margin: 0 }}>Popover body content.</p>
      </PopoverContent>
    </Popover>
  ),
};

export const NoAnimation: Story = {
  render: () => (
    <Popover seed={42} animate={false} defaultOpen>
      <PopoverTrigger asChild>
        <Button seed={42}>Open</Button>
      </PopoverTrigger>
      <PopoverContent>Static popover</PopoverContent>
    </Popover>
  ),
};
