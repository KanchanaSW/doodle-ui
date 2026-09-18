"use client";

import { Button, Card, Input } from "doodleui-react";

export function MilestoneCard() {
  return (
    <Card title="Set a new milestone" shadow={false} style={{ width: "100%" }}>
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <Input label="Goal name" placeholder="Emergency fund" defaultValue="" />
        <Input
          label="Target amount"
          placeholder="$10,000"
          inputMode="decimal"
          defaultValue=""
        />
        <Input label="Target date" type="date" defaultValue="2026-12-31" />
        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="submit" size="sm">
            Create Milestone
          </Button>
          <Button type="button" size="sm" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
