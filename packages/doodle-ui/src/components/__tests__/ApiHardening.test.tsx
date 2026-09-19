import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Button } from "../Button";
import { Badge } from "../Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import { renderWithProviders } from "../../test/test-utils";

describe("Button API hardening", () => {
  it("forwards ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    renderWithProviders(
      <Button ref={ref} seed={42} animate={false}>
        Save
      </Button>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toContain("Save");
  });

  it("renders asChild onto an anchor", () => {
    renderWithProviders(
      <Button asChild seed={42} animate={false}>
        <a href="/docs">Docs</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveStyle({ position: "relative" });
  });

  it("shows spinner and sets aria-busy when loading", () => {
    renderWithProviders(
      <Button loading seed={42} animate={false}>
        Save
      </Button>,
    );
    const btn = screen.getByRole("button", { name: /Save/i });
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
  });

  it("applies disabled treatment", () => {
    renderWithProviders(
      <Button disabled seed={42} animate={false}>
        Save
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-disabled", "true");
  });

  it("renders start and end icons", () => {
    renderWithProviders(
      <Button
        seed={42}
        animate={false}
        startIcon={<span data-testid="start">S</span>}
        endIcon={<span data-testid="end">E</span>}
      >
        Go
      </Button>,
    );
    expect(screen.getByTestId("start")).toBeInTheDocument();
    expect(screen.getByTestId("end")).toBeInTheDocument();
  });

  it("warns when icon-only without aria-label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderWithProviders(
      <Button
        seed={42}
        animate={false}
        startIcon={<span>*</span>}
        aria-label={undefined}
      />,
    );
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("does not warn when icon-only has aria-label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderWithProviders(
      <Button
        seed={42}
        animate={false}
        startIcon={<span>*</span>}
        aria-label="Search"
      />,
    );
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe("Badge asChild", () => {
  it("merges onto an anchor", () => {
    renderWithProviders(
      <Badge asChild seed={42} animate={false}>
        <a href="/tags/art">Art</a>
      </Badge>,
    );
    expect(screen.getByRole("link", { name: "Art" })).toHaveAttribute(
      "href",
      "/tags/art",
    );
  });
});

describe("Card compound", () => {
  it("renders namespaced and named exports", () => {
    renderWithProviders(
      <Card seed={42} animate={false}>
        <Card.Header>
          <Card.Title>Notes</Card.Title>
        </Card.Header>
        <CardContent>Body copy</CardContent>
      </Card>,
    );
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Body copy")).toBeInTheDocument();
  });

  it("preserves legacy title/footer props", () => {
    renderWithProviders(
      <Card seed={42} animate={false} title="Legacy" footer="Foot">
        Child
      </Card>,
    );
    expect(screen.getByText("Legacy")).toBeInTheDocument();
    expect(screen.getByText("Foot")).toBeInTheDocument();
  });
});

describe("Card asChild", () => {
  it("renders as article", () => {
    renderWithProviders(
      <Card asChild seed={42} animate={false}>
        <article data-testid="card-article">Inside</article>
      </Card>,
    );
    expect(screen.getByTestId("card-article").tagName).toBe("ARTICLE");
  });
});
