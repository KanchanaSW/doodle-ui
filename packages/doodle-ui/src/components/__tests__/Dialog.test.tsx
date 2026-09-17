import { describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Dialog";
import {
  renderWithProviders,
  setPrefersReducedMotion,
} from "../../test/test-utils";

function BasicDialog({ animate }: { animate?: boolean }) {
  return (
    <Dialog seed={42} animate={animate}>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm action</DialogTitle>
          <DialogDescription>This will save your changes.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("opens on trigger click and exposes dialog ARIA", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BasicDialog />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Confirm action" }),
    ).toBeInTheDocument();
    expect(screen.getByText("This will save your changes.")).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to trigger", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BasicDialog />);

    const trigger = screen.getByRole("button", { name: "Open dialog" });
    await user.click(trigger);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("closes on close button click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BasicDialog />);

    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("traps focus inside while open", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BasicDialog />);

    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    const dialog = await screen.findByRole("dialog");
    const close = within(dialog).getByRole("button", { name: "Close" });

    close.focus();
    expect(close).toHaveFocus();
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("renders with animate={false}", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BasicDialog animate={false} />);
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("respects prefers-reduced-motion", async () => {
    setPrefersReducedMotion(true);
    const user = userEvent.setup();
    renderWithProviders(<BasicDialog />);
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("fires onOpenChange when opened and closed", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Dialog seed={42} onOpenChange={onOpenChange}>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
