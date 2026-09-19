import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../components/Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  args: {
    seed: 42,
    animate: false,
    placeholder: "Type here…",
    "aria-label": "Demo input",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 320 }}>
      <Input seed={42} animate={false} size="sm" label="Small" />
      <Input seed={43} animate={false} size="md" label="Medium" />
      <Input seed={44} animate={false} size="lg" label="Large" />
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    label: "Search",
    startIcon: (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
        <circle cx="7" cy="7" r="4" stroke="currentColor" fill="none" />
        <path d="M11 11l3 3" stroke="currentColor" />
      </svg>
    ),
  },
};

export const ErrorState: Story = {
  args: {
    label: "Email",
    error: "Enter a valid email",
    defaultValue: "not-an-email",
  },
};

export const Disabled: Story = {
  args: { label: "Locked", disabled: true, defaultValue: "Nope" },
};

export const NoAnimation: Story = { args: { animate: false } };
