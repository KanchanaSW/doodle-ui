"use client";

import { useBaseRoughness } from "../hooks/useSketchDefaults";
import {
  createContext,
  forwardRef,
  useContext,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type ReactNode,
} from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  DRAW_IN_DURATION_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { resolveInteractiveState } from "../primitives/interactive";
import { RoughSvg } from "../primitives/RoughSvg";
import { SketchBox } from "../primitives/SketchBox";
import {
  FIELD_SIZE_STYLES,
  resolveSize,
  SIZE_TOKENS,
  type DoodleSize,
} from "../primitives/size";
import {
  useFieldValidation,
  ValidationMessage,
  type ValidationProps,
} from "../primitives/validation";
import type { SketchProps } from "../types";
import { assignRef, cn, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

const CHEVRON_PATH = "M 4 6 L 10 12 L 16 6";
const UNDERLINE_INSET = 4;

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

interface SelectSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  paper: string;
  accent: string;
  selectedValue?: string;
  selectedLabel?: ReactNode;
  placeholder?: string;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
  size: DoodleSize;
  validationStroke?: string;
  validationAria?: {
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
  };
}

const SelectSketchContext = createContext<SelectSketchContextValue | null>(
  null,
);

function useSelectSketch(): SelectSketchContextValue {
  const ctx = useContext(SelectSketchContext);
  if (!ctx) {
    throw new Error("Select parts must be used inside <Select>.");
  }
  return ctx;
}

/**
 * Props for {@link Select}.
 */
export interface SelectProps
  extends Omit<SelectPrimitive.SelectProps, "children">,
    SketchProps,
    ValidationProps {
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  fill?: string;
  /** @default "md" */
  size?: DoodleSize;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

/**
 * Dropdown select with sketch trigger and menu.
 *
 * @example
 * <Select />
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  function Select(
    {
      options,
      placeholder = "Select…",
      className,
      style,
      fill,
      roughness,
      seed,
      sketchColor,
      bowing,
      fillStyle,
      strokeWidth,
      hachureGap,
      hachureAngle,
      fillWeight,
      value,
      defaultValue,
      onValueChange,
      animate,
      size: sizeProp = "md",
      disabled,
      name,
      required,
      invalid,
      error,
      errorMessage,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalidProp,
      ...rest
    },
    ref,
  ) {
    const size = resolveSize(sizeProp);
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const selectedValue = value ?? uncontrolled;
    const selectedLabel = options.find((option) => option.value === selectedValue)
      ?.label;
    const resolvedSeed = useResolvedSeed(seed);
    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const interactive = resolveInteractiveState({ disabled });
    const validation = useFieldValidation(
      { invalid, error, errorMessage },
      { describedBy: ariaDescribedBy, errorColor: theme.error },
    );
    const isControlled = value !== undefined;
    const rootValueProps = isControlled
      ? { value }
      : { defaultValue };

    return (
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          width: "100%",
          ...interactive.style,
        }}
      >
        <SelectSketchContext.Provider
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
            paper: fill ?? theme.paper,
            accent: theme.accent,
            selectedValue,
            selectedLabel,
            placeholder,
            animate,
            size,
            validationStroke: validation.strokeOverride,
            validationAria: {
              "aria-invalid":
                validation.ariaInvalid ??
                (ariaInvalidProp === true || ariaInvalidProp === "true"
                  ? true
                  : ariaInvalidProp === false || ariaInvalidProp === "false"
                    ? false
                    : undefined),
              "aria-describedby": validation.describedBy,
            },
          }}
        >
          <SelectPrimitive.Root
            {...rootValueProps}
            onValueChange={(next) => {
              setUncontrolled(next);
              onValueChange?.(next);
            }}
            disabled={interactive.isDisabled}
            name={name}
            required={required}
            {...rest}
          >
            <SelectTrigger
              ref={ref}
              className={className}
              style={style}
              placeholder={placeholder}
              aria-label={ariaLabel}
              aria-disabled={interactive.aria["aria-disabled"]}
            />
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectPrimitive.Root>
        </SelectSketchContext.Provider>
        <ValidationMessage
          id={validation.errorId}
          style={validation.messageStyle}
        >
          {validation.errorMessage}
        </ValidationMessage>
      </div>
    );
  },
);

/**
 * Props for {@link SelectTrigger}.
 */
export interface SelectTriggerProps
  extends Omit<SelectPrimitive.SelectTriggerProps, "asChild"> {
  placeholder?: string;
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger(
    { className, style, placeholder, children, ...rest },
    ref,
  ) {
    const sketch = useSelectSketch();
    const [openish, setOpenish] = useState(false);
    const rootRef = useRef<HTMLButtonElement>(null);
    const baseRoughness = useBaseRoughness();
    const shouldAnimate = useAnimate(sketch.animate);
    const sizeTokens = SIZE_TOKENS[sketch.size];
    useDrawIn(rootRef, DRAW_IN_DURATION_MS, shouldAnimate);
    const borderColor =
      sketch.validationStroke ?? (openish ? sketch.accent : sketch.ink);

    return (
      <SelectPrimitive.Trigger
        ref={(node) => {
          (rootRef as MutableRefObject<HTMLButtonElement | null>).current =
            node;
          assignRef(ref, node);
        }}
        className={cn(className)}
        onPointerDown={() => setOpenish(true)}
        onBlur={() => setOpenish(false)}
        aria-invalid={sketch.validationAria?.["aria-invalid"]}
        aria-describedby={sketch.validationAria?.["aria-describedby"]}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: sizeTokens.gap + 4,
          minWidth: 180,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: sketch.ink,
          fontFamily: doodleUiFontFamily,
          lineHeight: 1.2,
          outline: "none",
          textAlign: "left",
          ...FIELD_SIZE_STYLES[sketch.size],
          ...style,
        }}
        {...rest}
      >
        <RoughSvg
          shape="rectangle"
          roughness={sketch.roughness}
          seed={sketch.resolvedSeed}
          sketchColor={borderColor}
          bowing={sketch.bowing}
          fillStyle={sketch.fillStyle}
          strokeWidth={
            openish
              ? (sketch.strokeWidth ?? 1.75) + 0.35
              : sketch.strokeWidth
          }
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
          {children ?? sketch.selectedLabel ?? placeholder}
        </span>
        <SelectPrimitive.Icon
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
            roughness={(sketch.roughness ?? baseRoughness) * 0.7}
            seed={sketch.resolvedSeed}
            sketchColor={sketch.ink}
            bowing={sketch.bowing}
            strokeWidth={(sketch.strokeWidth ?? 1.6) + 0.2}
            inset={0}
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    );
  },
);

/**
 * Props for {@link SelectContent}.
 */
export interface SelectContentProps
  extends Omit<SelectPrimitive.SelectContentProps, "asChild" | "position"> {
  children?: ReactNode;
  fill?: string;
}

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent({ className, style, children, fill, ...rest }, ref) {
    const sketch = useSelectSketch();

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          position="popper"
          sideOffset={6}
          className={cn(className)}
          style={{
            zIndex: 80,
            outline: "none",
            minWidth: "var(--radix-select-trigger-width)",
            color: sketch.ink,
            ...style,
          }}
          {...rest}
        >
          <SketchBox
            roughness={sketch.roughness}
            seed={sketch.resolvedSeed}
            sketchColor={sketch.ink}
            bowing={sketch.bowing}
            fillStyle={sketch.fillStyle ?? "solid"}
            fill={fill ?? sketch.paper}
            strokeWidth={sketch.strokeWidth ?? 1.5}
            hachureGap={sketch.hachureGap}
            hachureAngle={sketch.hachureAngle}
            fillWeight={sketch.fillWeight}
            animate={sketch.animate}
            contentStyle={{ padding: "6px 4px", color: sketch.ink }}
          >
            <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
          </SketchBox>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  },
);

/**
 * Props for {@link SelectItem}.
 */
export interface SelectItemProps
  extends Omit<SelectPrimitive.SelectItemProps, "asChild"> {
  children?: ReactNode;
}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  function SelectItem({ className, style, children, value, ...rest }, ref) {
    const baseRoughness = useBaseRoughness();
    const sketch = useSelectSketch();
    const [highlighted, setHighlighted] = useState(false);
    const selected = sketch.selectedValue === value;
    const mark = highlighted || selected;

    return (
      <SelectPrimitive.Item
        ref={ref}
        value={value}
        className={cn(className)}
        onPointerMove={() => setHighlighted(true)}
        onPointerLeave={() => setHighlighted(false)}
        onFocus={() => setHighlighted(true)}
        onBlur={() => setHighlighted(false)}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: "7px 12px",
          fontFamily: doodleUiFontFamily,
          fontSize: 14,
          color: sketch.ink,
          outline: "none",
          cursor: "pointer",
          userSelect: "none",
          fontWeight: selected
            ? doodleUiFontWeight(650)
            : doodleUiFontWeight(400),
          ...style,
        }}
        {...rest}
      >
        {mark ? (
          <RoughSvg
            shape="line"
            roughness={(sketch.roughness ?? baseRoughness) + 0.4}
            seed={sketch.resolvedSeed}
            sketchColor={
              selected ? sketch.accent : sketch.ink
            }
            bowing={sketch.bowing ?? 1.6}
            strokeWidth={selected ? 1.8 : 1.3}
            inset={UNDERLINE_INSET}
            style={{ opacity: selected ? 0.9 : 0.45 }}
          />
        ) : null}
        <SelectPrimitive.ItemText
          style={{ position: "relative", zIndex: 1 }}
        >
          {children}
        </SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    );
  },
);

export const SelectRoot = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectGroup = SelectPrimitive.Group;
export const SelectLabel = SelectPrimitive.Label;
export const SelectSeparator = SelectPrimitive.Separator;
