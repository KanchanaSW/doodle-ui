import { afterEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { RadialProgress } from "../RadialProgress";
import {
  renderWithProviders,
  setPrefersReducedMotion,
} from "../../test/test-utils";
import { resetPrefersReducedMotion } from "../../test/match-media";

describe("RadialProgress", () => {
  afterEach(() => {
    resetPrefersReducedMotion();
    setPrefersReducedMotion(false);
  });

  it("renders determinate progress with aria-valuenow", () => {
    renderWithProviders(
      <RadialProgress seed={42} value={75} max={100} />,
    );
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "75");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("renders indeterminate loader with aria-busy and Loading label", () => {
    renderWithProviders(<RadialProgress seed={42} />);
    const bar = screen.getByRole("progressbar", { name: "Loading" });
    expect(bar).toHaveAttribute("aria-busy", "true");
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  it("supports custom formatValue", () => {
    renderWithProviders(
      <RadialProgress
        seed={42}
        value={3}
        max={10}
        formatValue={(v, m) => `${v} of ${m}`}
      />,
    );
    expect(screen.getByText("3 of 10")).toBeInTheDocument();
  });

  it("renders custom children in the center", () => {
    renderWithProviders(
      <RadialProgress seed={42} value={40}>
        Go
      </RadialProgress>,
    );
    expect(screen.getByText("Go")).toBeInTheDocument();
    expect(screen.queryByText("40%")).not.toBeInTheDocument();
  });

  it("hides center value when showValue is false", () => {
    renderWithProviders(
      <RadialProgress seed={42} value={50} showValue={false} />,
    );
    expect(screen.queryByText("50%")).not.toBeInTheDocument();
  });

  it("clamps value between 0 and max", () => {
    renderWithProviders(
      <RadialProgress seed={42} value={150} max={100} />,
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });

  it("draws the expected number of tick lines", () => {
    const { container } = renderWithProviders(
      <RadialProgress seed={42} value={50} tickCount={24} animate={false} />,
    );
    expect(container.querySelectorAll("line")).toHaveLength(24);
  });

  it("still renders when reduced motion is preferred", () => {
    setPrefersReducedMotion(true);
    renderWithProviders(
      <RadialProgress seed={42} value={60} />,
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "60",
    );
    expect(screen.getByText("60%")).toBeInTheDocument();
  });
});
