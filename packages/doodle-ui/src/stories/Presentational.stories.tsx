import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "../components/Progress";
import { Divider } from "../components/Divider";
import { Avatar } from "../components/Avatar";
import { Kbd } from "../components/Kbd";

const meta: Meta = {
  title: "Components/Presentational",
};

export default meta;

export const ProgressBar: StoryObj<typeof Progress> = {
  render: () => (
    <Progress seed={42} value={55} aria-label="Loading" style={{ width: 280 }} />
  ),
};

export const HorizontalDivider: StoryObj<typeof Divider> = {
  render: () => <Divider seed={42} style={{ width: 280 }} />,
};

export const AvatarFallback: StoryObj<typeof Avatar> = {
  render: () => <Avatar seed={42} fallback="KS" alt="Kanchana" />,
};

export const Keyboard: StoryObj<typeof Kbd> = {
  render: () => <Kbd seed={42}>⌘K</Kbd>,
};
