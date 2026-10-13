import { buildTokens, type CarouselElementTokens } from "./tokens";

export interface PhotoMosaicTileOptions {
  /** "left"/"right" crop that half of the source image (splits ONE before/after photo into two chips). "top" biases a full-image crop upward — use it for screenshots with UI chrome (app bars, link-preview footers) at the bottom you want cropped out. "full" centers normally. */
  crop?: "left" | "right" | "top" | "full";
  size?: number;
  rotate?: number;
  label?: string;
}

export interface PhotoMosaicOptions {
  tokens?: CarouselElementTokens;
  tileSize?: number;
  gap?: number;
}

function polaroidTile(imageUrl: string, tokens: CarouselElementTokens, opts: PhotoMosaicTileOptions = {}): string {
  const { crop = "full", size = 160, rotate = 0, label } = opts;

  let imgStyle: string;
  if (crop === "top") {
    imgStyle = `width: 100%; height: 100%; object-fit: cover; object-position: center 15%;`;
  } else if (crop === "full") {
    imgStyle = `width: 100%; height: 100%; object-fit: cover;`;
  } else {
    // 200% width + object-position trick shows only one half of the source image, cropped, no external image processing needed.
    const objectPosition = crop === "left" ? "0% center" : "100% center";
    imgStyle = `width: 200%; height: 100%; object-fit: cover; object-position: ${objectPosition}; margin-left: ${crop === "right" ? "-100%" : "0"};`;
  }

  return `<div style="display: inline-block; background: ${tokens.colors.surface}; padding: 10px 10px 32px; border-radius: 14px; box-shadow: ${tokens.shadow.lifted}; transform: rotate(${rotate}deg);">
  <div style="width: ${size}px; height: ${size}px; overflow: hidden; border-radius: 6px;">
    <img src="${imageUrl}" alt="" style="${imgStyle} display: block;" />
  </div>
  ${label ? `<div style="text-align: center; margin-top: 8px; font-family: '${tokens.fonts.body}', sans-serif; font-weight: 700; font-size: 16px; color: ${tokens.colors.muted};">${label}</div>` : ""}
</div>`;
}

/**
 * Splits ONE before/after photo into a small scattered "Polaroid" mosaic —
 * one tile cropped to the left half, one to the right — instead of dropping
 * in a single large image. Reproduces the "resultado real" collage feel
 * without needing separate before/after source files.
 */
export function photoMosaic(imageUrl: string, opts: PhotoMosaicOptions = {}): string {
  const tokens = opts.tokens || buildTokens();
  const { tileSize = 220 } = opts;

  return `<div style="display: inline-flex; align-items: flex-end; gap: 4px;">
  ${polaroidTile(imageUrl, tokens, { crop: "left", size: tileSize, rotate: -6, label: "Antes" })}
  <div style="margin-bottom: 40px;">${polaroidTile(imageUrl, tokens, { crop: "right", size: tileSize * 0.85, rotate: 5, label: "Depois" })}</div>
</div>`;
}

export interface MultiPhotoMosaicItem {
  imageUrl: string;
  label?: string;
  crop?: PhotoMosaicTileOptions["crop"];
}

/**
 * Scatters several DIFFERENT result photos (not one split in two) into a
 * loose Polaroid pile — for "prova social" slides that need more than one
 * before/after example. Each tile alternates rotation for the scattered
 * feel; sizes step down left-to-right so it doesn't read as a rigid grid.
 */
export function multiPhotoMosaic(items: MultiPhotoMosaicItem[], opts: PhotoMosaicOptions = {}): string {
  const tokens = opts.tokens || buildTokens();
  const { tileSize = 260 } = opts;
  const rotations = [-6, 5, -4, 6];

  const tiles = items
    .map((item, i) => {
      const size = tileSize - i * 18;
      const rotate = rotations[i % rotations.length];
      const marginTop = i % 2 === 1 ? 36 : 0;
      return `<div style="margin-top: ${marginTop}px;">${polaroidTile(item.imageUrl, tokens, {
        crop: item.crop ?? "top",
        size,
        rotate,
        label: item.label,
      })}</div>`;
    })
    .join("\n  ");

  return `<div style="display: inline-flex; align-items: flex-start; gap: 8px;">
  ${tiles}
</div>`;
}
