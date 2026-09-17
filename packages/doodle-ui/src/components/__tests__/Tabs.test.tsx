import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tab, TabList, TabPanel, Tabs } from "../Tabs";
import {
  renderWithProviders,
  setPrefersReducedMotion,
} from "../../test/test-utils";

describe("Tabs", () => {
  it("switches panels on click with correct ARIA", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Tabs seed={42} defaultValue="one" onValueChange={onValueChange}>
        <TabList aria-label="Demo tabs">
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
      </Tabs>,
    );

    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel one");

    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(onValueChange).toHaveBeenCalledWith("two");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel two");
  });

  it("navigates tabs with arrow keys", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Tabs seed={42} defaultValue="one" onValueChange={onValueChange}>
        <TabList aria-label="Demo tabs">
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
          <Tab value="three">Three</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
        <TabPanel value="three">Panel three</TabPanel>
      </Tabs>,
    );

    screen.getByRole("tab", { name: "One" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith("two");
  });

  it("renders with animate={false}", () => {
    renderWithProviders(
      <Tabs seed={42} animate={false} defaultValue="one">
        <TabList>
          <Tab value="one">One</Tab>
        </TabList>
        <TabPanel value="one">Content</TabPanel>
      </Tabs>,
    );
    expect(screen.getByRole("tab", { name: "One" })).toBeInTheDocument();
  });

  it("respects prefers-reduced-motion", () => {
    setPrefersReducedMotion(true);
    renderWithProviders(
      <Tabs seed={42} defaultValue="one">
        <TabList>
          <Tab value="one">One</Tab>
        </TabList>
        <TabPanel value="one">Content</TabPanel>
      </Tabs>,
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content");
  });
});
