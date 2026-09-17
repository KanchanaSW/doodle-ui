import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ContextMenu";
import { renderWithProviders } from "../../test/test-utils";

describe("ContextMenu", () => {
  it("opens on right-click, lists items, and selects", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <ContextMenu seed={42}>
        <ContextMenuTrigger>
          <div>Right-click target</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={onSelect}>Copy</ContextMenuItem>
          <ContextMenuItem>Paste</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    await user.pointer({
      keys: "[MouseRight]",
      target: screen.getByText("Right-click target"),
    });
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Copy" })).toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: "Copy" }));
    expect(onSelect).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});
