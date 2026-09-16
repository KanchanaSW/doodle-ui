"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import {
  Command as CmdkCommand,
  CommandEmpty as CmdkEmpty,
  CommandGroup as CmdkGroup,
  CommandInput as CmdkInput,
  CommandItem as CmdkItem,
  CommandList as CmdkList,
  CommandSeparator as CmdkSeparator,
} from "cmdk";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { RoughSvg } from "../primitives/RoughSvg";
import { SketchBox } from "../primitives/SketchBox";
import type { SketchProps } from "../types";
import { cn, deriveSeed, doodleUiFontFamily } from "../utils";

interface CommandSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  paper: string;
  animate?: boolean;
}

const CommandSketchContext = createContext<CommandSketchContextValue | null>(
  null,
);

function useCommandSketch(): CommandSketchContextValue {
  const ctx = useContext(CommandSketchContext);
  if (!ctx) {
    throw new Error("Command parts must be used inside <Command>.");
  }
  return ctx;
}

export interface CommandProps
  extends Omit<ComponentPropsWithoutRef<typeof CmdkCommand>, "asChild">,
    SketchProps {
  children?: ReactNode;
  /**
   * Draw-in the panel border on mount.
   * Defaults to the DoodleUIProvider value (true).
   */
  animate?: boolean;
}

/**
 * Command palette / cmd+k style searchable list, built on `cmdk` with a
 * `SketchBox` frame. Compose with `CommandInput`, `CommandList`,
 * `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`.
 */
export const Command = forwardRef<HTMLDivElement, CommandProps>(
  function Command(
    {
      className,
      style,
      children,
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      hachureGap,
      hachureAngle,
      fillWeight,
      animate,
      ...rest
    },
    ref,
  ) {
    const resolvedSeed = useResolvedSeed(seed);
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;

    return (
      <CommandSketchContext.Provider
        value={{
          roughness,
          seed: resolvedSeed,
          sketchColor,
          bowing,
          fillStyle,
          strokeWidth,
          hachureGap,
          hachureAngle,
          fillWeight,
          resolvedSeed,
          ink,
          paper: theme.paper,
          animate,
        }}
      >
        <SketchBox
          className={cn(className)}
          style={{ color: ink, ...style }}
          roughness={roughness}
          seed={resolvedSeed}
          sketchColor={ink}
          bowing={bowing}
          fillStyle={fillStyle ?? "solid"}
          fill={theme.paper}
          strokeWidth={strokeWidth ?? 1.5}
          hachureGap={hachureGap}
          hachureAngle={hachureAngle}
          fillWeight={fillWeight}
          animate={animate}
          contentStyle={{ padding: 0, display: "flex", flexDirection: "column", color: ink }}
        >
          <CmdkCommand ref={ref} {...rest}>
            {children}
          </CmdkCommand>
        </SketchBox>
      </CommandSketchContext.Provider>
    );
  },
);

export interface CommandInputProps
  extends Omit<ComponentPropsWithoutRef<typeof CmdkInput>, "asChild"> {}

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
  function CommandInput({ className, style, ...rest }, ref) {
    const sketch = useCommandSketch();
    return (
      <div style={{ position: "relative", padding: "10px 12px 12px" }}>
        <CmdkInput
          ref={ref}
          className={cn(className)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: "none",
            outline: "none",
            background: "transparent",
            color: sketch.ink,
            fontFamily: doodleUiFontFamily,
            fontSize: 15,
            padding: "2px 2px 8px",
            ...style,
          }}
          {...rest}
        />
        <RoughSvg
          shape="line"
          roughness={(sketch.roughness ?? 1.5) + 0.2}
          seed={deriveSeed(sketch.resolvedSeed, "command-divider")}
          sketchColor={sketch.ink}
          bowing={sketch.bowing ?? 1.6}
          strokeWidth={1.2}
          inset={4}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, opacity: 0.4 }}
        />
      </div>
    );
  },
);

export interface CommandListProps
  extends Omit<ComponentPropsWithoutRef<typeof CmdkList>, "asChild"> {}

export const CommandList = forwardRef<HTMLDivElement, CommandListProps>(
  function CommandList({ className, style, ...rest }, ref) {
    return (
      <CmdkList
        ref={ref}
        className={cn(className)}
        style={{
          maxHeight: 280,
          overflowY: "auto",
          padding: "4px 4px 8px",
          ...style,
        }}
        {...rest}
      />
    );
  },
);

export interface CommandEmptyProps
  extends Omit<ComponentPropsWithoutRef<typeof CmdkEmpty>, "asChild"> {}

export const CommandEmpty = forwardRef<HTMLDivElement, CommandEmptyProps>(
  function CommandEmpty({ className, style, ...rest }, ref) {
    const sketch = useCommandSketch();
    return (
      <CmdkEmpty
        ref={ref}
        className={cn(className)}
        style={{
          padding: "16px 12px",
          textAlign: "center",
          fontFamily: doodleUiFontFamily,
          fontSize: 14,
          color: sketch.ink,
          opacity: 0.6,
          ...style,
        }}
        {...rest}
      />
    );
  },
);

export interface CommandGroupProps
  extends Omit<ComponentPropsWithoutRef<typeof CmdkGroup>, "asChild"> {}

export const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(
  function CommandGroup({ className, style, ...rest }, ref) {
    const sketch = useCommandSketch();
    return (
      <CmdkGroup
        ref={ref}
        className={cn(className)}
        style={{ padding: "4px 2px", color: sketch.ink, ...style }}
        {...rest}
      />
    );
  },
);

export interface CommandItemProps
  extends Omit<ComponentPropsWithoutRef<typeof CmdkItem>, "asChild"> {}

export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(
  function CommandItem(
    { className, style, children, onMouseEnter, onMouseLeave, ...rest },
    ref,
  ) {
    const sketch = useCommandSketch();
    const [highlighted, setHighlighted] = useState(false);

    return (
      <CmdkItem
        ref={ref}
        className={cn(className)}
        onMouseEnter={(event) => {
          setHighlighted(true);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setHighlighted(false);
          onMouseLeave?.(event);
        }}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 10px",
          borderRadius: 4,
          fontFamily: doodleUiFontFamily,
          fontSize: 14,
          color: sketch.ink,
          cursor: "pointer",
          userSelect: "none",
          outline: "none",
          ...style,
        }}
        {...rest}
      >
        {highlighted ? (
          <RoughSvg
            shape="line"
            roughness={(sketch.roughness ?? 1.5) + 0.4}
            seed={sketch.resolvedSeed}
            sketchColor={sketch.ink}
            bowing={sketch.bowing ?? 1.6}
            strokeWidth={1.3}
            inset={3}
            style={{ opacity: 0.4 }}
          />
        ) : null}
        <span style={{ position: "relative", zIndex: 1, flex: 1 }}>
          {children}
        </span>
      </CmdkItem>
    );
  },
);

export interface CommandSeparatorProps
  extends Omit<ComponentPropsWithoutRef<typeof CmdkSeparator>, "asChild"> {}

export const CommandSeparator = forwardRef<
  HTMLDivElement,
  CommandSeparatorProps
>(function CommandSeparator({ className, style, ...rest }, ref) {
  const sketch = useCommandSketch();
  return (
    <CmdkSeparator
      ref={ref}
      className={cn(className)}
      style={{ position: "relative", height: 10, margin: "2px 4px", ...style }}
      {...rest}
    >
      <RoughSvg
        shape="line"
        roughness={(sketch.roughness ?? 1.5) + 0.2}
        seed={deriveSeed(sketch.resolvedSeed, "command-separator")}
        sketchColor={sketch.ink}
        bowing={sketch.bowing ?? 1.8}
        strokeWidth={1.2}
        inset={4}
        style={{ opacity: 0.4 }}
      />
    </CmdkSeparator>
  );
});

export function CommandShortcut({
  children,
  className,
  style,
}: {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const sketch = useCommandSketch();
  return (
    <span
      className={cn(className)}
      style={{
        marginLeft: "auto",
        fontFamily: doodleUiFontFamily,
        fontSize: 12,
        color: sketch.ink,
        opacity: 0.5,
        letterSpacing: 0.4,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
