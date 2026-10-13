"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border border-border bg-surface hover:bg-muted transition-colors"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" /> Copiado
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" /> Copiar HTML
        </>
      )}
    </button>
  );
}
