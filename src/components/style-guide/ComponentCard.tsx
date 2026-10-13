import { SlideRenderer } from "@/components/editor/SlideRenderer";
import { CopyButton } from "./CopyButton";
import type { AspectRatio } from "@/types/carousel";

interface ComponentCardProps {
  title: string;
  description: string;
  html: string;
  aspectRatio?: AspectRatio;
  previewHeight?: number;
}

/** One card in the style guide: label, live rendered preview, copy-able HTML. */
export function ComponentCard({
  title,
  description,
  html,
  aspectRatio = "1:1",
  previewHeight = 420,
}: ComponentCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div
        className="bg-muted"
        style={{ height: previewHeight }}
      >
        <SlideRenderer html={html} aspectRatio={aspectRatio} className="w-full h-full" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-semibold text-sm">{title}</h3>
          <CopyButton text={html} />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
