"use client";

interface FontSpec {
  name: string;
  weight: number;
  italic?: boolean;
}

interface RawPreviewProps {
  html: string;
  height?: number;
  /** Exact font(s) to load — precise per-family axis request avoids Google Fonts silently rejecting an unsupported combo (e.g. requesting italic on a font that has no italic style). */
  fonts?: FontSpec[];
}

/** Unconstrained iframe preview — for one-off comparisons that don't need Instagram dimensions. */
export function RawPreview({ html, height = 260, fonts = [] }: RawPreviewProps) {
  const links = fonts
    .map(({ name, weight, italic }) => {
      const axis = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
      return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:${axis}&display=swap`;
    })
    .map((href) => `<link href="${href}" rel="stylesheet">`)
    .join("\n");

  const srcDoc = `<!DOCTYPE html><html><head><meta charset="utf-8">
  ${links}
  <style>* { margin:0; padding:0; box-sizing:border-box; } body { overflow: hidden; }</style>
  </head><body>${html}</body></html>`;

  return (
    <iframe
      sandbox=""
      srcDoc={srcDoc}
      title="Font comparison"
      style={{ width: "100%", height, border: "none", display: "block" }}
    />
  );
}
