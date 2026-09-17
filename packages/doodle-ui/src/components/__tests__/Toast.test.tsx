import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
} from "../Toast";
import { Button } from "../Button";
import {
  renderWithProviders,
  setPrefersReducedMotion,
} from "../../test/test-utils";

function ToastDemo({ duration = 4000 }: { duration?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <ToastProvider duration={duration}>
      <Button seed={42} onClick={() => setOpen(true)}>
        Show toast
      </Button>
      <Toast
        seed={42}
        open={open}
        onOpenChange={setOpen}
        title="Saved"
        duration={duration}
      >
        Your changes were stored.
      </Toast>
    </ToastProvider>
  );
}

function StackedToasts() {
  return (
    <ToastProvider duration={10000}>
      <Toast seed={41} defaultOpen title="First" duration={10000}>
        One
      </Toast>
      <Toast seed={42} defaultOpen title="Second" duration={10000}>
        Two
      </Toast>
    </ToastProvider>
  );
}

function DismissableToast() {
  const [open, setOpen] = useState(true);
  return (
    <ToastProvider>
      <ToastRoot open={open} onOpenChange={setOpen} duration={10000}>
        <ToastTitle>Dismiss me</ToastTitle>
        <ToastDescription>Closeable toast</ToastDescription>
        <ToastClose>Close toast</ToastClose>
      </ToastRoot>
    </ToastProvider>
  );
}

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("appears on trigger", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProviders(<ToastDemo />);

    await user.click(screen.getByRole("button", { name: "Show toast" }));
    expect(await screen.findByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Your changes were stored.")).toBeInTheDocument();
  });

  it("auto-dismisses after duration", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProviders(
      <ToastProvider duration={500}>
        <Button
          seed={42}
          onClick={() => {
            /* open via controlled toast below */
          }}
        >
          noop
        </Button>
        <Toast
          seed={42}
          defaultOpen
          duration={500}
          title="Saved"
          onOpenChange={onOpenChange}
        >
          Auto leave
        </Toast>
      </ToastProvider>,
    );

    expect(screen.getByText("Saved")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("stacks multiple toasts", () => {
    renderWithProviders(<StackedToasts />);
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("dismiss button closes toast", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProviders(<DismissableToast />);

    expect(screen.getByText("Dismiss me")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close toast" }));
    await waitFor(() => {
      expect(screen.queryByText("Dismiss me")).not.toBeInTheDocument();
    });
  });

  it("renders with animate={false}", () => {
    renderWithProviders(
      <ToastProvider>
        <Toast seed={42} defaultOpen animate={false} title="Static toast">
          No motion
        </Toast>
      </ToastProvider>,
    );
    expect(screen.getByText("Static toast")).toBeInTheDocument();
  });

  it("respects prefers-reduced-motion", () => {
    setPrefersReducedMotion(true);
    renderWithProviders(
      <ToastProvider>
        <Toast seed={42} defaultOpen title="Quiet toast">
          Reduced motion
        </Toast>
      </ToastProvider>,
    );
    expect(screen.getByText("Quiet toast")).toBeInTheDocument();
  });
});
