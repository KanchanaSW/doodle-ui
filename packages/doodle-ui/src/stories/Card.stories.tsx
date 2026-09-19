import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  args: { seed: 42, animate: false },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: { title: "Notebook", children: "Sketch notes live here." },
};

export const Compound: Story = {
  render: () => (
    <Card seed={42} animate={false}>
      <Card.Header>
        <Card.Title>Notebook</Card.Title>
        <Card.Description>Hand-drawn notes</Card.Description>
      </Card.Header>
      <Card.Content>Sketch notes live here.</Card.Content>
      <Card.Footer>
        <Button seed={43} animate={false} size="sm">
          Draw
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const AsChildArticle: Story = {
  render: () => (
    <Card asChild seed={42} animate={false}>
      <article>
        <Card.Header>
          <Card.Title>Article card</Card.Title>
        </Card.Header>
        <Card.Content>Semantic article wrapper.</Card.Content>
      </article>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card seed={42} animate={false} title="Notebook">
      <p>Sketch notes live here.</p>
      <Button seed={43} animate={false} style={{ marginTop: 12 }}>
        Draw
      </Button>
    </Card>
  ),
};

export const NoAnimation: Story = {
  args: { animate: false, title: "Static", children: "No draw-in." },
};
