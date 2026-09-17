type MatchMediaListener = (event: MediaQueryListEvent) => void;

let reducedMotion = false;

/** Toggle `prefers-reduced-motion` for specific tests. */
export function setPrefersReducedMotion(value: boolean) {
  reducedMotion = value;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("prefers-reduced-motion-change"));
  }
}

export function resetPrefersReducedMotion() {
  reducedMotion = false;
}

export function createMatchMedia(query: string): MediaQueryList {
  const listeners = new Set<MatchMediaListener>();
  const isReduce =
    query.includes("prefers-reduced-motion") && query.includes("reduce");

  const mql = {
    get matches() {
      return isReduce ? reducedMotion : false;
    },
    media: query,
    onchange: null,
    addListener(listener: MatchMediaListener) {
      listeners.add(listener);
    },
    removeListener(listener: MatchMediaListener) {
      listeners.delete(listener);
    },
    addEventListener(_type: string, listener: MatchMediaListener) {
      listeners.add(listener);
    },
    removeEventListener(_type: string, listener: MatchMediaListener) {
      listeners.delete(listener);
    },
    dispatchEvent(_event: Event) {
      return false;
    },
  } as MediaQueryList;

  if (typeof window !== "undefined") {
    window.addEventListener("prefers-reduced-motion-change", () => {
      const event = {
        matches: mql.matches,
        media: query,
      } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    });
  }

  return mql;
}
