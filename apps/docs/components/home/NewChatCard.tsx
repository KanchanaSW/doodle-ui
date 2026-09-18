"use client";

import { Button, Card, Input } from "doodleui-react";

const MESSAGES = [
  {
    role: "assistant" as const,
    text: "Want a hand-drawn button that shuffles on hover?",
  },
  {
    role: "user" as const,
    text: "Yes — primary, outline, and a ghost variant.",
  },
  {
    role: "assistant" as const,
    text: "Done. Import Button from doodleui-react and wrap with SketchSeedProvider.",
  },
];

export function NewChatCard() {
  return (
    <Card title="New Chat" shadow={false} style={{ width: "100%" }}>
      <div className="grid gap-3">
        <div className="grid gap-2.5 min-h-[140px]">
          {MESSAGES.map((message, index) => (
            <div
              key={index}
              className={`text-sm leading-relaxed px-3 py-2 max-w-[92%] ${
                message.role === "user" ? "justify-self-end text-right" : ""
              }`}
              style={{
                background:
                  message.role === "user"
                    ? "color-mix(in srgb, var(--accent) 18%, transparent)"
                    : "color-mix(in srgb, var(--ink) 6%, transparent)",
                borderRadius: 10,
              }}
            >
              {message.text}
            </div>
          ))}
        </div>
        <form
          className="flex items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="flex-1 min-w-0">
            <Input placeholder="Ask about a component…" aria-label="Chat message" />
          </div>
          <Button type="submit" size="sm">
            Send
          </Button>
        </form>
      </div>
    </Card>
  );
}
