"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ease a number toward `target`. When `enabled` is false, snap immediately.
 */
export function useTweenNumber(
  target: number,
  enabled: boolean,
  duration: number = 400,
): number {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);
  valueRef.current = value;

  useEffect(() => {
    if (!enabled) {
      valueRef.current = target;
      setValue(target);
      return;
    }

    const from = valueRef.current;
    if (from === target) return;

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      const next = from + (target - from) * eased;
      valueRef.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled, duration]);

  return enabled ? value : target;
}
