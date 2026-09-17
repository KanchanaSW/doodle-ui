import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio, RadioGroup } from "../Radio";
import {
  renderWithProviders,
  setPrefersReducedMotion,
} from "../../test/test-utils";

describe("Radio / RadioGroup", () => {
  it("renders radiogroup and radios with correct ARIA", () => {
    renderWithProviders(
      <RadioGroup defaultValue="a" aria-label="Choice">
        <Radio seed={42} animate={false} value="a" label="Option A" />
        <Radio seed={43} animate={false} value="b" label="Option B" />
      </RadioGroup>,
    );

    expect(screen.getByRole("radiogroup", { name: "Choice" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Option A" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Option B" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("selects on click and fires onValueChange", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <RadioGroup defaultValue="a" onValueChange={onValueChange} aria-label="Choice">
        <Radio seed={42} animate={false} value="a" label="Option A" />
        <Radio seed={43} animate={false} value="b" label="Option B" />
      </RadioGroup>,
    );

    await user.click(screen.getByRole("radio", { name: "Option B" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(screen.getByRole("radio", { name: "Option B" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("selects via keyboard Space on a focused radio", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <RadioGroup defaultValue="a" onValueChange={onValueChange} aria-label="Choice">
        <Radio seed={42} animate={false} value="a" label="Option A" />
        <Radio seed={43} animate={false} value="b" label="Option B" />
        <Radio seed={44} animate={false} value="c" label="Option C" />
      </RadioGroup>,
    );

    const second = screen.getByRole("radio", { name: "Option B" });
    second.focus();
    await user.keyboard(" ");
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(second).toHaveAttribute("aria-checked", "true");
  });

  it("renders with animate={false}", () => {
    renderWithProviders(
      <RadioGroup defaultValue="a" aria-label="Choice">
        <Radio seed={42} animate={false} value="a" label="Option A" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "Option A" })).toBeInTheDocument();
  });

  it("respects prefers-reduced-motion", () => {
    setPrefersReducedMotion(true);
    renderWithProviders(
      <RadioGroup defaultValue="a" aria-label="Choice">
        <Radio seed={42} value="a" label="Option A" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "Option A" })).toBeInTheDocument();
  });
});
