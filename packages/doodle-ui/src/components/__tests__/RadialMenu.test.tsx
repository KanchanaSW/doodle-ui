import { afterEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadialMenu } from "../RadialMenu";
import {
  renderWithProviders,
  setPrefersReducedMotion,
} from "../../test/test-utils";
import { resetPrefersReducedMotion } from "../../test/match-media";

const sampleItems = [
  { id: "a", icon: <span>A</span>, label: "Alpha", onSelect: vi.fn() },
  { id: "b", icon: <span>B</span>, label: "Beta", onSelect: vi.fn() },
  { id: "c", icon: <span>C</span>, label: "Gamma", onSelect: vi.fn() },
];

describe("RadialMenu", () => {
  afterEach(() => {
    resetPrefersReducedMotion();
    setPrefersReducedMotion(false);
    sampleItems.forEach((item) => item.onSelect.mockClear());
  });

  it("toggles open/close via the trigger and sets aria-expanded", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <RadialMenu
        seed={42}
        items={sampleItems}
        onOpenChange={onOpenChange}
        aria-label="Actions"
      />,
    );

    const trigger = screen.getByRole("button", { name: "Actions" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");

    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const menu = screen.getByRole("menu");
    expect(within(menu).getByRole("menuitem", { name: "Alpha" })).toBeInTheDocument();

    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onSelect without closing the menu", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <RadialMenu
        seed={42}
        defaultOpen
        items={sampleItems}
        onOpenChange={onOpenChange}
        aria-label="Actions"
      />,
    );

    await user.click(screen.getByRole("menuitem", { name: "Beta" }));
    expect(sampleItems[1].onSelect).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("supports controlled open", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = renderWithProviders(
      <RadialMenu
        seed={42}
        open={false}
        onOpenChange={onOpenChange}
        items={sampleItems}
        aria-label="Actions"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    rerender(
      <RadialMenu
        seed={42}
        open
        onOpenChange={onOpenChange}
        items={sampleItems}
        aria-label="Actions"
      />,
    );
    expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("still toggles when reduced motion is preferred", async () => {
    setPrefersReducedMotion(true);
    const user = userEvent.setup();
    renderWithProviders(
      <RadialMenu seed={42} items={sampleItems} aria-label="Actions" />,
      { animate: true },
    );

    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "Alpha" })).toBeInTheDocument();
  });
});
