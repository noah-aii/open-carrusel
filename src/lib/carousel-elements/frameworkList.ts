import { buildTokens, type CarouselElementTokens } from "./tokens";
import { icon, type IconName } from "./icons";

export interface FrameworkItem {
  /** Pick the icon that literally matches the word — "Imagem" gets the image icon, "Oferta" gets the handshake, etc. Never decorative-only. */
  icon: IconName;
  title: string;
  description: string;
}

export interface FrameworkListOptions {
  tokens?: CarouselElementTokens;
  gap?: number;
  iconSize?: number;
  fontSize?: number;
}

/**
 * A framework/step list where each item carries its OWN icon tied to its
 * meaning (not a generic bullet) — use this instead of a plain text list
 * whenever the copy names distinct concepts (three filters, three steps,
 * before/after, etc.). Replaces the flat text cards used in the first pass
 * of "O Funil Blindado" slide.
 */
export function frameworkList(items: FrameworkItem[], opts: FrameworkListOptions = {}): string {
  const tokens = opts.tokens || buildTokens();
  const { gap = tokens.spacing.listGap, iconSize = 36, fontSize = 30 } = opts;

  const rows = items
    .map(
      (item) => `<div style="display: flex; align-items: flex-start; gap: 22px; background: ${tokens.colors.surface}; border-radius: 24px; padding: 24px 28px; box-shadow: ${tokens.shadow.soft};">
  <span style="display: inline-flex; flex-shrink: 0; width: ${iconSize + 20}px; height: ${iconSize + 20}px; align-items: center; justify-content: center; border-radius: 999px; background: ${tokens.colors.background};">
    ${icon(item.icon, { size: iconSize, color: tokens.colors.icon })}
  </span>
  <div style="font-family: '${tokens.fonts.body}', sans-serif; color: ${tokens.colors.text};">
    <div style="font-weight: 700; font-size: ${fontSize}px; margin-bottom: 4px;">${item.title}</div>
    <div style="font-weight: 400; font-size: ${fontSize - 6}px; line-height: 1.3; opacity: 0.85;">${item.description}</div>
  </div>
</div>`
    )
    .join(`\n<div style="height: ${gap}px;"></div>\n`);

  return `<div style="display: flex; flex-direction: column;">${rows}</div>`;
}
