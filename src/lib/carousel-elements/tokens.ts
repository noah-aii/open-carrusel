import type { BrandConfig } from "@/types/brand";

/**
 * Design tokens for the reusable carousel element library (message bubbles,
 * icon pills, objection lists, dotted background).
 *
 * Extracted by reverse-engineering @clinicasdofuturo reference carousels:
 * - "Doutora, o perfil do paciente..." (6 slides, floating ad mockup + chat pair)
 * - "As 5 objeções que mais fazem paciente sumir" (stacked objection bubbles + pills)
 *
 * Values fall back to sensible defaults when the brand isn't configured yet,
 * but colors/fonts are always sourced from data/brand.json so the library
 * stays in sync with whatever brand is active.
 */
export interface CarouselElementTokens {
  colors: {
    background: string;
    surface: string;
    text: string;
    /** Accent used for linear icons and small highlights */
    icon: string;
    /** Second gradient stop for headline/CTA gradients — was hardcoded #7C5CFC, now a real token */
    accent: string;
    /** Muted secondary text (labels, captions under bubbles) */
    muted: string;
    /** Background for "proof" bubbles — the one message that already converted */
    proofBg: string;
    proofText: string;
    /** Tinted block used for numbered-quote headers and "answer" highlight cards */
    highlightBg: string;
    highlightText: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  radius: {
    /** Message bubble corner radius */
    bubble: number;
    /** Fully-rounded pill radius */
    pill: number;
  };
  shadow: {
    /** Soft, large, low-opacity — the "floating" shadow used on every element */
    soft: string;
    /** Slightly stronger, for elements meant to pop forward (e.g. featured bubble) */
    lifted: string;
  };
  spacing: {
    bubblePaddingY: number;
    bubblePaddingX: number;
    pillPaddingY: number;
    pillPaddingX: number;
    pillIconGap: number;
    listGap: number;
  };
  dots: {
    /** Gap between dots in the background grid, in px */
    gap: number;
    /** Dot radius in px */
    size: number;
    /** Dot color (low-opacity dark on the off-white background) */
    color: string;
  };
}

export function buildTokens(brand?: Partial<BrandConfig> | null): CarouselElementTokens {
  const colors = brand?.colors;
  const fonts = brand?.fonts;

  return {
    colors: {
      background: colors?.background || "#FFFFFF",
      surface: colors?.surface || "#FFFFFF",
      text: colors?.primary || "#111111",
      // Deepened from the reference's neon lime (#D9FF4A) so it stays legible as text/icon color on white — the flat neon reads washed-out outside a dark background.
      icon: colors?.secondary || "#8FBC00",
      // Deepened from the reference's pastel lavender (#B3AEF0) for the same reason.
      accent: colors?.accent || "#7B6FF0",
      muted: "#6B6B6B",
      proofBg: "#DCF8E7",
      proofText: "#15803D",
      highlightBg: "#EFEDFC",
      highlightText: colors?.primary || "#111111",
    },
    fonts: {
      // Script fonts (Parisienne) reserve huge invisible vertical metrics for their
      // loops/flourishes — that's the "empty white space" Pedro flagged. This new
      // reference (dark landing page) doesn't use script anywhere either: it's one
      // bold sans family throughout, italicized for the accent line. Match that.
      heading: fonts?.heading || "Big Shoulders Text",
      body: fonts?.body || "Big Shoulders Text",
    },
    radius: {
      bubble: 32,
      pill: 999,
    },
    shadow: {
      soft: "0 20px 40px -8px rgba(17,17,17,0.12), 0 8px 16px -6px rgba(17,17,17,0.06)",
      lifted: "0 28px 56px -10px rgba(17,17,17,0.18), 0 10px 20px -6px rgba(17,17,17,0.08)",
    },
    spacing: {
      bubblePaddingY: 26,
      bubblePaddingX: 34,
      pillPaddingY: 20,
      pillPaddingX: 32,
      pillIconGap: 16,
      listGap: 22,
    },
    dots: {
      gap: 26,
      size: 1.6,
      color: "rgba(17,17,17,0.14)",
    },
  };
}
