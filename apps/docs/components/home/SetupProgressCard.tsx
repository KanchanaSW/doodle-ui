"use client";

import { Alert, Button, Card, Stepper } from "doodleui-react";

export function SetupProgressCard() {
  return (
    <Card title="Account Setup" shadow={false} style={{ width: "100%" }}>
      <div className="grid gap-4">
        <Stepper
          steps={["Profile", "Payout", "Verify"]}
          current={1}
        />
        <Alert variant="info" title="Almost there">
          Add a bank account to unlock claimable balance transfers.
        </Alert>
        <Button size="sm" style={{ justifySelf: "start" }}>
          Continue Setup
        </Button>
      </div>
    </Card>
  );
}
