"use client";

import { forwardRef } from "react";
import {
  SlidingPanelClose,
  SlidingPanelContent,
  SlidingPanelDescription,
  SlidingPanelFooter,
  SlidingPanelHeader,
  SlidingPanelRoot,
  SlidingPanelTitle,
  SlidingPanelTrigger,
  type SlidingPanelContentProps,
  type SlidingPanelRootProps,
  type SlidingPanelSide,
} from "../primitives/SlidingPanel";

export type SheetProps = SlidingPanelRootProps & {
  side?: SlidingPanelSide;
};

export function Sheet({ side = "right", ...rest }: SheetProps) {
  return <SlidingPanelRoot side={side} {...rest} />;
}

export const SheetTrigger = SlidingPanelTrigger;
export const SheetClose = SlidingPanelClose;

export type SheetContentProps = SlidingPanelContentProps;

export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(
  function SheetContent(props, ref) {
    return <SlidingPanelContent ref={ref} {...props} />;
  },
);

export const SheetHeader = SlidingPanelHeader;
export const SheetFooter = SlidingPanelFooter;
export const SheetTitle = SlidingPanelTitle;
export const SheetDescription = SlidingPanelDescription;
