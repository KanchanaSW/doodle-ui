import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../Popover";
import { Button } from "../Button";
import {
  renderWithProviders,
  setPrefersReducedMotion,
} from "../../test/test-utils";

describe("Popover", () => {
  it("opens on click and closes on Escape", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Popover seed={42}>
        <PopoverTrigger asChild>
          <Button seed={42}>Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Popover body</p>
          <PopoverClose>Dismiss</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));
    expect(await screen.findByText("Popover body")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByText("Popover body")).not.toBeInTheDocument();
    });
  });

  it("closes via close button", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Popover seed={42}>
        <PopoverTrigger asChild>
          <Button seed={42}>Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Popover body</p>
          <PopoverClose>Dismiss</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));
    await screen.findByText("Popover body");
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    await waitFor(() => {
      expect(screen.queryByText("Popover body")).not.toBeInTheDocument();
    });
  });

  it("renders with animate={false}", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Popover seed={42} animate={false}>
        <PopoverTrigger asChild>
          <Button seed={42}>Open</Button>
        </PopoverTrigger>
        <PopoverContent>Static popover</PopoverContent>
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByText("Static popover")).toBeInTheDocument();
  });

  it("respects prefers-reduced-motion", async () => {
    setPrefersReducedMotion(true);
    const user = userEvent.setup();
    renderWithProviders(
      <Popover seed={42}>
        <PopoverTrigger asChild>
          <Button seed={42}>Open</Button>
        </PopoverTrigger>
        <PopoverContent>Quiet popover</PopoverContent>
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByText("Quiet popover")).toBeInTheDocument();
  });
});
