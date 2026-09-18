"use client";

import { Card, RoughSvg } from "doodleui-react";

const HOLDINGS = [
  {
    name: "Vanguard Total",
    ticker: "VTI",
    amount: "$84.20",
    bars: [40, 55, 48, 70, 62, 78],
  },
  {
    name: "S&P 500",
    ticker: "VOO",
    amount: "$62.15",
    bars: [50, 45, 60, 58, 72, 68],
  },
  {
    name: "Apple",
    ticker: "AAPL",
    amount: "$41.90",
    bars: [35, 42, 38, 55, 50, 64],
  },
];

function Sparkline({ bars, seedBase }: { bars: number[]; seedBase: number }) {
  return (
    <div
      className="flex items-end gap-0.5 h-8"
      aria-hidden
    >
      {bars.map((height, index) => (
        <div
          key={index}
          className="relative w-[5px]"
          style={{ height: `${height}%`, minHeight: 4 }}
        >
          <RoughSvg
            shape="rectangle"
            seed={seedBase + index}
            fill="currentColor"
            fillStyle="solid"
            roughness={1.2}
            strokeWidth={1}
            style={{ color: "var(--ink)" }}
          />
        </div>
      ))}
    </div>
  );
}

export function DividendIncomeCard() {
  return (
    <Card title="Q2 Dividend Income" shadow={false} style={{ width: "100%" }}>
      <ul className="m-0 p-0 list-none grid gap-4">
        {HOLDINGS.map((holding, index) => (
          <li
            key={holding.ticker}
            className="flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="m-0 text-sm font-medium truncate">{holding.name}</p>
              <p className="m-0 text-xs text-mute">{holding.ticker}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Sparkline bars={holding.bars} seedBase={80 + index * 10} />
              <span className="text-sm font-medium tabular-nums w-[4.5rem] text-right">
                {holding.amount}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
