import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox } from "../Combobox";
import {
  renderWithProviders,
  setPrefersReducedMotion,
} from "../../test/test-utils";

const OPTIONS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
];

describe("Combobox", () => {
  it("opens on trigger click with combobox ARIA", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Combobox
        seed={42}
        options={OPTIONS}
        placeholder="Pick framework"
        aria-label="Framework"
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "Framework" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      await screen.findByPlaceholderText("Search…"),
    ).toBeInTheDocument();
  });

  it("filters options on typing and selects a match", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Combobox
        seed={42}
        options={OPTIONS}
        aria-label="Framework"
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("combobox", { name: "Framework" }));
    const search = await screen.findByPlaceholderText("Search…");
    await user.type(search, "sve");

    expect(screen.getByText("Svelte")).toBeInTheDocument();
    expect(screen.queryByText("React")).not.toBeInTheDocument();

    await user.click(screen.getByText("Svelte"));
    expect(onValueChange).toHaveBeenCalledWith("svelte");
    await waitFor(() => {
      expect(screen.getByRole("combobox", { name: "Framework" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });
    expect(screen.getByRole("combobox", { name: "Framework" })).toHaveTextContent(
      "Svelte",
    );
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Combobox seed={42} options={OPTIONS} aria-label="Framework" />,
    );

    await user.click(screen.getByRole("combobox", { name: "Framework" }));
    await screen.findByPlaceholderText("Search…");
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.getByRole("combobox", { name: "Framework" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });
  });

  it("renders with animate={false}", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Combobox
        seed={42}
        animate={false}
        options={OPTIONS}
        aria-label="Framework"
      />,
    );
    await user.click(screen.getByRole("combobox", { name: "Framework" }));
    expect(await screen.findByPlaceholderText("Search…")).toBeInTheDocument();
  });

  it("respects prefers-reduced-motion", async () => {
    setPrefersReducedMotion(true);
    const user = userEvent.setup();
    renderWithProviders(
      <Combobox seed={42} options={OPTIONS} aria-label="Framework" />,
    );
    await user.click(screen.getByRole("combobox", { name: "Framework" }));
    expect(await screen.findByPlaceholderText("Search…")).toBeInTheDocument();
  });
});
