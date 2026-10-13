import { buildTokens, type CarouselElementTokens } from "./tokens";
import { icon, type IconName } from "./icons";

export interface IconPillOptions {
  tokens?: CarouselElementTokens;
  /** Icon size in px */
  iconSize?: number;
  fontSize?: number;
  fontWeight?: number;
  rotate?: number;
  /** Override the icon color (defaults to tokens.colors.icon — the brand pink) */
  iconColor?: string;
  /** Lets long labels wrap onto a second line instead of overflowing; short labels stay single-line. */
  maxWidth?: number;
}

/**
 * White/off-white pill badge with a linear icon + bold text, fully rounded,
 * soft shadow. Reproduces "📊 Mais pacientes" / "✈ Conversas que não viram
 * agendamento" from the reference.
 *
 * `iconOrSvg` accepts either a name from the bundled icon set, or a raw
 * inline `<svg>...</svg>` string if you want to drop in a custom icon —
 * the component only cares that it receives markup to place on the left.
 */
export function iconPill(
  iconOrSvg: IconName | string,
  text: string,
  opts: IconPillOptions = {}
): string {
  const tokens = opts.tokens || buildTokens();
  const {
    iconSize = 40,
    fontSize = 32,
    fontWeight = 700,
    rotate = 0,
    iconColor = tokens.colors.icon,
    maxWidth = 640,
  } = opts;

  const isKnownIcon = /^[a-zA-Z][a-zA-Z0-9]*$/.test(iconOrSvg) && !iconOrSvg.includes("<");
  const iconSvg = isKnownIcon
    ? icon(iconOrSvg as IconName, { size: iconSize, color: iconColor })
    : iconOrSvg;

  return `<div style="display: inline-flex; align-items: center; gap: ${tokens.spacing.pillIconGap}px; max-width: ${maxWidth}px; background: ${tokens.colors.surface}; color: ${tokens.colors.text}; border-radius: ${tokens.radius.pill}px; padding: ${tokens.spacing.pillPaddingY}px ${tokens.spacing.pillPaddingX}px; box-shadow: ${tokens.shadow.soft}; font-family: '${tokens.fonts.body}', sans-serif; font-size: ${fontSize}px; font-weight: ${fontWeight}; line-height: 1.25; transform: rotate(${rotate}deg);">
  <span style="display: inline-flex; flex-shrink: 0; width: ${iconSize}px; height: ${iconSize}px;">${iconSvg}</span>
  <span>${text}</span>
</div>`;
}
