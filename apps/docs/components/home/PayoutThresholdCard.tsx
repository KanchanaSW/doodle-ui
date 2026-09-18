"use client";

import { useState } from "react";
import { Button, Card, Select, Slider, Textarea } from "doodleui-react";

export function PayoutThresholdCard() {
  const [amount, setAmount] = useState([2500]);

  return (
    <Card title="Payout Threshold" shadow={false} style={{ width: "100%" }}>
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <p className="m-0 text-sm font-medium">Currency</p>
          <Select
            aria-label="Currency"
            defaultValue="usd"
            options={[
              { value: "usd", label: "USD · US Dollar" },
              { value: "eur", label: "EUR · Euro" },
              { value: "gbp", label: "GBP · Pound" },
            ]}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium">Minimum payout</span>
            <span className="text-sm tabular-nums font-medium">
              ${(amount[0] ?? 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <Slider
            value={amount}
            onValueChange={setAmount}
            min={100}
            max={10000}
            step={50}
            aria-label="Minimum payout amount"
          />
        </div>

        <Textarea
          label="Notes"
          placeholder="Optional payout instructions…"
          rows={3}
        />

        <Button style={{ width: "100%" }}>Save Threshold</Button>
      </div>
    </Card>
  );
}
