import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import {
  createMatchMedia,
  resetPrefersReducedMotion,
} from "./src/test/match-media";

afterEach(() => {
  cleanup();
  resetPrefersReducedMotion();
  document.body.style.pointerEvents = "";
  document.body.style.overflow = "";
  document.body.removeAttribute("data-scroll-locked");
  document.querySelectorAll("[data-radix-portal]").forEach((node) => node.remove());
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: vi.fn(createMatchMedia),
});

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: ResizeObserverStub,
});

// jsdom does not define SVG geometry constructors used by draw-in / rough.js.
if (typeof SVGElement !== "undefined") {
  if (typeof (globalThis as { SVGPathElement?: unknown }).SVGPathElement === "undefined") {
    class SVGPathElementStub extends SVGElement {}
    (globalThis as { SVGPathElement: typeof SVGElement }).SVGPathElement =
      SVGPathElementStub as unknown as typeof SVGElement;
  }
  if (typeof (globalThis as { SVGSVGElement?: unknown }).SVGSVGElement === "undefined") {
    class SVGSVGElementStub extends SVGElement {}
    (globalThis as { SVGSVGElement: typeof SVGElement }).SVGSVGElement =
      SVGSVGElementStub as unknown as typeof SVGElement;
  }

  SVGElement.prototype.getBBox = function getBBox() {
    return {
      x: 0,
      y: 0,
      width: 100,
      height: 40,
      top: 0,
      left: 0,
      bottom: 40,
      right: 100,
      toJSON() {
        return {};
      },
    } as DOMRect;
  };

  (
    SVGElement.prototype as SVGElement & {
      getTotalLength?: () => number;
    }
  ).getTotalLength = function getTotalLength() {
    return 100;
  };
}

Element.prototype.scrollIntoView = vi.fn();

// Web Animations API used by RadioDot / draw-in helpers.
if (!Element.prototype.animate) {
  Element.prototype.animate = function animate() {
    return {
      cancel: () => {},
      finished: Promise.resolve(),
      play: () => {},
      pause: () => {},
      finish: () => {},
      reverse: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
      onfinish: null,
      oncancel: null,
      currentTime: 0,
      playbackRate: 1,
      playState: "finished",
      effect: null,
      id: "",
      pending: false,
      replaceState: "active",
      startTime: 0,
      timeline: null,
      commitStyles: () => {},
      persist: () => {},
      updatePlaybackRate: () => {},
    } as unknown as Animation;
  };
}

HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
  return {
    x: 0,
    y: 0,
    width: 120,
    height: 40,
    top: 0,
    left: 0,
    bottom: 40,
    right: 120,
    toJSON() {
      return {};
    },
  } as DOMRect;
};

// Radix primitives expect Pointer Capture APIs.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}

if (typeof window.PointerEvent === "undefined") {
  class PointerEventStub extends MouseEvent {
    pointerId: number;
    pointerType: string;
    isPrimary: boolean;
    constructor(type: string, props: PointerEventInit = {}) {
      super(type, props);
      this.pointerId = props.pointerId ?? 1;
      this.pointerType = props.pointerType ?? "mouse";
      this.isPrimary = props.isPrimary ?? true;
    }
  }
  (
    window as unknown as { PointerEvent: typeof PointerEvent }
  ).PointerEvent = PointerEventStub as unknown as typeof PointerEvent;
}
