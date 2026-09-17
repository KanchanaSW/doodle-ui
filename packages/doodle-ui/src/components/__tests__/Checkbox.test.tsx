import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "../Checkbox";
import {
  renderWithProviders,
  setPrefersReducedMotion,
} from "../../test/test-utils";

describe("Checkbox", () => {
  it("toggles on click and reflects aria-checked", async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Checkbox
        seed={42}
        label="Accept terms"
        onCheckedChange={onCheckedChange}
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    await user.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    await user.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("toggles on Space keypress", async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Checkbox
        seed={42}
        label="Subscribe"
        onCheckedChange={onCheckedChange}
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    checkbox.focus();
    await user.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("renders with animate={false}", () => {
    renderWithProviders(
      <Checkbox seed={42} animate={false} label="Static" />,
    );
    expect(screen.getByRole("checkbox", { name: "Static" })).toBeInTheDocument();
  });

  it("respects prefers-reduced-motion", () => {
    setPrefersReducedMotion(true);
    renderWithProviders(<Checkbox seed={42} label="Quiet" />);
    expect(screen.getByRole("checkbox", { name: "Quiet" })).toBeInTheDocument();
  });
});
