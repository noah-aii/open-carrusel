export { buildTokens, type CarouselElementTokens } from "./tokens";
export { icon, ICON_PATHS, type IconName } from "./icons";
export { dottedBackgroundCss, slideCanvas } from "./background";
export {
  messageBubble,
  type MessageBubbleOptions,
  type BubbleTail,
  type BubbleVariant,
} from "./messageBubble";
export { iconPill, type IconPillOptions } from "./iconPill";
export { objectionList, type ObjectionListOptions } from "./objectionList";
export { photoCard, type PhotoCardOptions } from "./photoCard";
export { photoMosaic, multiPhotoMosaic, type PhotoMosaicOptions, type MultiPhotoMosaicItem } from "./photoMosaic";
export { tweetPhotoBlock, TWEET_PHOTO_BLOCK, type TweetPhoto, type TweetPhotoBlockOptions } from "./tweetPhotoBlock";
export { caseStudyCard, type CaseStudyCardOptions } from "./caseStudyCard";
export { frameworkList, type FrameworkItem, type FrameworkListOptions } from "./frameworkList";
export { numberedQuote, type NumberedQuoteOptions } from "./numberedQuote";
export { answerCard, type AnswerCardOptions } from "./answerCard";

import type { BrandConfig } from "@/types/brand";
import { buildTokens } from "./tokens";
import { slideCanvas } from "./background";
import { iconPill } from "./iconPill";
import { objectionList } from "./objectionList";
import { photoCard } from "./photoCard";

/**
 * One full example slide combining every component — used by the style
 * guide page and as the seed `exampleSlideHtml` for the "Clínicas do
 * Futuro — Objeções" style preset. Pass real brand config so colors/fonts
 * match whatever is configured in data/brand.json.
 */
export function exampleObjectionsSlide(brand?: BrandConfig | null): string {
  const tokens = buildTokens(brand);

  const content = `
  <div style="display: flex; flex-direction: column; height: 100%;">
    <div style="display: flex; justify-content: flex-end;">
      ${iconPill("barChart", "Mais pacientes", { tokens, rotate: -6 })}
    </div>

    <div style="margin-top: 64px; font-family: '${tokens.fonts.body}', sans-serif; font-weight: 800; font-size: 64px; line-height: 1.08; color: ${tokens.colors.text};">
      As 5 objeções que<br />mais fazem
    </div>
    <div style="font-family: '${tokens.fonts.heading}', serif; font-style: italic; font-weight: 600; font-size: 76px; line-height: 1.05; background: linear-gradient(135deg, ${tokens.colors.icon}, ${tokens.colors.accent}); -webkit-background-clip: text; background-clip: text; color: transparent; margin-top: 4px;">
      paciente sumir
    </div>
    <div style="font-family: '${tokens.fonts.body}', sans-serif; font-weight: 800; font-size: 64px; line-height: 1.08; color: ${tokens.colors.text}; margin-top: 4px;">
      depois da avaliação
    </div>

    <div style="flex: 1;"></div>

    <div style="align-self: flex-start; margin-bottom: 32px;">
      ${iconPill("paperPlane", "Conversas que não viram agendamento", {
        tokens,
        rotate: -4,
        fontSize: 28,
      })}
    </div>

    <div style="align-self: flex-end;">
      ${objectionList(
        [
          "Vou pensar e te falo",
          "Preciso falar com meu marido",
          "Vi mais barato em outra clínica.",
          "Tenho medo de ficar artificial.",
          "Depois eu vejo minha agenda.",
        ],
        { tokens, itemOptions: { fontSize: 30, rotate: -2, maxWidth: 520 } }
      )}
    </div>
  </div>`;

  return slideCanvas(content, { tokens, padding: 90 });
}

/**
 * Reproduces slide 1 of the OTHER reference ("Doutora, o perfil do
 * paciente...") — the floating ad-mockup card (photoCard) with two
 * iconPills pointing at it. Pass a real clinic photo path once you have
 * one; until then it renders the same gradient placeholder the AI used the
 * first time around.
 */
export function exampleAdMockupSlide(
  brand?: BrandConfig | null,
  clinicPhotoUrl: string | null = null
): string {
  const tokens = buildTokens(brand);

  const content = `
  <div style="display: flex; flex-direction: column; height: 100%;">
    <div style="display: flex; justify-content: flex-end; position: relative; height: 420px;">
      <div style="position: absolute; top: 0; right: 0;">
        ${photoCard(clinicPhotoUrl, {
          tokens,
          eyebrow: "Seu anúncio",
          caption: "Sua clínica, do jeito certo pra você.",
        })}
      </div>
      <div style="position: absolute; top: 40px; right: 340px;">
        ${iconPill("users", "Paciente certo", { tokens, fontSize: 26, iconSize: 32 })}
      </div>
      <div style="position: absolute; bottom: -10px; right: 20px;">
        ${iconPill("check", "Só curioso", { tokens, fontSize: 24, iconSize: 28, iconColor: tokens.colors.muted })}
      </div>
    </div>

    <div style="flex: 1;"></div>

    <div style="font-family: '${tokens.fonts.body}', sans-serif; font-weight: 800; font-size: 68px; line-height: 1.1; color: ${tokens.colors.text};">
      Doutora,
    </div>
    <div style="font-family: '${tokens.fonts.heading}', serif; font-style: italic; font-weight: 600; font-size: 58px; line-height: 1.15; background: linear-gradient(135deg, ${tokens.colors.icon}, ${tokens.colors.accent}); -webkit-background-clip: text; background-clip: text; color: transparent; margin-top: 8px;">
      quem chega no seu WhatsApp já foi filtrado antes de ver seu anúncio.
    </div>
    <div style="width: 80px; height: 4px; background: ${tokens.colors.text}; margin: 32px 0;"></div>
    <div style="font-family: '${tokens.fonts.body}', sans-serif; font-weight: 700; font-size: 32px; color: ${tokens.colors.text};">
      O criativo decide quem entra na conversa. Não a recepção.
    </div>
  </div>`;

  return slideCanvas(content, { tokens, padding: 90 });
}
