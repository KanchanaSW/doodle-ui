import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "../Switch";
import {
  renderWithProviders,
  setPrefersReducedMotion,
} from "../../test/test-utils";

describe("Switch", () => {
  it("toggles on click and reflects aria-checked", async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Switch seed={42} label="Airplane mode" onCheckedChange={onCheckedChange} />,
    );

    const sw = screen.getByRole("switch", { name: "Airplane mode" });
    expect(sw).toHaveAttribute("aria-checked", "false");

    await user.click(sw);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("toggles on Space keypress", async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Switch seed={42} label="Notifications" onCheckedChange={onCheckedChange} />,
    );

    const sw = screen.getByRole("switch", { name: "Notifications" });
    sw.focus();
    await user.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("renders with animate={false}", () => {
    renderWithProviders(
      <Switch seed={42} animate={false} label="Static switch" />,
    );
    expect(
      screen.getByRole("switch", { name: "Static switch" }),
    ).toBeInTheDocument();
  });

  it("respects prefers-reduced-motion", () => {
    setPrefersReducedMotion(true);
    renderWithProviders(<Switch seed={42} label="Quiet switch" />);
    expect(
      screen.getByRole("switch", { name: "Quiet switch" }),
    ).toBeInTheDocument();
  });
});
