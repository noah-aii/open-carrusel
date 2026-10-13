import { buildTokens, type CarouselElementTokens } from "./tokens";

export interface AnswerCardOptions {
  tokens?: CarouselElementTokens;
  maxWidth?: number;
  align?: "left" | "center";
  titleSize?: number;
  bodySize?: number;
}

/**
 * Tinted rounded rectangle that highlights the single most important block
 * of text on the slide — reproduces the "O que responder:" card from the
 * @clinicasdofuturo numbered-objection slides. Use for the payoff/answer,
 * never for filler text — it only works because it's the ONE highlighted
 * block per slide.
 */
export function answerCard(title: string, body: string, opts: AnswerCardOptions = {}): string {
  const tokens = opts.tokens || buildTokens();
  const { maxWidth = 780, align = "center", titleSize = 30, bodySize = 30 } = opts;
  const textAlign = align === "center" ? "center" : "left";

  return `<div style="max-width: ${maxWidth}px; background: ${tokens.colors.highlightBg}; color: ${tokens.colors.highlightText}; border-radius: 32px; padding: 40px 44px; text-align: ${textAlign}; font-family: '${tokens.fonts.body}', sans-serif;">
  ${title ? `<div style="font-weight: 800; font-size: ${titleSize}px; margin-bottom: 12px;">${title}</div>` : ""}
  <div style="font-weight: 500; font-size: ${bodySize}px; line-height: 1.4;">${body}</div>
</div>`;
}
