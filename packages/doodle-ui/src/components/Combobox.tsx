"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  DRAW_IN_DURATION_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { resolveInteractiveState } from "../primitives/interactive";
import { RoughSvg } from "../primitives/RoughSvg";
import {
  FIELD_SIZE_STYLES,
  resolveSize,
  SIZE_TOKENS,
  type DoodleSize,
} from "../primitives/size";
import type { SketchProps } from "../types";
import { assignRef, cn, doodleUiFontFamily } from "../utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./Command";
import type { SelectOption } from "./Select";

const CHEVRON_PATH = "M 4 6 L 10 12 L 16 6";

/**
 * Props for {@link Combobox}.
 */
export interface ComboboxProps extends SketchProps {
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  /** @default "md" */
  size?: DoodleSize;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  /**
   * Draw-in the trigger on mount and the popover border on open.
   * Defaults to the DoodleUIProvider value (true).
   */
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Searchable select. Composes `Popover` (positioning) + `Command` (cmdk
 * filtering/list) behind a sketchy `Input`-styled trigger button — the same
 * recipe shadcn uses, since Radix has no dedicated Combobox primitive.
 */
/**
 * Searchable select built from Popover and Command.
 *
 * @example
 * <Combobox />
 */
export function Combobox({
  options,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyMessage = "No results.",
  value,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen,
  onOpenChange,
  disabled,
  size: sizeProp = "md",
  className,
  style,
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
  "aria-label": ariaLabel,
}: ComboboxProps) {
  const size = resolveSize(sizeProp);
  const sizeTokens = SIZE_TOKENS[size];
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const open = openProp ?? uncontrolledOpen;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const selectedValue = value ?? uncontrolled;
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  const theme = useSketchTheme(sketchColor);
  const ink = sketchColor ?? theme.ink;
  const resolvedSeed = useResolvedSeed(seed);
  const shouldAnimate = useAnimate(animate);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const interactive = resolveInteractiveState({ disabled });
  useDrawIn(triggerRef, DRAW_IN_DURATION_MS, shouldAnimate);

  function handleOpenChange(nextOpen: boolean) {
    if (interactive.isDisabled && nextOpen) return;
    setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  function handleSelect(nextValue: string) {
    setUncontrolled(nextValue);
    onValueChange?.(nextValue);
    handleOpenChange(false);
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={(node) => assignRef(triggerRef as never, node)}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          disabled={interactive.isDisabled}
          aria-disabled={interactive.aria["aria-disabled"]}
          className={cn(className)}
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: sizeTokens.gap + 4,
            width: "100%",
            minWidth: 200,
            border: "none",
            background: "transparent",
            color: ink,
            fontFamily: doodleUiFontFamily,
            lineHeight: 1.2,
            outline: "none",
            textAlign: "left",
            ...FIELD_SIZE_STYLES[size],
            ...interactive.style,
            ...style,
          }}
        >
          <RoughSvg
            shape="rectangle"
            roughness={roughness}
            seed={resolvedSeed}
            sketchColor={open ? theme.accent : ink}
            bowing={bowing}
            fillStyle={fillStyle}
            hachureGap={hachureGap}
            hachureAngle={hachureAngle}
            fillWeight={fillWeight}
            strokeWidth={open ? (strokeWidth ?? 1.75) + 0.35 : strokeWidth}
          />
          <span
            style={{
              position: "relative",
              zIndex: 1,
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {selectedOption?.label ?? placeholder}
          </span>
          <span
            style={{
              position: "relative",
              zIndex: 1,
              width: sizeTokens.iconSize + 2,
              height: sizeTokens.iconSize + 2,
              flexShrink: 0,
            }}
          >
            <RoughSvg
              shape="path"
              path={CHEVRON_PATH}
              roughness={roughness ? roughness * 0.7 : 1.05}
              seed={resolvedSeed}
              sketchColor={ink}
              bowing={bowing}
              strokeWidth={(strokeWidth ?? 1.6) + 0.2}
              inset={0}
            />
          </span>
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          style={{
            zIndex: 80,
            outline: "none",
            width: "var(--radix-popover-trigger-width)",
          }}
        >
          <Command
            roughness={roughness}
            seed={resolvedSeed}
            sketchColor={ink}
            bowing={bowing}
            fillStyle={fillStyle}
            strokeWidth={strokeWidth}
            hachureGap={hachureGap}
            hachureAngle={hachureAngle}
            fillWeight={fillWeight}
            animate={animate}
          >
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    onSelect={handleSelect}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
