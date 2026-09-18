"use client";

import { Card, Progress } from "doodleui-react";

const TARGETS = [
  {
    label: "Retirement",
    amount: "$420,000",
    value: 65,
  },
  {
    label: "Real Estate",
    amount: "$85,000",
    value: 32,
  },
];

export function SavingsTargetsCard() {
  return (
    <Card title="Savings Targets" shadow={false} style={{ width: "100%" }}>
      <div className="grid gap-5">
        {TARGETS.map((target) => (
          <div key={target.label} className="grid gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium">{target.label}</span>
              <span className="text-sm text-mute tabular-nums">
                {target.amount}
              </span>
            </div>
            <Progress value={target.value} aria-label={`${target.label} progress`} />
            <p className="m-0 text-xs text-mute tabular-nums">
              {target.value}% achieved
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
