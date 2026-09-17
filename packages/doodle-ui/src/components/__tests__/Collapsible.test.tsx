import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../Collapsible";
import { renderWithProviders } from "../../test/test-utils";

describe("Collapsible", () => {
  it("toggles content visibility and aria-expanded", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Collapsible seed={42} onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Show more</CollapsibleTrigger>
        <CollapsibleContent>Extra details</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Show more" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Extra details")).toBeVisible();

    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
