"use client";

import { Button, Card, Input } from "doodleui-react";

export function AccountAccessCard() {
  return (
    <Card title="Account Access" shadow={false} style={{ width: "100%" }}>
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <Input
          label="Email"
          type="email"
          defaultValue="you@studio.ink"
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          defaultValue="••••••••••••"
          autoComplete="current-password"
        />
        <Button type="submit" style={{ width: "100%" }}>
          Update Security
        </Button>
        <p className="m-0 text-xs text-mute leading-relaxed">
          Danger zone · changing email requires re-verification within 24 hours.
        </p>
      </form>
    </Card>
  );
}
