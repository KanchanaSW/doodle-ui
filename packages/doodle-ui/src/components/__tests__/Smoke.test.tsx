import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { Card } from "../Card";
import { Divider } from "../Divider";
import { Kbd } from "../Kbd";
import { Progress } from "../Progress";
import { Text } from "../Typography";
import { renderWithProviders } from "../../test/test-utils";

describe("presentational smoke tests", () => {
  it("renders Button without crashing", () => {
    renderWithProviders(<Button seed={42}>Sketch</Button>);
    expect(screen.getByRole("button", { name: "Sketch" })).toBeInTheDocument();
  });

  it("renders Badge without crashing", () => {
    renderWithProviders(<Badge seed={42}>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders Card without crashing", () => {
    renderWithProviders(
      <Card seed={42} title="Notebook">
        Contents
      </Card>,
    );
    expect(screen.getByText("Notebook")).toBeInTheDocument();
    expect(screen.getByText("Contents")).toBeInTheDocument();
  });

  it("renders Avatar without crashing", () => {
    const { container } = renderWithProviders(
      <Avatar seed={42} fallback="KS" alt="Kanchana" />,
    );
    expect(container.querySelector("span")).toBeTruthy();
  });

  it("renders Divider without crashing", () => {
    const { container } = renderWithProviders(<Divider seed={42} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders Progress without crashing", () => {
    renderWithProviders(
      <Progress seed={42} value={40} aria-label="Loading" />,
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders Kbd without crashing", () => {
    renderWithProviders(<Kbd seed={42}>⌘K</Kbd>);
    expect(screen.getByText("⌘K")).toBeInTheDocument();
  });

  it("renders Typography Text without crashing", () => {
    renderWithProviders(<Text>Hello sketch world</Text>);
    expect(screen.getByText("Hello sketch world")).toBeInTheDocument();
  });
});
