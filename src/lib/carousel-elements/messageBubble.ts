import { buildTokens, type CarouselElementTokens } from "./tokens";

export type BubbleTail = "bottom-left" | "bottom-right" | "none";
export type BubbleVariant = "default" | "proof";

export interface MessageBubbleOptions {
  tokens?: CarouselElementTokens;
  /** "default" = white/off-white bubble. "proof" = the one message that already converted (soft green, per reference slide 4). */
  variant?: BubbleVariant;
  maxWidth?: number;
  tail?: BubbleTail;
  fontSize?: number;
  fontWeight?: number;
  /** Slight tilt, for the floating phone-mockup look — set 0 for a flat, standalone bubble. */
  rotate?: number;
  align?: "left" | "right";
}

/**
 * A single chat/message bubble: white/off-white, heavily rounded corners,
 * soft diffuse shadow, small tail nub, dark modern sans-serif text.
 *
 * Reproduces the objection bubbles from the @clinicasdofuturo reference
 * ("Vou pensar e te falo", etc.) and the WhatsApp-style proof pair from the
 * "Na prática" slide. Accepts any text — this is the reusable primitive
 * ObjectionList stacks to build the full list.
 */
export function messageBubble(text: string, opts: MessageBubbleOptions = {}): string {
  const tokens = opts.tokens || buildTokens();
  const {
    variant = "default",
    maxWidth = 620,
    tail = "bottom-left",
    fontSize = 34,
    fontWeight = 500,
    rotate = 0,
    align = "left",
  } = opts;

  const bg = variant === "proof" ? tokens.colors.proofBg : tokens.colors.surface;
  const color = variant === "proof" ? tokens.colors.proofText : tokens.colors.text;

  const tailStyle =
    tail === "none"
      ? ""
      : `<div style="position: absolute; bottom: -7px; ${tail === "bottom-left" ? "left: 30px;" : "right: 30px;"} width: 18px; height: 18px; background: ${bg}; border-radius: 4px; transform: rotate(45deg); z-index: -1;"></div>`;

  return `<div style="position: relative; display: inline-flex; max-width: ${maxWidth}px; align-self: ${align === "right" ? "flex-end" : "flex-start"}; transform: rotate(${rotate}deg);">
  <div style="position: relative; background: ${bg}; color: ${color}; border-radius: ${tokens.radius.bubble}px; padding: ${tokens.spacing.bubblePaddingY}px ${tokens.spacing.bubblePaddingX}px; box-shadow: ${tokens.shadow.soft}; font-family: '${tokens.fonts.body}', sans-serif; font-size: ${fontSize}px; font-weight: ${fontWeight}; line-height: 1.3; white-space: pre-wrap;">
    ${text}
    ${tailStyle}
  </div>
</div>`;
}
