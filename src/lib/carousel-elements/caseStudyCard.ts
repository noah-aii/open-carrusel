import { buildTokens, type CarouselElementTokens } from "./tokens";
import { icon } from "./icons";

export interface CaseStudyCardOptions {
  tokens?: CarouselElementTokens;
  brandName?: string;
  /** Small mark/wordmark top-right — omit if you don't have a partner logo for that spot. */
  brandMark?: string | null;
  caseNumber?: string;
  /** First black sans-serif line, e.g. "Fechou uma venda de" */
  headlineLine1?: string;
  /** The highlighted line — own line, serif italic, in accentColor. E.g. "R$ 20 mil" */
  headlineHighlight?: string;
  /** Second black sans-serif line, e.g. "no primeiro mês" */
  headlineLine2?: string;
  avatarUrl?: string | null;
  clientName: string;
  clientHandle: string;
  followers?: string;
  /** Small caption label above the embedded screenshot, e.g. "O PRIMEIRO PACIENTE FECHADO". */
  screenshotLabel?: string;
  /** Pass null to reserve the proof-image area without inventing a screenshot — renders a flat placeholder box at the given aspect ratio instead. */
  screenshotUrl: string | null;
  /** Aspect ratio (height ÷ width, as a plain number) for the placeholder box when screenshotUrl is null. Defaults to 1.25 (a tall chat-screenshot proportion). */
  screenshotPlaceholderRatio?: number;
  bullets: string[];
  footerHandle?: string;

  // --- Style overrides — this template's identity can differ per case;
  // these let you reproduce a specific reference exactly instead of
  // forcing the active brand's tokens onto it. ---
  /** Serif font for the brand wordmark and the headline highlight (e.g. "PT Serif" — reads like Georgia/Times). Defaults to tokens.fonts.heading. */
  serifFont?: string;
  /** Heavy grotesque sans for the black headline lines (e.g. "Inter"). Defaults to tokens.fonts.body. */
  sansFont?: string;
  /** Single accent color used for CASE label, the highlight line, and checkmarks. Defaults to tokens.colors.icon. */
  accentColor?: string;
  /** Reference case studies usually have no shadow on the proof image — set false to match. Defaults to true. */
  imageShadow?: boolean;
  /** Flat neutral color for the avatar placeholder when no photo is available yet — avoids inventing a photo of a real person. Defaults to a brand gradient. */
  avatarPlaceholderColor?: string;
}

/**
 * "Case de resultado" card — reproduces the @clinicasdofuturo story format:
 * brand bar, CASE 0X eyebrow, headline with one highlighted line, mini
 * client profile (avatar + name + handle + followers), a real screenshot as
 * proof, a checkmark list, and a footer handle. Built for 9:16 (story) but
 * works at any slideCanvas size — this is a full inner-content block, wrap
 * it with slideCanvas() same as any other composition.
 *
 * The headline is 3 stacked lines by design (not one wrapped paragraph) so
 * the highlighted line always reads as its own visual beat, matching how
 * these case-study references actually set type.
 */
export function caseStudyCard(opts: CaseStudyCardOptions): string {
  const tokens = opts.tokens || buildTokens();
  const {
    brandName = "",
    brandMark = null,
    caseNumber = "01",
    headlineLine1 = "",
    headlineHighlight = "",
    headlineLine2 = "",
    avatarUrl = null,
    clientName,
    clientHandle,
    followers,
    screenshotLabel,
    screenshotUrl,
    screenshotPlaceholderRatio = 1.25,
    bullets,
    footerHandle,
    serifFont = tokens.fonts.heading,
    sansFont = tokens.fonts.body,
    accentColor = tokens.colors.icon,
    imageShadow = true,
    avatarPlaceholderColor,
  } = opts;

  const avatar = avatarUrl
    ? `<img src="${avatarUrl}" alt="" style="width: 64px; height: 64px; border-radius: 999px; object-fit: cover; flex-shrink: 0;" />`
    : `<div style="width: 64px; height: 64px; border-radius: 999px; background: ${avatarPlaceholderColor || `linear-gradient(135deg, ${tokens.colors.icon}, ${tokens.colors.accent})`}; flex-shrink: 0;"></div>`;

  const bulletsHtml = bullets
    .map(
      (b) => `<div style="display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px;">
      <span style="flex-shrink: 0; margin-top: 4px;">${icon("check", { size: 26, color: accentColor })}</span>
      <span style="font-family: '${sansFont}', sans-serif; font-weight: 500; font-size: 28px; color: ${tokens.colors.text}; line-height: 1.3;">${b}</span>
    </div>`
    )
    .join("");

  const imageWrapStyle = imageShadow
    ? `border-radius: 24px; overflow: hidden; box-shadow: ${tokens.shadow.lifted}; margin-bottom: 44px;`
    : `border-radius: 16px; overflow: hidden; margin-bottom: 44px;`;

  return `<div style="display: flex; flex-direction: column; height: 100%;">
  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 56px;">
    <div style="font-family: '${serifFont}', serif; font-weight: 700; font-size: 36px; color: ${tokens.colors.text};">${brandName}<span style="font-size: 0.55em; vertical-align: super;">™</span></div>
    ${brandMark ? `<div style="font-family: '${sansFont}', sans-serif; font-weight: 600; font-size: 22px; color: #374151;">${brandMark}</div>` : ""}
  </div>

  <div style="font-family: '${sansFont}', sans-serif; font-weight: 700; font-size: 24px; letter-spacing: 0.12em; color: ${accentColor}; margin-bottom: 20px;">CASE ${caseNumber}</div>

  <div style="margin-bottom: 44px;">
    <div style="font-family: '${sansFont}', sans-serif; font-weight: 900; font-size: 56px; line-height: 1.04; color: ${tokens.colors.text};">${headlineLine1}</div>
    <div style="font-family: '${serifFont}', serif; font-style: italic; font-weight: 600; font-size: 64px; line-height: 1.1; color: ${accentColor};">${headlineHighlight}</div>
    <div style="font-family: '${sansFont}', sans-serif; font-weight: 900; font-size: 56px; line-height: 1.04; color: ${tokens.colors.text};">${headlineLine2}</div>
  </div>

  <div style="display: flex; align-items: center; gap: 18px; margin-bottom: 40px;">
    ${avatar}
    <div>
      <div style="font-family: '${sansFont}', sans-serif; font-weight: 700; font-size: 30px; color: ${tokens.colors.text};">${clientName}</div>
      <div style="font-family: '${sansFont}', sans-serif; font-weight: 500; font-size: 24px; color: ${tokens.colors.muted};">${clientHandle}${followers ? ` · ${followers} seguidores` : ""}</div>
    </div>
  </div>

  ${screenshotLabel ? `<div style="text-align: center; font-family: '${sansFont}', sans-serif; font-weight: 700; font-size: 22px; letter-spacing: 0.1em; color: ${tokens.colors.muted}; text-transform: uppercase; margin-bottom: 24px;">${screenshotLabel}</div>` : ""}

  <div style="${imageWrapStyle}">
    ${
      screenshotUrl
        ? `<img src="${screenshotUrl}" alt="" style="width: 100%; display: block;" />`
        : `<div style="width: 100%; padding-top: ${screenshotPlaceholderRatio * 100}%; background: #F3F4F6; position: relative;">
      <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: '${sansFont}', sans-serif; font-weight: 600; font-size: 22px; color: #9CA3AF;">Imagem a inserir</div>
    </div>`
    }
  </div>

  ${bulletsHtml}

  <div style="flex: 1;"></div>

  <div style="border-top: 1px solid rgba(0,0,0,0.1); margin-top: 12px; padding-top: 28px; text-align: center;">
    <div style="font-family: '${sansFont}', sans-serif; font-weight: 500; font-size: 24px; color: ${tokens.colors.muted};">${footerHandle || clientHandle}</div>
  </div>
</div>`;
}
