"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";
import { PinterestSearch } from "@/components/library/PinterestSearch";
import { LibraryGrid } from "@/components/library/LibraryGrid";
import { AddImages } from "@/components/library/AddImages";

const TABS = [
  { id: "pesquisar", label: "Pesquisar no Pinterest", hint: "Buscar fotos novas" },
  { id: "biblioteca", label: "Minha biblioteca", hint: "Fotos já salvas" },
  { id: "adicionar", label: "Adicionar fotos suas", hint: "Do computador" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function LibraryPage() {
  const [tab, setTab] = useState<TabId>("pesquisar");
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="h-screen flex flex-col">
      <TopBar title="Biblioteca de imagens" showBack />
      <nav className="border-b border-border bg-surface px-6 flex gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-3 text-left border-b-2 -mb-px",
              tab === t.id ? "border-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="block text-sm font-medium">{t.label}</span>
            <span className="block text-xs">{t.hint}</span>
          </button>
        ))}
      </nav>
      <div className="flex-1 overflow-auto p-6">
        {tab === "pesquisar" && <PinterestSearch onImported={refresh} />}
        {tab === "biblioteca" && <LibraryGrid refreshKey={refreshKey} />}
        {tab === "adicionar" && <AddImages onAdded={refresh} />}
      </div>
    </div>
  );
}
