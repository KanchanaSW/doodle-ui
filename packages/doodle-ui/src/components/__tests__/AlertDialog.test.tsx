import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../AlertDialog";
import {
  renderWithProviders,
  setPrefersReducedMotion,
} from "../../test/test-utils";

function BasicAlertDialog({ animate }: { animate?: boolean }) {
  return (
    <AlertDialog seed={42} animate={animate}>
      <AlertDialogTrigger>Delete item</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe("AlertDialog", () => {
  it("opens on trigger click with alertdialog role", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BasicAlertDialog />);

    await user.click(screen.getByRole("button", { name: "Delete item" }));
    const dialog = await screen.findByRole("alertdialog");
    expect(dialog).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Are you sure?" }),
    ).toBeInTheDocument();
  });

  it("closes on cancel and returns focus to trigger", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BasicAlertDialog />);

    const trigger = screen.getByRole("button", { name: "Delete item" });
    await user.click(trigger);
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("closes on action confirm", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BasicAlertDialog />);

    await user.click(screen.getByRole("button", { name: "Delete item" }));
    await screen.findByRole("alertdialog");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  it("renders with animate={false}", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BasicAlertDialog animate={false} />);
    await user.click(screen.getByRole("button", { name: "Delete item" }));
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
  });

  it("respects prefers-reduced-motion", async () => {
    setPrefersReducedMotion(true);
    const user = userEvent.setup();
    renderWithProviders(<BasicAlertDialog />);
    await user.click(screen.getByRole("button", { name: "Delete item" }));
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
  });
});
