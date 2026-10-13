"use client";

import { useEffect, useState } from "react";
import { Globe, LogIn, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

interface WebResult {
  thumb: string;
  full: string;
  fallback: string;
  alt: string;
}

interface Status {
  loggedIn: boolean;
  windowOpen: boolean;
}

export function PinterestSearch({ onImported }: { onImported: () => void }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [results, setResults] = useState<WebResult[]>([]);
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/library/pinterest")
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && setStatus(s))
      .catch(() => {});
  }, []);

  const openLogin = async () => {
    if (busy) return;
    setBusy(true);
    setMessage("Abrindo a janela do Chrome... olhe o Dock/outras janelas do Mac se não aparecer.");
    await fetch("/api/library/pinterest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "open" }),
    });
    setStatus({ loggedIn: false, windowOpen: true });
    setMessage("");
    setBusy(false);
  };

  const finishLogin = async () => {
    setBusy(true);
    const res = await fetch("/api/library/pinterest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "close" }),
    });
    const data = await res.json();
    setStatus({ loggedIn: !!data.loggedIn, windowOpen: false });
    setMessage(data.loggedIn ? "Login salvo. As próximas buscas trazem mais resultados." : "Não detectei o login — tente de novo.");
    setBusy(false);
  };

  const search = async () => {
    if (!query.trim()) return;
    setBusy(true);
    setMessage("Buscando no Pinterest... (de 15s a 1min)");
    const res = await fetch(`/api/library/web-search?q=${encodeURIComponent(query)}&limit=100`);
    const data = await res.json();
    setResults(res.ok ? data.results : []);
    setPicked(new Set());
    setMessage(res.ok ? `${data.total} resultados — clique nas fotos que quer guardar` : data.error);
    setBusy(false);
  };

  const importPicked = async () => {
    const items = [...picked].map((i) => results[i]);
    if (items.length === 0) return;
    setBusy(true);
    setMessage("Importando...");
    const res = await fetch("/api/library/web-import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, query, category: category || query }),
    });
    const data = await res.json();
    setMessage(res.ok ? `${data.created.length} foto(s) salvas na biblioteca${data.errors.length ? ` · ${data.errors.length} falharam` : ""}` : data.error);
    setResults([]);
    setPicked(new Set());
    setBusy(false);
    onImported();
  };

  const toggle = (i: number) =>
    setPicked((prev) => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Pesquisar fotos no Pinterest"
        description='Digite o que procura (frases curtas em inglês funcionam melhor, ex: "old money aesthetic"), escolha as fotos que gostou e importe. Elas vão para "Minha biblioteca" já com categoria e tags. O agente do chat também usa esta mesma busca sozinho.'
      />

      <div className="rounded-lg border border-border bg-surface p-4 flex flex-wrap items-center gap-3">
        {status === null ? (
          <span className="text-sm text-muted-foreground">Verificando conexão com o Pinterest...</span>
        ) : status.loggedIn ? (
          <span className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-600" /> Conta do Pinterest conectada — buscas com mais resultados
          </span>
        ) : status?.windowOpen ? (
          <>
            <span className="text-sm">Faça login na janela do Chrome que abriu e depois clique em concluir.</span>
            <Button onClick={finishLogin} disabled={busy}>Já fiz login, concluir</Button>
          </>
        ) : (
          <>
            <span className="text-sm text-muted-foreground">Sem login você recebe ~25 fotos por busca. Conectando, vêm bem mais.</span>
            <Button variant="outline" onClick={openLogin} disabled={busy}>
              <LogIn className="h-4 w-4" /> Conectar conta do Pinterest
            </Button>
          </>
        )}
        {status?.loggedIn && (
          <Button variant="ghost" size="sm" onClick={openLogin}>Trocar conta</Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="O que você procura?"
          className="px-3 h-10 rounded-md border border-border bg-background text-sm w-80"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Categoria (opcional)"
          className="px-3 h-10 rounded-md border border-border bg-background text-sm w-48"
        />
        <Button onClick={search} disabled={busy || status?.windowOpen}>Buscar</Button>
        {results.length > 0 && (
          <Button variant="ghost" onClick={() => setPicked(new Set(results.map((_, i) => i)))}>Selecionar todas</Button>
        )}
        {picked.size > 0 && (
          <Button variant="accent" onClick={importPicked} disabled={busy}>Importar {picked.size} selecionada(s)</Button>
        )}
      </div>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}

      {results.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
          {results.map((r, i) => (
            <button
              key={r.thumb}
              onClick={() => toggle(i)}
              className={cn("rounded-md overflow-hidden border-2", picked.has(i) ? "border-accent" : "border-transparent")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.thumb} alt="" referrerPolicy="no-referrer" className="w-full aspect-[3/4] object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
