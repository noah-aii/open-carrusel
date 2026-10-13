import { readDataSafe, writeData } from "./data";
import { generateId, now } from "./utils";
import type { LibraryData, LibraryImage } from "@/types/library";

const FILE = "image-library.json";

async function load(): Promise<LibraryData> {
  return readDataSafe<LibraryData>(FILE, { images: [] });
}

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function parseTags(raw: unknown): string[] {
  const list = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(",") : [];
  return [...new Set(list.map((t) => normalize(String(t)).trim()).filter(Boolean))];
}

export async function listImages(opts: { q?: string; category?: string; tag?: string } = {}): Promise<LibraryImage[]> {
  const { images } = await load();
  const terms = normalize(opts.q ?? "").split(/\s+/).filter(Boolean);
  const category = opts.category ? normalize(opts.category) : "";
  const tag = opts.tag ? normalize(opts.tag) : "";
  return images
    .filter((img) => {
      if (category && normalize(img.category) !== category) return false;
      if (tag && !img.tags.includes(tag)) return false;
      const hay = normalize(`${img.name} ${img.category} ${img.tags.join(" ")}`);
      return terms.every((t) => hay.includes(t));
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addImages(
  items: Array<Omit<LibraryImage, "id" | "createdAt">>
): Promise<LibraryImage[]> {
  const data = await load();
  const created = items.map((i) => ({ ...i, id: generateId(), createdAt: now() }));
  data.images.push(...created);
  await writeData(FILE, data);
  return created;
}

export async function updateImage(
  id: string,
  patch: Partial<Pick<LibraryImage, "name" | "category" | "tags">>
): Promise<LibraryImage | null> {
  const data = await load();
  const img = data.images.find((i) => i.id === id);
  if (!img) return null;
  if (patch.name !== undefined) img.name = patch.name.trim() || img.name;
  if (patch.category !== undefined) img.category = normalize(patch.category).trim() || "geral";
  if (patch.tags !== undefined) img.tags = parseTags(patch.tags);
  await writeData(FILE, data);
  return img;
}

export async function removeImage(id: string): Promise<LibraryImage | null> {
  const data = await load();
  const idx = data.images.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  const [removed] = data.images.splice(idx, 1);
  await writeData(FILE, data);
  return removed;
}

export async function listCategories(): Promise<Array<{ category: string; count: number }>> {
  const { images } = await load();
  const map = new Map<string, number>();
  for (const i of images) map.set(i.category, (map.get(i.category) ?? 0) + 1);
  return [...map].map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count);
}

export async function hasUrl(url: string): Promise<boolean> {
  const { images } = await load();
  return images.some((i) => i.url === url);
}

/** Compact catalog for the chat system prompt: category → count + sample tags. */
export async function buildCatalogSummary(): Promise<string> {
  const { images } = await load();
  if (images.length === 0) return "";
  const byCat = new Map<string, LibraryImage[]>();
  for (const i of images) byCat.set(i.category, [...(byCat.get(i.category) ?? []), i]);
  const lines = [...byCat].map(([cat, imgs]) => {
    const tagCount = new Map<string, number>();
    imgs.forEach((i) => i.tags.forEach((t) => tagCount.set(t, (tagCount.get(t) ?? 0) + 1)));
    const top = [...tagCount].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t]) => t);
    return `- ${cat} (${imgs.length})${top.length ? ` — tags: ${top.join(", ")}` : ""}`;
  });
  return lines.join("\n");
}
