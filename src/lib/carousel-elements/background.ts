import { buildTokens, type CarouselElementTokens } from "./tokens";

interface DottedBackgroundOptions {
  tokens?: CarouselElementTokens;
  gap?: number;
  size?: number;
  color?: string;
  backgroundColor?: string;
  /** Optional radial glow layered behind the dots — for dark palettes with a light-source accent (e.g. the navy/lime/lavender reference). Pass a CSS color; omit for a flat background. */
  glowColor?: string;
}

/**
 * CSS declarations (no wrapping braces) for the dotted-grid background used
 * across every slide. Spread this into any element's style attribute.
 */
export function dottedBackgroundCss(opts: DottedBackgroundOptions = {}): string {
  const tokens = opts.tokens || buildTokens();
  const gap = opts.gap ?? tokens.dots.gap;
  const size = opts.size ?? tokens.dots.size;
  const color = opts.color ?? tokens.dots.color;
  const backgroundColor = opts.backgroundColor ?? tokens.colors.background;
  const dotLayer = `radial-gradient(circle, ${color} ${size}px, transparent ${size}px)`;
  const glowLayer = opts.glowColor
    ? `radial-gradient(ellipse 900px 700px at 82% 8%, ${opts.glowColor}, transparent 60%), `
    : "";

  return [
    `background-color: ${backgroundColor}`,
    `background-image: ${glowLayer}${dotLayer}`,
    `background-size: ${opts.glowColor ? "100% 100%, " : ""}${gap}px ${gap}px`,
  ].join("; ");
}

interface SlideCanvasOptions extends DottedBackgroundOptions {
  width?: number;
  height?: number;
  padding?: number;
}

/**
 * Wraps arbitrary inner HTML into a full slide-sized canvas (defaults to the
 * 4:5 Instagram dimensions) with the dotted background and consistent
 * padding — the same "lots of negative space" layout as the reference.
 */
export function slideCanvas(innerHtml: string, opts: SlideCanvasOptions = {}): string {
  const { width = 1080, height = 1350, padding = 80 } = opts;
  const bg = dottedBackgroundCss(opts);

  return `<div style="position: relative; width: ${width}px; height: ${height}px; box-sizing: border-box; padding: ${padding}px; ${bg};">
  ${innerHtml}
</div>`;
}
