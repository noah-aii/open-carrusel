import { buildTokens, type CarouselElementTokens } from "./tokens";
import { icon } from "./icons";

export interface PhotoCardOptions {
  tokens?: CarouselElementTokens;
  /** Small label above the photo, e.g. "Seu anúncio" — renders in the heading font, non-italic. */
  eyebrow?: string;
  /** Bold line under the photo, e.g. "Sua clínica, do jeito certo pra você." */
  caption?: string;
  /** Bottom-row link text, e.g. "Saiba mais". Pass null to omit the row entirely. */
  linkLabel?: string | null;
  width?: number;
  imageHeight?: number;
  rotate?: number;
  /** Purely decorative gradient overlay shown ONLY when imageUrl is null — never pass a stock photo here as a stand-in for a real clinic. */
  placeholderGradient?: [string, string];
}

/**
 * Floating "ad mockup" card — the white card with a photo, eyebrow label,
 * caption and "Saiba mais →" row from the reference's slide 1.
 *
 * `imageUrl` should be a real photo path (e.g. "/uploads/clinica-kelly.jpg")
 * once you have one to use. Until then, pass `null` and it falls back to a
 * brand-colored gradient block in the same spot — same behavior the AI used
 * when it generated the Funil Blindado carousel without a real photo on hand.
 */
export function photoCard(imageUrl: string | null, opts: PhotoCardOptions = {}): string {
  const tokens = opts.tokens || buildTokens();
  const {
    eyebrow = "Seu anúncio",
    caption,
    linkLabel = "Saiba mais",
    width = 480,
    imageHeight = 300,
    rotate = 6,
    placeholderGradient = [tokens.colors.icon, tokens.colors.accent],
  } = opts;

  const media = imageUrl
    ? `<img src="${imageUrl}" alt="" style="width: 100%; height: ${imageHeight}px; object-fit: cover; border-radius: 18px; display: block;" />`
    : `<div style="width: 100%; height: ${imageHeight}px; border-radius: 18px; background: linear-gradient(135deg, ${placeholderGradient[0]}, ${placeholderGradient[1]});"></div>`;

  const linkRow =
    linkLabel === null
      ? ""
      : `<div style="display: flex; align-items: center; justify-content: space-between; margin-top: 20px; padding-top: 18px; border-top: 1px solid rgba(128,128,128,0.25); font-family: '${tokens.fonts.body}', sans-serif; font-size: 22px; color: ${tokens.colors.muted};">
      <span>${linkLabel}</span>
      <span style="display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; border-radius: 999px; background: ${tokens.colors.background};">${icon(
        "arrowRight",
        { size: 16, color: tokens.colors.text }
      )}</span>
    </div>`;

  return `<div style="display: inline-block; width: ${width}px; background: ${tokens.colors.surface}; border-radius: 28px; padding: 24px; box-shadow: ${tokens.shadow.lifted}; transform: rotate(${rotate}deg); font-family: '${tokens.fonts.body}', sans-serif;">
  ${eyebrow ? `<div style="font-family: '${tokens.fonts.heading}', sans-serif; font-style: italic; font-weight: 800; font-size: 28px; color: ${tokens.colors.text}; margin-bottom: 14px;">${eyebrow}</div>` : ""}
  ${media}
  ${caption ? `<div style="font-weight: 700; font-size: 24px; color: ${tokens.colors.text}; margin-top: 18px; line-height: 1.3;">${caption}</div>` : ""}
  ${linkRow}
</div>`;
}
