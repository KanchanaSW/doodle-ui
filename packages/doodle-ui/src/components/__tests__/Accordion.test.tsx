import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../Accordion";
import { renderWithProviders } from "../../test/test-utils";

describe("Accordion", () => {
  it("expands and collapses with aria-expanded", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Accordion seed={42} type="single" collapsible onValueChange={onValueChange}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section one</AccordionTrigger>
          <AccordionContent>Hidden details one</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section two</AccordionTrigger>
          <AccordionContent>Hidden details two</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole("button", { name: "Section one" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(onValueChange).toHaveBeenCalledWith("item-1");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Hidden details one")).toBeVisible();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
