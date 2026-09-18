"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` that falls back to `useEffect` during SSR.
 *
 * Chosen at module evaluation time so Node SSR bundles never call
 * `useLayoutEffect` (avoids React's "does not do anything on the server" warning).
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
