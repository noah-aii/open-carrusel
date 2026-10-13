"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2, Copy, Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LibraryImage } from "@/types/library";
import { SectionHeader } from "./SectionHeader";

export function LibraryGrid({ refreshKey }: { refreshKey: number }) {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    const data = await fetch(`/api/library?${params}`).then((r) => r.json());
    setImages(data.images);
    setCategories(data.categories);
  }, [q, category]);

  useEffect(() => {
    const t = setTimeout(load, 150);
    return () => clearTimeout(t);
  }, [load, refreshKey]);

  const patch = async (img: LibraryImage, body: Record<string, unknown>) => {
    await fetch(`/api/library/${img.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    load();
  };

  const remove = async (img: LibraryImage) => {
    await fetch(`/api/library/${img.id}`, { method: "DELETE" });
    load();
  };

  const copy = (img: LibraryImage) => {
    navigator.clipboard.writeText(img.url);
    setCopied(img.id);
    setTimeout(() => setCopied(null), 1200);
  };

  const total = categories.reduce((n, c) => n + c.count, 0);

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Minha biblioteca"
        description="Todas as fotos salvas. É aqui que o agente do chat procura primeiro ao montar um carrossel, usando a categoria e as tags — quanto mais específicas as tags, melhor ele acerta. Edite direto no card."
      />
      <div className="relative w-72">
        <Search className="h-4 w-4 absolute left-2.5 top-3 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou tag" className="pl-8 pr-3 h-10 rounded-md border border-border bg-surface text-sm w-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        {[{ category: "", count: total }, ...categories].map((c) => (
          <button
            key={c.category || "all"}
            onClick={() => setCategory(c.category)}
            className={cn("px-3 py-1 rounded-full text-xs border", category === c.category ? "bg-foreground text-background" : "border-border bg-surface")}
          >
            {c.category || "todas"} · {c.count}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {images.map((img) => (
          <div key={img.id} className="rounded-lg border border-border bg-surface overflow-hidden group">
            <div className="relative aspect-[4/5] bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.name} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="bg-surface/90" onClick={() => copy(img)} aria-label="Copiar caminho">
                  {copied === img.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="ghost" className="bg-surface/90" onClick={() => remove(img)} aria-label="Remover da biblioteca">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-2 space-y-1">
              <p className="text-xs font-medium truncate">{img.name}</p>
              <input defaultValue={img.category} onBlur={(e) => e.target.value !== img.category && patch(img, { category: e.target.value })} className="w-full text-xs bg-transparent border-b border-transparent hover:border-border focus:border-accent outline-none" aria-label="Categoria" />
              <input defaultValue={img.tags.join(", ")} placeholder="tags" onBlur={(e) => patch(img, { tags: e.target.value })} className="w-full text-xs text-muted-foreground bg-transparent border-b border-transparent hover:border-border focus:border-accent outline-none" aria-label="Tags" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
