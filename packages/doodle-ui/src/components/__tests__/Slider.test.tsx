import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Slider } from "../Slider";
import { renderWithProviders } from "../../test/test-utils";

describe("Slider", () => {
  it("renders with slider role and ARIA value attributes", () => {
    renderWithProviders(
      <Slider seed={42} defaultValue={[40]} min={0} max={100} step={1} aria-label="Volume" />,
    );

    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider).toHaveAttribute("aria-valuenow", "40");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
  });

  it("changes value with arrow keys and fires onValueChange", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Slider
        seed={42}
        defaultValue={[50]}
        min={0}
        max={100}
        step={5}
        aria-label="Volume"
        onValueChange={onValueChange}
      />,
    );

    const slider = screen.getByRole("slider", { name: "Volume" });
    slider.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith([55]);
    expect(slider).toHaveAttribute("aria-valuenow", "55");

    await user.keyboard("{ArrowLeft}");
    expect(onValueChange).toHaveBeenCalledWith([50]);
  });

  it("respects min and max bounds", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Slider
        seed={42}
        defaultValue={[0]}
        min={0}
        max={10}
        step={1}
        aria-label="Level"
        onValueChange={onValueChange}
      />,
    );

    const slider = screen.getByRole("slider", { name: "Level" });
    slider.focus();
    await user.keyboard("{ArrowLeft}");
    expect(slider).toHaveAttribute("aria-valuenow", "0");

    await user.keyboard("{End}");
    expect(slider).toHaveAttribute("aria-valuenow", "10");
  });
});
