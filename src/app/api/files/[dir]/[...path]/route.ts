import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// In production (`next start`) Next only serves files that existed in public/ at build time.
// Photos imported or uploaded afterwards are served from here (see rewrites in next.config.ts).
const ALLOWED_DIRS = new Set(["library", "uploads"]);
const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ dir: string; path: string[] }> }
) {
  const { dir, path: segments } = await params;
  if (!ALLOWED_DIRS.has(dir)) return new NextResponse("Not found", { status: 404 });

  const root = path.resolve(process.cwd(), "public", dir);
  const file = path.resolve(root, ...segments);
  const mime = MIME[path.extname(file).toLowerCase()];
  if (!mime || !file.startsWith(root + path.sep)) return new NextResponse("Not found", { status: 404 });

  try {
    const data = await readFile(file);
    return new NextResponse(new Uint8Array(data), {
      headers: { "Content-Type": mime, "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
