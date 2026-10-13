import { buildTokens, type CarouselElementTokens } from "./tokens";
import { messageBubble, type MessageBubbleOptions } from "./messageBubble";

export interface ObjectionListOptions {
  tokens?: CarouselElementTokens;
  gap?: number;
  align?: "left" | "right";
  /** Options passed through to every bubble (fontSize, tail, maxWidth, rotate...) */
  itemOptions?: Partial<MessageBubbleOptions>;
  /**
   * Zero-based index of the one item that should render as the "proof"
   * variant (soft green) — use this for the objection that already got
   * answered/converted, same idea as the green reply bubble in the
   * reference's "Na prática" slide.
   */
  proofIndex?: number;
}

/**
 * Stacks several MessageBubble items with consistent spacing, reproducing
 * the "5 objeções" reference slide (each objection as its own floating
 * bubble, right-aligned, evenly spaced).
 */
export function objectionList(items: string[], opts: ObjectionListOptions = {}): string {
  const tokens = opts.tokens || buildTokens();
  const { gap = tokens.spacing.listGap, align = "right", itemOptions = {}, proofIndex } = opts;

  const bubbles = items
    .map((text, i) =>
      messageBubble(text, {
        tokens,
        align,
        tail: align === "right" ? "bottom-right" : "bottom-left",
        variant: i === proofIndex ? "proof" : "default",
        ...itemOptions,
      })
    )
    .join(`\n  <div style="height: ${gap}px;"></div>\n  `);

  return `<div style="display: flex; flex-direction: column; align-items: ${align === "right" ? "flex-end" : "flex-start"};">
  ${bubbles}
</div>`;
}
