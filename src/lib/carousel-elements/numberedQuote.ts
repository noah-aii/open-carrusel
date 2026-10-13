import { buildTokens, type CarouselElementTokens } from "./tokens";

export interface NumberedQuoteOptions {
  tokens?: CarouselElementTokens;
  width?: number;
  rotate?: number;
  fontSize?: number;
}

/**
 * Number badge overlapping a quote bubble — "01  'vou pensar e te falo'".
 * Reproduces the item-header pattern from the @clinicasdofuturo
 * "5 objeções" numbered slides (2, 3, 4...). One per slide, used as the
 * single attention anchor above the centered text block — never stack
 * several of these on one slide.
 */
export function numberedQuote(number: string, quote: string, opts: NumberedQuoteOptions = {}): string {
  const tokens = opts.tokens || buildTokens();
  const { width = 560, rotate = 0, fontSize = 34 } = opts;
  const badgeSize = 96;

  return `<div style="position: relative; display: inline-flex; align-items: center; width: ${width}px; transform: rotate(${rotate}deg);">
  <div style="position: relative; z-index: 2; flex-shrink: 0; width: ${badgeSize}px; height: ${badgeSize}px; border-radius: 999px; background: ${tokens.colors.surface}; box-shadow: ${tokens.shadow.soft}; display: flex; align-items: center; justify-content: center; font-family: '${tokens.fonts.body}', sans-serif; font-weight: 800; font-size: 40px; color: ${tokens.colors.text};">${number}</div>
  <div style="flex: 1; margin-left: -${badgeSize / 2}px; padding: 24px 36px 24px ${badgeSize / 2 + 20}px; border-radius: 999px; background: ${tokens.colors.highlightBg}; color: ${tokens.colors.text}; font-family: '${tokens.fonts.body}', sans-serif; font-weight: 600; font-size: ${fontSize}px; line-height: 1.25;">${quote}</div>
</div>`;
}
