"use client";

import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAnimate } from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { useSketchTheme } from "../hooks/useSketchTheme";
import { DoodleIcon } from "../primitives/icon";
import { resolveInteractiveState } from "../primitives/interactive";
import { RoughSvg } from "../primitives/RoughSvg";
import { resolveSize, type DoodleSize } from "../primitives/size";
import type { SketchProps } from "../types";
import { assignRef, cn, deriveSeed, doodleUiFontFamily } from "../utils";
import { Spinner } from "./Spinner";

export type PromptInputSize = DoodleSize;
export type PromptInputVariant = "sketch";

/**
 * Props for {@link PromptInput}.
 */
export interface PromptInputProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "size" | "color" | "onSubmit"
    >,
    SketchProps {
  /**
   * Component visual variant.
   * - `"solid"`: Sleek dark/light capsule pill and circular send button.
   * - `"sketch"`: Hand-drawn rough.js sketch borders.
   * @default "solid"
   * @default "sketch"
   */
  variant?: PromptInputVariant;
  /**
   * Control size preset.
   * @default "md"
   */
  size?: PromptInputSize;
  /**
   * Callback fired when the user submits (by pressing Enter or clicking Send).
   */
  onSubmit?: (value: string) => void;
  /**
   * Callback fired when the voice/waveform icon button is clicked.
   */
  onVoiceClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Custom voice waveform icon component.
   */
  voiceIcon?: ReactNode;
  /**
   * Custom send button icon component.
   */
  sendIcon?: ReactNode;
  /**
   * Show a loading spinner inside the send button.
   * @default false
   */
  loading?: boolean;
  /**
   * Keep the send button visible even after the input loses focus.
   * @default false
   */
  keepOpenOnBlur?: boolean;
  /**
   * Manually control send button visibility.
   */
  showSendButton?: boolean;
  /**
   * Additional class name on the root container.
   */
  containerClassName?: string;
  /**
   * Additional inline styles on the root container.
   */
  containerStyle?: CSSProperties;
  /**
   * Play sketch draw-in animations. Defaults to {@link DoodleUIProvider} `animate` (true).
   * @default undefined (follow provider)
   */
  animate?: boolean;
}

const SIZE_CONFIG: Record<
  PromptInputSize,
  {
    height: number;
    fontSize: number;
    paddingX: number;
    iconSize: number;
    buttonSize: number;
  }
> = {
  sm: {
    height: 36,
    fontSize: 13,
    paddingX: 14,
    iconSize: 16,
    buttonSize: 36,
  },
  md: {
    height: 44,
    fontSize: 15,
    paddingX: 18,
    iconSize: 20,
    buttonSize: 44,
  },
  lg: {
    height: 52,
    fontSize: 16,
    paddingX: 22,
    iconSize: 24,
    buttonSize: 52,
  },
};

/**
 * Built-in audio waveform icon matching the prompt bar design.
 */
function InternalWaveformIcon({
  size = 20,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      className={className}
      style={{ display: "block", ...style }}
      aria-hidden="true"
    >
      <line x1="4" y1="10" x2="4" y2="14" />
      <line x1="8" y1="6" x2="8" y2="18" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="16" y1="7" x2="16" y2="17" />
      <line x1="20" y1="10" x2="20" y2="14" />
    </svg>
  );
}

/**
 * Built-in upward arrow icon for the circular send button.
 */
function InternalArrowUpIcon({
  size = 20,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "block", ...style }}
      aria-hidden="true"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

/**
 * Modern AI prompt bar with voice waveform mode that animates into a circular send button when focused or typed into.
 *
 * @example
 * <PromptInput
 *   placeholder="Ask anything..."
 *   onSubmit={(text) => handleSend(text)}
 *   onVoiceClick={() => startVoiceMode()}
 * />
 */
export const PromptInput = forwardRef<HTMLInputElement, PromptInputProps>(
  function PromptInput(
    {
      className,
      style,
      containerClassName,
      containerStyle,
      variant = "solid",
      variant: _variant = "sketch",
      size: sizeProp = "md",
      placeholder = "Ask anything...",
      value,
      defaultValue,
      onChange,
      onSubmit,
      onVoiceClick,
      voiceIcon,
      sendIcon,
      loading = false,
      disabled = false,
      keepOpenOnBlur = false,
      showSendButton: showSendButtonProp,
      onFocus,
      onBlur,
      onKeyDown,
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
      id,
      ...rest
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const size = resolveSize(sizeProp);
    const sizeConf = SIZE_CONFIG[size];

    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState<string>(
      () => (defaultValue as string) ?? "",
    );

    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value) : internalValue;
    const hasText = currentValue.trim().length > 0;

    const theme = useSketchTheme(sketchColor);
    const ink = sketchColor ?? theme.ink;
    const shouldAnimate = useAnimate(animate);
    const resolvedSeed = useResolvedSeed(seed);
    const focusSeed = deriveSeed(resolvedSeed, "focus");
    const sketchSeed = shouldAnimate && focused ? focusSeed : resolvedSeed;
    const interactive = resolveInteractiveState({ disabled, loading });

    const showSend =
      showSendButtonProp ??
      (focused || hasText || (keepOpenOnBlur && focused));

    const handleFocus = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        setFocused(true);
        onFocus?.(e);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        onBlur?.(e);
      },
      [onBlur],
    );

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setInternalValue(e.target.value);
        }
        onChange?.(e);
      },
      [isControlled, onChange],
    );

    const handleSend = useCallback(() => {
      if (interactive.isDisabled) return;
      onSubmit?.(currentValue);
    }, [currentValue, interactive.isDisabled, onSubmit]);

    const handleFormSubmit = useCallback(
      (e: FormEvent) => {
        e.preventDefault();
        handleSend();
      },
      [handleSend],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
        onKeyDown?.(e);
      },
      [handleSend, onKeyDown],
    );

    // Color definitions
    const isDark = theme.isDark;
    const textColor = ink;
    const iconColor = isDark ? "rgba(243, 244, 246, 0.65)" : "rgba(31, 29, 26, 0.65)";
    const sendButtonTextColor = hasText
      ? (sketchColor ?? theme.accent)
      : iconColor;

    return (
      <form
        onSubmit={handleFormSubmit}
        className={cn(containerClassName)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          position: "relative",
          boxSizing: "border-box",
          fontFamily: doodleUiFontFamily,
          ...interactive.style,
          ...containerStyle,
        }}
      >
        {/* Main Sketch Input Box */}
        <motion.div
          layout={shouldAnimate}
          transition={{ type: "spring", stiffness: 450, damping: 35 }}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            flex: 1,
            minWidth: 0,
            height: sizeConf.height,
            background: "transparent",
            boxSizing: "border-box",
          }}
        >
          <RoughSvg
            shape="rectangle"
            roughness={roughness}
            seed={sketchSeed}
            sketchColor={focused ? (sketchColor ?? theme.accent) : ink}
            bowing={bowing}
            fillStyle={fillStyle}
            strokeWidth={
              focused && !shouldAnimate
                ? (strokeWidth ?? 1.75) + 0.35
                : strokeWidth
            }
            hachureGap={hachureGap}
            hachureAngle={hachureAngle}
            fillWeight={fillWeight}
          />

          <input
            ref={(node) => {
              inputRef.current = node;
              assignRef(ref, node);
            }}
            id={inputId}
            value={currentValue}
            placeholder={placeholder}
            disabled={interactive.isDisabled}
            aria-disabled={interactive.aria["aria-disabled"]}
            aria-label={placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={cn(className)}
            style={{
              flex: 1,
              minWidth: 0,
              height: "100%",
              paddingLeft: sizeConf.paddingX,
              paddingRight: showSend ? sizeConf.paddingX : sizeConf.iconSize + 20,
              border: "none",
              outline: "none",
              background: "transparent",
              color: textColor,
              fontSize: sizeConf.fontSize,
              fontFamily: doodleUiFontFamily,
              zIndex: 2,
              boxSizing: "border-box",
              ...style,
            }}
            {...rest}
          />

          {/* Waveform Action inside the input (shown when NOT showing send button) */}
          <AnimatePresence>
            {!showSend && (
              <motion.button
                key="waveform-action"
                type="button"
                onClick={onVoiceClick}
                disabled={interactive.isDisabled}
                aria-label="Voice input"
                initial={
                  shouldAnimate
                    ? { opacity: 0, scale: 0.6 }
                    : false
                }
                animate={
                  shouldAnimate
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 1, scale: 1 }
                }
                exit={
                  shouldAnimate
                    ? { opacity: 0, scale: 0.6 }
                    : undefined
                }
                transition={
                  shouldAnimate
                    ? { duration: 0.2, ease: "easeOut" }
                    : { duration: 0 }
                }
                style={{
                  position: "absolute",
                  right: sizeConf.paddingX - 4,
                  top: 0,
                  bottom: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  width: sizeConf.iconSize + 8,
                  cursor: interactive.isDisabled ? "not-allowed" : "pointer",
                  color: iconColor,
                  zIndex: 3,
                  transformOrigin: "center center",
                }}
              >
                {voiceIcon ?? <InternalWaveformIcon size={sizeConf.iconSize} />}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Circular Sketch Send Button (animates in beside the input on focus/typing) */}
        <AnimatePresence>
          {showSend && (
            <motion.button
              key="send-action"
              type="submit"
              disabled={interactive.isDisabled}
              aria-label="Send message"
              initial={
                shouldAnimate
                  ? { opacity: 0, scale: 0.4 }
                  : false
              }
              animate={
                shouldAnimate
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 1, scale: 1 }
              }
              exit={
                shouldAnimate
                  ? { opacity: 0, scale: 0.4 }
                  : undefined
              }
              transition={
                shouldAnimate
                  ? {
                      type: "spring",
                      stiffness: 480,
                      damping: 28,
                    }
                  : { duration: 0 }
              }
              whileTap={
                !interactive.isDisabled && shouldAnimate
                  ? { scale: 0.92 }
                  : undefined
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: sizeConf.buttonSize,
                height: sizeConf.buttonSize,
                borderRadius: "50%",
                background: "transparent",
                border: "none",
                color: sendButtonTextColor,
                cursor: interactive.isDisabled ? "not-allowed" : "pointer",
                flexShrink: 0,
                position: "relative",
                outline: "none",
                padding: 0,
              }}
            >
              <RoughSvg
                shape="ellipse"
                roughness={roughness}
                seed={sketchSeed}
                sketchColor={hasText ? (sketchColor ?? theme.accent) : ink}
                bowing={bowing}
                fillStyle={fillStyle}
                strokeWidth={
                  hasText
                    ? (strokeWidth ?? 1.75) + 0.3
                    : (strokeWidth ?? 1.75)
                }
              />
              {loading ? (
                <Spinner size={size} sketchColor={sendButtonTextColor} aria-hidden />
              ) : sendIcon ? (
                <DoodleIcon size={size}>{sendIcon}</DoodleIcon>
              ) : (
                <InternalArrowUpIcon size={sizeConf.iconSize} />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </form>
    );
  },
);

PromptInput.displayName = "PromptInput";

/**
 * Alias for {@link PromptInput}.
 */
export const ChatInput = PromptInput;

export const WaveformIcon = InternalWaveformIcon;
export const ArrowUpIcon = InternalArrowUpIcon;

