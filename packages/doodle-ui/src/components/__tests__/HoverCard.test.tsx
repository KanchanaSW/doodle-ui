import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../HoverCard";
import { Button } from "../Button";
import { renderWithProviders } from "../../test/test-utils";

describe("HoverCard", () => {
  it("appears on hover and dismisses on leave", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <HoverCard seed={42} openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
          <Button seed={42}>@sketch</Button>
        </HoverCardTrigger>
        <HoverCardContent>Profile preview</HoverCardContent>
      </HoverCard>,
    );

    await user.hover(screen.getByRole("button", { name: "@sketch" }));
    expect(await screen.findByText("Profile preview")).toBeInTheDocument();

    await user.unhover(screen.getByRole("button", { name: "@sketch" }));
    await waitFor(() => {
      expect(screen.queryByText("Profile preview")).not.toBeInTheDocument();
    });
  });
});
