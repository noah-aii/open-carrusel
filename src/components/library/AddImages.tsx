"use client";

import { useRef, useState } from "react";
import { Upload, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";

export function AddImages({ onAdded }: { onAdded: () => void }) {
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    setBusy(true);
    const form = new FormData();
    list.forEach((f) => form.append("file", f));
    form.set("category", category || "geral");
    form.set("tags", tags);
    const res = await fetch("/api/library", { method: "POST", body: form });
    const data = await res.json();
    setMessage(res.ok ? `${data.created.length} imagem(ns) adicionada(s)${data.errors.length ? ` · ${data.errors.join("; ")}` : ""}` : data.error);
    setBusy(false);
    onAdded();
  };

  const importExisting = async () => {
    setBusy(true);
    const data = await fetch("/api/library/import", { method: "POST" }).then((r) => r.json());
    setMessage(`${data.imported} imagem(ns) indexada(s) de uploads antigos`);
    setBusy(false);
    onAdded();
  };

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Adicionar fotos suas"
        description="Para fotos que já estão no seu computador (prints, fotos do Pedro, resultados de clientes). Defina categoria e tags antes de enviar e arraste os arquivos para a caixa abaixo."
      />
      <div className="flex flex-wrap items-center gap-2">
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Categoria" className="px-3 h-10 rounded-md border border-border bg-background text-sm w-44" />
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (separe por vírgula)" className="px-3 h-10 rounded-md border border-border bg-background text-sm w-60" />
      </div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload(e.dataTransfer.files);
        }}
        onClick={() => fileRef.current?.click()}
        className="rounded-lg border-2 border-dashed border-border bg-surface p-10 text-center cursor-pointer text-sm text-muted-foreground"
      >
        <Upload className="h-6 w-6 mx-auto mb-2" />
        Arraste imagens aqui ou clique para escolher
        <input ref={fileRef} type="file" multiple accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => e.target.files && upload(e.target.files)} />
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Fotos antigas que já estavam na pasta de uploads do projeto e ainda não aparecem na biblioteca:</p>
        <Button variant="outline" onClick={importExisting} disabled={busy}>
          <DownloadCloud className="h-4 w-4" /> Indexar uploads antigos
        </Button>
      </div>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </section>
  );
}
