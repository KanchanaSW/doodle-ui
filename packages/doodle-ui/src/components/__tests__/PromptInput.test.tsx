import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PromptInput, ChatInput } from "../PromptInput";
import { renderWithProviders } from "../../test/test-utils";

describe("PromptInput", () => {
  it("renders with placeholder and voice button by default", () => {
    renderWithProviders(
      <PromptInput placeholder="Ask anything..." animate={false} />,
    );

    const input = screen.getByPlaceholderText("Ask anything...");
    expect(input).toBeInTheDocument();

    const voiceBtn = screen.getByRole("button", { name: "Voice input" });
    expect(voiceBtn).toBeInTheDocument();

    expect(screen.queryByRole("button", { name: "Send message" })).not.toBeInTheDocument();
  });

  it("shows send button and hides voice button when input is focused", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PromptInput animate={false} />);

    const input = screen.getByPlaceholderText("Ask anything...");
    await user.click(input);

    expect(screen.getByRole("button", { name: "Send message" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Voice input" })).not.toBeInTheDocument();
  });

  it("calls onVoiceClick when voice button is clicked", async () => {
    const onVoiceClick = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <PromptInput onVoiceClick={onVoiceClick} animate={false} />,
    );

    const voiceBtn = screen.getByRole("button", { name: "Voice input" });
    await user.click(voiceBtn);

    expect(onVoiceClick).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit when send button is clicked", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<PromptInput onSubmit={onSubmit} animate={false} />);

    const input = screen.getByPlaceholderText("Ask anything...");
    await user.type(input, "What is the capital of France?");

    const sendBtn = screen.getByRole("button", { name: "Send message" });
    await user.click(sendBtn);

    expect(onSubmit).toHaveBeenCalledWith("What is the capital of France?");
  });

  it("calls onSubmit when Enter key is pressed", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<PromptInput onSubmit={onSubmit} animate={false} />);

    const input = screen.getByPlaceholderText("Ask anything...");
    await user.type(input, "Hello AI{enter}");

    expect(onSubmit).toHaveBeenCalledWith("Hello AI");
  });

  it("reverts to voice button when blurred and empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <div>
        <PromptInput animate={false} />
        <button type="button">Outside</button>
      </div>,
    );

    const input = screen.getByPlaceholderText("Ask anything...");
    await user.click(input);
    expect(screen.getByRole("button", { name: "Send message" })).toBeInTheDocument();

    const outside = screen.getByRole("button", { name: "Outside" });
    await user.click(outside);

    expect(screen.queryByRole("button", { name: "Send message" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Voice input" })).toBeInTheDocument();
  });

  it("keeps send button visible after blur if input has text", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <div>
        <PromptInput animate={false} />
        <button type="button">Outside</button>
      </div>,
    );

    const input = screen.getByPlaceholderText("Ask anything...");
    await user.type(input, "Draft an email");

    const outside = screen.getByRole("button", { name: "Outside" });
    await user.click(outside);

    expect(screen.getByRole("button", { name: "Send message" })).toBeInTheDocument();
  });

  it("supports disabled state", () => {
    renderWithProviders(<PromptInput disabled animate={false} />);

    const input = screen.getByPlaceholderText("Ask anything...");
    expect(input).toBeDisabled();

    const voiceBtn = screen.getByRole("button", { name: "Voice input" });
    expect(voiceBtn).toBeDisabled();
  });

  it("supports controlled value", async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <PromptInput value="Controlled test" onChange={onChange} animate={false} />,
    );

    const input = screen.getByDisplayValue("Controlled test");
    expect(input).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send message" })).toBeInTheDocument();
  });

  it("renders with sketch variant without error", () => {
    const { container } = renderWithProviders(
      <PromptInput variant="sketch" seed={42} animate={false} />,
    );

    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders custom voiceIcon and sendIcon", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PromptInput
        voiceIcon={<span data-testid="custom-voice">MIC</span>}
        sendIcon={<span data-testid="custom-send">FLY</span>}
        animate={false}
      />,
    );

    expect(screen.getByTestId("custom-voice")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Ask anything...");
    await user.click(input);

    expect(screen.getByTestId("custom-send")).toBeInTheDocument();
  });

  it("renders spinner when loading is true", () => {
    renderWithProviders(
      <PromptInput showSendButton loading animate={false} />,
    );

    const sendBtn = screen.getByRole("button", { name: "Send message" });
    expect(sendBtn).toBeInTheDocument();
    expect(sendBtn.querySelector("svg")).toBeTruthy();
  });

  it("exports ChatInput as an alias", () => {
    expect(ChatInput).toBe(PromptInput);
  });
});

