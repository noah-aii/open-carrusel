/**
 * Linear/outline icon set for carousel slides.
 *
 * These render as standalone inline <svg> strings (no React, no external
 * files) so they can be dropped straight into slide body-HTML, which is
 * sandboxed and only accepts inline markup — see src/lib/slide-html.ts.
 *
 * Path data is the same as the icons already used in this project's own UI
 * (lucide-react, ISC-licensed) so slide icons and app-chrome icons stay
 * visually related. Stroke-based, medium weight, rounded caps — matches the
 * thin/medium linear icons in the @clinicasdofuturo reference (bar chart,
 * paper plane) instead of filled/emoji icons.
 */

export const ICON_PATHS = {
  /** Ascending bars — "Mais pacientes" style stat pill */
  barChart: [
    "M3 3v16a2 2 0 0 0 2 2h16",
    "M18 17V9",
    "M13 17V5",
    "M8 17v-3",
  ],
  /** Two people — "menos suposições, mais pacientes certos" */
  users: [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
    "M16 3.128a4 4 0 0 1 0 7.744",
    "M22 21v-2a4 4 0 0 0-3-3.87",
  ],
  usersCircle: { cx: 9, cy: 7, r: 4 },
  /** Paper plane — "conversas que não viram agendamento" */
  paperPlane: [
    "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
    "m21.854 2.147-10.94 10.939",
  ],
  heart: [
    "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
  ],
  shieldCheck: [
    "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
    "m9 12 2 2 4-4",
  ],
  check: ["M20 6 9 17l-5-5"],
  arrowRight: ["M5 12h14", "m12 5 7 7-7 7"],
  calendarCheck: [
    "M8 2v4",
    "M16 2v4",
    "M3 10h18",
    "m9 16 2 2 4-4",
  ],
  calendarCheckRect: { x: 3, y: 4, width: 18, height: 18, rx: 2 },
  /** For "Imagem" in a framework/objection list — semantic match, not decorative */
  image: [
    "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
  ],
  imageRect: { x: 3, y: 3, width: 18, height: 18, rx: 2, ry: 2 },
  imageCircle: { cx: 9, cy: 9, r: 2 },
  /** For "Discurso"/copy in a framework list */
  messageCircle: [
    "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
  ],
  /** For "Oferta"/deal in a framework list */
  handshake: [
    "m11 17 2 2a1 1 0 1 0 3-3",
    "m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4",
    "m21 3 1 11h-2",
    "M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3",
    "M3 4h8",
  ],
  thumbsDown: [
    "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z",
    "M17 14V2",
  ],
  thumbsUp: [
    "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",
    "M7 10v12",
  ],
  /** For "lead de outro estado" — semantic match, not decorative */
  mapPin: [
    "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
  ],
  mapPinCircle: { cx: 12, cy: 10, r: 3 },
  /** For "lead sem dinheiro" */
  creditCard: ["M2 10h20"],
  creditCardRect: { x: 2, y: 5, width: 20, height: 14, rx: 2 },
  /** Cifrão — for money/faturamento pills */
  dollarSign: ["M12 2v20", "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"],
} as const;

export type IconName = Exclude<
  keyof typeof ICON_PATHS,
  "usersCircle" | "calendarCheckRect" | "imageRect" | "imageCircle" | "mapPinCircle" | "creditCardRect"
>;

interface IconOptions {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * Renders one icon as a standalone inline SVG string, ready to paste into
 * slide HTML (via IconPill or directly).
 */
export function icon(name: IconName, opts: IconOptions = {}): string {
  const { size = 40, color = "currentColor", strokeWidth = 1.8 } = opts;
  const paths = ICON_PATHS[name] as readonly string[];
  const common = `stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" fill="none"`;

  let extra = "";
  if (name === "users") {
    const c = ICON_PATHS.usersCircle;
    extra = `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" ${common} />`;
  }
  if (name === "calendarCheck") {
    const r = ICON_PATHS.calendarCheckRect;
    extra = `<rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" rx="${r.rx}" ${common} />`;
  }
  if (name === "image") {
    const r = ICON_PATHS.imageRect;
    const c = ICON_PATHS.imageCircle;
    extra = `<rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" rx="${r.rx}" ry="${r.ry}" ${common} /><circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" ${common} />`;
  }
  if (name === "mapPin") {
    const c = ICON_PATHS.mapPinCircle;
    extra = `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" ${common} />`;
  }
  if (name === "creditCard") {
    const r = ICON_PATHS.creditCardRect;
    extra = `<rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" rx="${r.rx}" ${common} />`;
  }

  const pathTags = paths.map((d) => `<path d="${d}" ${common} />`).join("");

  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${pathTags}${extra}</svg>`;
}
