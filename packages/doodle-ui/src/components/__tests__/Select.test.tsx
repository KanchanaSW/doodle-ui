import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "../Select";
import {
  renderWithProviders,
  setPrefersReducedMotion,
} from "../../test/test-utils";

const OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

async function openSelect(
  user: ReturnType<typeof userEvent.setup>,
  name = "Fruit",
) {
  const trigger = screen.getByRole("combobox", { name });
  trigger.focus();
  await user.keyboard("{Enter}");
  await screen.findByRole("listbox");
  return trigger;
}

describe("Select", () => {
  it("opens on trigger interaction and shows options", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Select
        seed={42}
        options={OPTIONS}
        placeholder="Pick fruit"
        aria-label="Fruit"
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await openSelect(user);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("selects an option, updates value, and fires onValueChange", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Select
        seed={42}
        options={OPTIONS}
        placeholder="Pick fruit"
        aria-label="Fruit"
        onValueChange={onValueChange}
      />,
    );

    await openSelect(user);
    await user.click(screen.getByRole("option", { name: "Banana" }));

    expect(onValueChange).toHaveBeenCalledWith("banana");
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveTextContent(
      "Banana",
    );
  });

  it("navigates options with arrow keys and selects with Enter", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Select
        seed={42}
        options={OPTIONS}
        aria-label="Fruit"
        onValueChange={onValueChange}
      />,
    );

    await openSelect(user);
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onValueChange).toHaveBeenCalled();
  });

  it("closes on Escape without selecting", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Select
        seed={42}
        options={OPTIONS}
        aria-label="Fruit"
        onValueChange={onValueChange}
      />,
    );

    await openSelect(user);
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("renders with animate={false}", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Select
        seed={42}
        animate={false}
        options={OPTIONS}
        aria-label="Fruit"
      />,
    );
    await openSelect(user);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
  });

  it("respects prefers-reduced-motion", async () => {
    setPrefersReducedMotion(true);
    const user = userEvent.setup();
    renderWithProviders(
      <Select seed={42} options={OPTIONS} aria-label="Fruit" />,
    );
    await openSelect(user);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
  });
});
