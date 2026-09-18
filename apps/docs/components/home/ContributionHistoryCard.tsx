"use client";

import { Badge, Button, Card, RoughSvg } from "doodleui-react";

const BARS = [
  { label: "Jan", height: 42 },
  { label: "Feb", height: 68 },
  { label: "Mar", height: 54 },
  { label: "Apr", height: 88 },
  { label: "May", height: 72 },
];

export function ContributionHistoryCard() {
  return (
    <Card title="Contribution History" shadow={false} style={{ width: "100%" }}>
      <div className="grid gap-4">
        <div
          className="flex items-end justify-between gap-2"
          style={{ height: 120 }}
          role="img"
          aria-label="Monthly contribution bar chart"
        >
          {BARS.map((bar, index) => (
            <div
              key={bar.label}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
            >
              <div
                className="relative w-full max-w-[28px]"
                style={{ height: `${bar.height}%`, minHeight: 12 }}
              >
                <RoughSvg
                  shape="rectangle"
                  seed={40 + index}
                  fill="currentColor"
                  fillStyle="solid"
                  roughness={1.4}
                  strokeWidth={1.25}
                  style={{ color: "var(--ink)" }}
                />
              </div>
              <span className="text-[11px] text-mute">{bar.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Upcoming</Badge>
          <span className="text-sm text-mute">Savings Plan · Jun 12</span>
        </div>

        <p className="m-0 text-sm text-mute leading-relaxed">
          Average contribution up 12% vs last quarter. Next auto-deposit lands
          in 9 days.
        </p>

        <Button variant="outline" style={{ width: "100%" }}>
          View Full Report
        </Button>
      </div>
    </Card>
  );
}
