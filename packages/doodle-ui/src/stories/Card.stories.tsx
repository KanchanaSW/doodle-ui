import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  args: { seed: 42, title: "Notebook", children: "Sketch notes live here." },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};
export const WithAction: Story = {
  render: () => (
    <Card seed={42} title="Notebook">
      <p>Sketch notes live here.</p>
      <Button seed={43} style={{ marginTop: 12 }}>
        Draw
      </Button>
    </Card>
  ),
};
export const NoAnimation: Story = { args: { animate: false } };
