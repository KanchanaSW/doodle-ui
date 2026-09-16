"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import type { SketchProps } from "../types";
import { cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";
import { Button } from "./Button";

const SIDEBAR_WIDTH = 240;
const SIDEBAR_WIDTH_COLLAPSED = 56;

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  collapsed: boolean;
  toggleCollapsed: () => void;
  ink: string;
  paper: string;
  sketch: SketchProps;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/**
 * Sidebar layout state from {@link SidebarProvider}.
 *
 * @returns Open/collapse flags, palette tokens, and shared sketch props.
 * @throws When used outside `<SidebarProvider>`.
 *
 * @example
 * const { collapsed, toggleCollapsed } = useSidebar();
 */
export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("Sidebar parts must be used inside <SidebarProvider>.");
  }
  return ctx;
}

/**
 * Props for {@link SidebarProvider}.
 */
export interface SidebarProviderProps extends SketchProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultCollapsed?: boolean;
  children?: ReactNode;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  defaultCollapsed = false,
  children,
  roughness,
  seed,
  sketchColor,
  bowing,
  strokeWidth,
}: SidebarProviderProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = useCallback(
    (next: boolean) => {
      onOpenChange?.(next);
      if (openProp === undefined) {
        setUncontrolledOpen(next);
      }
    },
    [onOpenChange, openProp],
  );
  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);
  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;
  const paper = theme.paper;
  const value = useMemo(
    () => ({
      open,
      setOpen,
      collapsed,
      toggleCollapsed,
      ink,
      paper,
      sketch: { roughness, seed, sketchColor: ink, bowing, strokeWidth },
    }),
    [
      open,
      setOpen,
      collapsed,
      toggleCollapsed,
      ink,
      paper,
      roughness,
      seed,
      bowing,
      strokeWidth,
    ],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

/**
 * Props for {@link Sidebar}.
 */
export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  side?: "left" | "right";
  fill?: string;
}

/**
 * Collapsible application sidebar layout.
 *
 * @example
 * <Sidebar />
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { className, style, children, fill, side = "left", ...rest },
  ref,
) {
  const { open, collapsed, ink, paper, sketch } = useSidebar();
  const resolvedSeed = useResolvedSeed(sketch.seed);
  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH;

  if (!open) {
    return null;
  }

  return (
    <aside
      ref={ref}
      className={cn(className)}
      style={{
        position: "relative",
        flexShrink: 0,
        width,
        minHeight: 200,
        transition: "width 200ms ease",
        display: "flex",
        flexDirection: "column",
        background: fill ?? paper,
        color: ink,
        ...style,
      }}
      data-side={side}
      {...rest}
    >
      {children}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 4,
          ...(side === "left" ? { right: 0 } : { left: 0 }),
          pointerEvents: "none",
        }}
      >
        <RoughSvg
          shape="line-vertical"
          roughness={sketch.roughness}
          seed={resolvedSeed}
          sketchColor={sketch.sketchColor ?? ink}
          bowing={sketch.bowing}
          strokeWidth={sketch.strokeWidth ?? 1.5}
        />
      </span>
    </aside>
  );
});

export function SidebarHeader({
  className,
  style,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const { collapsed, ink } = useSidebar();
  return (
    <div
      className={cn(className)}
      style={{
        padding: collapsed ? "12px 8px" : "16px 14px",
        borderBottom: `1px solid ${ink}22`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SidebarContent({
  className,
  style,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(className)}
      style={{
        flex: 1,
        overflow: "auto",
        padding: "8px 6px",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SidebarFooter({
  className,
  style,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const { ink } = useSidebar();
  return (
    <div
      className={cn(className)}
      style={{
        padding: "12px 10px",
        borderTop: `1px solid ${ink}22`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SidebarGroup({
  className,
  style,
  children,
  title,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { title?: ReactNode }) {
  const { collapsed, ink } = useSidebar();
  return (
    <div
      className={cn(className)}
      style={{ marginBottom: 12, ...style }}
      {...rest}
    >
      {title && !collapsed ? (
        <div
          style={{
            padding: "4px 10px 8px",
            fontSize: 11,
            fontWeight: doodleUiFontWeight(600),
            fontFamily: doodleUiFontFamily,
            color: ink,
            opacity: 0.65,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {title}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/**
 * Props for {@link SidebarItem}.
 */
export interface SidebarItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
  function SidebarItem(
    { className, style, children, active, ...rest },
    ref,
  ) {
    const { collapsed, ink, sketch } = useSidebar();
    return (
      <Button
        ref={ref}
        type="button"
        variant={active ? "secondary" : "ghost"}
        className={cn(className)}
        style={{
          width: "100%",
          justifyContent: collapsed ? "center" : "flex-start",
          marginBottom: 4,
          ...style,
        }}
        roughness={sketch.roughness}
        seed={sketch.seed}
        sketchColor={ink}
        bowing={sketch.bowing}
        strokeWidth={sketch.strokeWidth}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

export function SidebarTrigger({
  className,
  style,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleCollapsed, sketch, ink } = useSidebar();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(className)}
      style={style}
      onClick={toggleCollapsed}
      roughness={sketch.roughness}
      seed={sketch.seed}
      sketchColor={ink}
      bowing={sketch.bowing}
      strokeWidth={sketch.strokeWidth}
      {...rest}
    >
      {children ?? "Toggle"}
    </Button>
  );
}

/**
 * Props for {@link SidebarLayout}.
 */
export interface SidebarLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function SidebarLayout({
  className,
  style,
  children,
  ...rest
}: SidebarLayoutProps) {
  return (
    <div
      className={cn(className)}
      style={{
        display: "flex",
        width: "100%",
        minHeight: 280,
        alignItems: "stretch",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SidebarInset({
  className,
  style,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(className)}
      style={{
        flex: 1,
        padding: 16,
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
