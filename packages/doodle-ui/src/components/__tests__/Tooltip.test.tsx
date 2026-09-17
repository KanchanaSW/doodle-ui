import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip, TooltipProvider } from "../Tooltip";
import { Button } from "../Button";
import {
  renderWithProviders,
  setPrefersReducedMotion,
} from "../../test/test-utils";

describe("Tooltip", () => {
  it("appears on hover after delay", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TooltipProvider>
        <Tooltip seed={42} content="Helpful tip" delayDuration={0}>
          <Button seed={42}>Hover me</Button>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover me" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Helpful tip");
  });

  it("renders with animate={false}", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TooltipProvider>
        <Tooltip seed={42} animate={false} content="Static tip" delayDuration={0}>
          <Button seed={42}>Hover me</Button>
        </Tooltip>
      </TooltipProvider>,
    );
    await user.hover(screen.getByRole("button", { name: "Hover me" }));
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
  });

  it("respects prefers-reduced-motion", async () => {
    setPrefersReducedMotion(true);
    const user = userEvent.setup();
    renderWithProviders(
      <TooltipProvider>
        <Tooltip seed={42} content="Quiet tip" delayDuration={0}>
          <Button seed={42}>Hover me</Button>
        </Tooltip>
      </TooltipProvider>,
    );
    await user.hover(screen.getByRole("button", { name: "Hover me" }));
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
  });
});
