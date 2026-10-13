import { NextResponse } from "next/server";
import { updateImage, removeImage } from "@/lib/image-library";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const img = await updateImage(id, {
    name: body.name,
    category: body.category,
    tags: body.tags,
  });
  if (!img) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(img);
}

// Removes from the index only; the file stays on disk because slides may still reference it.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const removed = await removeImage(id);
  if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
