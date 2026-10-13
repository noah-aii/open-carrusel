export interface TweetPhoto {
  /** Path under /uploads, e.g. "/uploads/tenis-quadra.jpg". */
  src: string;
  /** CSS object-position, e.g. "center 40%". Pick per photo so the face/subject survives the crop. */
  position?: string;
}

export interface TweetPhotoBlockOptions {
  /** Show the white "→" circle (every slide except the last). Default true. */
  arrow?: boolean;
}

/** PADRÃO ÚNICO de fotos do preset "Print de Tweet" — vale para 1, 2 ou 3 fotos. */
export const TWEET_PHOTO_BLOCK = {
  sideMargin: 48, // alinhado ao padding do texto/cabeçalho
  bottomMargin: 48,
  photoHeight: 680,
  gap: 12, // entre fotos (só aparece com 2 ou 3)
} as const;

/**
 * Bloco de fotos do slide "print de tweet": 1, 2 ou 3 fotos na mesma linha,
 * com margem lateral e inferior de 48px, altura fixa de 680px, object-fit:cover.
 * Fotos dividem a largura em partes iguais. A seta fica dentro da última foto.
 * Use como ÚLTIMO filho do container do slide (flex column, 1080x1350).
 */
export function tweetPhotoBlock(photos: TweetPhoto[], opts: TweetPhotoBlockOptions = {}): string {
  if (photos.length < 1 || photos.length > 3) {
    throw new Error("tweetPhotoBlock aceita de 1 a 3 fotos");
  }
  const { sideMargin, bottomMargin, photoHeight, gap } = TWEET_PHOTO_BLOCK;
  const { arrow = true } = opts;

  const cells = photos
    .map(
      (p) =>
        `<div style="flex:1;min-width:0;height:100%;overflow:hidden;"><img src="${p.src}" style="width:100%;height:100%;object-fit:cover;object-position:${p.position || "center center"};display:block;" /></div>`
    )
    .join("");

  const arrowEl = arrow
    ? `<div style="position:absolute;bottom:24px;right:24px;width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.92);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,0.25);"><span style="font-size:32px;line-height:1;color:#0F1419;">&#8594;</span></div>`
    : "";

  return `<div style="width:100%;height:${photoHeight + bottomMargin}px;flex-shrink:0;padding:0 ${sideMargin}px ${bottomMargin}px ${sideMargin}px;box-sizing:border-box;"><div style="width:100%;height:100%;position:relative;display:flex;gap:${gap}px;overflow:hidden;">${cells}${arrowEl}</div></div>`;
}
