import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/Dialog";
import { Button } from "../components/Button";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog seed={42} defaultOpen>
      <DialogTrigger asChild>
        <Button seed={42}>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm action</DialogTitle>
          <DialogDescription>This will save your changes.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button seed={43} variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const NoAnimation: Story = {
  render: () => (
    <Dialog seed={42} animate={false} defaultOpen>
      <DialogTrigger asChild>
        <Button seed={42}>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Static dialog</DialogTitle>
          <DialogDescription>Animations disabled.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
};
