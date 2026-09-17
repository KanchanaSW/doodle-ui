import type { Meta, StoryObj } from "@storybook/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/Collapsible";
import { Button } from "../components/Button";

const meta: Meta<typeof Collapsible> = {
  title: "Components/Collapsible",
  component: Collapsible,
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Open: Story = {
  render: () => (
    <Collapsible seed={42} defaultOpen>
      <CollapsibleTrigger asChild>
        <Button seed={42} variant="outline">
          Toggle
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p style={{ marginTop: 12 }}>Extra details appear here.</p>
      </CollapsibleContent>
    </Collapsible>
  ),
};
