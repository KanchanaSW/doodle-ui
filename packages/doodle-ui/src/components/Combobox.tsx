"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  DRAW_IN_DURATION_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
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

export interface ComboboxProps extends SketchProps {
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  /**
   * Draw-in the trigger on mount and the popover border on open.
   * Defaults to the DoodleUIProvider value (true).
   */
  animate?: boolean;
}

/**
 * Searchable select. Composes `Popover` (positioning) + `Command` (cmdk
 * filtering/list) behind a sketchy `Input`-styled trigger button — the same
 * recipe shadcn uses, since Radix has no dedicated Combobox primitive.
 */
export function Combobox({
  options,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyMessage = "No results.",
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  style,
  roughness,
  seed,
  sketchColor,
  bowing,
  fillStyle,
  strokeWidth,
  animate,
  "aria-label": ariaLabel,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const selectedValue = value ?? uncontrolled;
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  const ink = sketchColor ?? SKETCH_COLORS.ink;
  const resolvedSeed = useResolvedSeed(seed);
  const shouldAnimate = useAnimate(animate);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useDrawIn(triggerRef, DRAW_IN_DURATION_MS, shouldAnimate);

  function handleSelect(nextValue: string) {
    setUncontrolled(nextValue);
    onValueChange?.(nextValue);
    setOpen(false);
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={(node) => assignRef(triggerRef as never, node)}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          disabled={disabled}
          className={cn(className)}
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            width: "100%",
            minWidth: 200,
            minHeight: 38,
            padding: "8px 12px",
            border: "none",
            background: "transparent",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            color: ink,
            fontFamily: doodleUiFontFamily,
            fontSize: 15,
            lineHeight: 1.2,
            outline: "none",
            textAlign: "left",
            ...style,
          }}
        >
          <RoughSvg
            shape="rectangle"
            roughness={roughness}
            seed={resolvedSeed}
            sketchColor={open ? SKETCH_COLORS.accent : ink}
            bowing={bowing}
            fillStyle={fillStyle}
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
            style={{ position: "relative", zIndex: 1, width: 18, height: 18, flexShrink: 0 }}
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
