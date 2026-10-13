import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { generateId } from "./utils";
import type { LibraryImage } from "@/types/library";

const LIB_DIR = path.resolve(process.cwd(), "public/library");

/** Validates real format with sharp, normalizes to sRGB JPG (max 1600px) and writes to public/library. */
export async function saveLibraryBuffer(
  input: Buffer,
  name: string,
  category: string,
  tags: string[]
): Promise<Omit<LibraryImage, "id" | "createdAt">> {
  const img = sharp(input, { failOn: "error" }).rotate();
  const meta = await img.metadata();
  if (!meta.format || !["jpeg", "png", "webp"].includes(meta.format)) {
    throw new Error("formato não suportado");
  }
  await mkdir(LIB_DIR, { recursive: true });
  const out = await img
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .toColorspace("srgb")
    .jpeg({ quality: 88 })
    .toBuffer({ resolveWithObject: true });
  const filename = `${generateId()}.jpg`;
  await writeFile(path.join(LIB_DIR, filename), out.data);
  return { url: `/library/${filename}`, name, category, tags, width: out.info.width, height: out.info.height };
}
