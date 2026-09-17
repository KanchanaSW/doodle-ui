import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastProvider } from "../components/Toast";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Info: Story = {
  render: () => (
    <ToastProvider>
      <Toast seed={42} defaultOpen title="Saved" variant="info" duration={100000}>
        Your changes were stored.
      </Toast>
    </ToastProvider>
  ),
};

export const Success: Story = {
  render: () => (
    <ToastProvider>
      <Toast seed={42} defaultOpen title="Done" variant="success" duration={100000}>
        Upload complete.
      </Toast>
    </ToastProvider>
  ),
};

export const NoAnimation: Story = {
  render: () => (
    <ToastProvider>
      <Toast
        seed={42}
        defaultOpen
        animate={false}
        title="Static"
        duration={100000}
      >
        No motion.
      </Toast>
    </ToastProvider>
  ),
};
