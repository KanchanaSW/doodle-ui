"use client";

import { Badge, Card, Divider } from "doodleui-react";

const ROWS = [
  { label: "Royalties", value: "$1,248.75" },
  { label: "Platform fee", value: "−$37.46" },
];

export function ClaimableBalanceCard() {
  return (
    <Card
      title={
        <span className="flex items-center justify-between gap-3 w-full">
          Claimable Balance
          <Badge variant="accent">Pending Setup</Badge>
        </span>
      }
      shadow={false}
      style={{ width: "100%" }}
    >
      <div className="grid gap-4">
        <p className="m-0 text-3xl md:text-4xl font-semibold tracking-tight tabular-nums">
          $1,211.29
        </p>
        <p className="m-0 text-sm text-mute">
          Available once payout details are verified.
        </p>
        <Divider />
        <ul className="m-0 p-0 list-none grid gap-2.5">
          {ROWS.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="text-mute">{row.label}</span>
              <span className="tabular-nums font-medium">{row.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
