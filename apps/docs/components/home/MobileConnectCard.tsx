"use client";

import { Card, RoughSvg } from "doodleui-react";

/** Deterministic QR-like grid for the mobile connect showcase. */
const QR_PATTERN = [
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
  [0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0],
  [1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
  [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0],
  [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0],
];

export function MobileConnectCard() {
  return (
    <Card title="Connect on mobile" shadow={false} style={{ width: "100%" }}>
      <div className="grid gap-4 place-items-center text-center">
        <div
          className="relative p-3"
          style={{ width: 168, height: 168 }}
          role="img"
          aria-label="QR code to open doodle-ui on your phone"
        >
          <RoughSvg
            shape="rectangle"
            seed={12}
            fill="var(--component-canvas)"
            fillStyle="solid"
            roughness={1.3}
            strokeWidth={1.5}
          />
          <div
            className="absolute inset-3 grid"
            style={{
              gridTemplateColumns: `repeat(${QR_PATTERN[0]?.length ?? 19}, 1fr)`,
              gap: 1.5,
            }}
          >
            {QR_PATTERN.flatMap((row, y) =>
              row.map((cell, x) => (
                <span
                  key={`${y}-${x}`}
                  className="block rounded-[1px]"
                  style={{
                    background: cell ? "var(--ink)" : "transparent",
                    opacity: cell ? 0.9 : 0,
                  }}
                />
              )),
            )}
          </div>
        </div>
        <p className="m-0 text-sm text-mute leading-relaxed max-w-[28ch]">
          Scan to open the live docs on your phone and try the sketch controls
          on the go.
        </p>
      </div>
    </Card>
  );
}
