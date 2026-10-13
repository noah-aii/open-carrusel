import { TopBar } from "@/components/layout/TopBar";
import { RawPreview } from "@/components/style-guide/RawPreview";

const HEADLINE = "As 5 objeções<br/>que mais fazem";
const ACCENT = "paciente sumir";

function sansCandidate(name: string, weight: number, letterSpacing = "0em") {
  return `<div style="padding: 32px 40px; font-family: '${name}', sans-serif; font-weight: ${weight}; font-size: 64px; line-height: 1.05; letter-spacing: ${letterSpacing}; color: #111111;">${HEADLINE}</div>`;
}

function scriptCandidate(name: string, style: "italic" | "normal", weight: number) {
  return `<div style="padding: 24px 40px 40px; font-family: '${name}', serif; font-style: ${style}; font-weight: ${weight}; font-size: 80px; line-height: 1.1; background: linear-gradient(135deg, #F0629C, #7C5CFC); -webkit-background-clip: text; background-clip: text; color: transparent;">${ACCENT}</div>`;
}

const SANS_CANDIDATES: { name: string; weight: number; letterSpacing?: string; note: string }[] = [
  {
    name: "Big Shoulders Display",
    weight: 800,
    letterSpacing: "-0.01em",
    note: "★ recomendada — condensada por padrão, geométrica/monoline (baixo contraste de traço), altura grande, vai até 900 (Black). Pedigree editorial (masthead de jornal), não corporativa nem arredondada.",
  },
  {
    name: "Oswald",
    weight: 700,
    note: "Condensada e legível, base gótica/DIN. Só vai até 700 — sem verdadeiro extra-bold/black.",
  },
  {
    name: "Barlow Condensed",
    weight: 800,
    note: "Já é a fonte do seu design system pessoal (JP/BRVY) — consistência entre projetos, mas mais humanista/utilitária do que geométrica pura.",
  },
  {
    name: "Archivo Black",
    weight: 900,
    note: "Peso único, bem geométrica, mas NÃO é condensada — mais larga que o pedido.",
  },
  {
    name: "Anton",
    weight: 400,
    note: "Extremamente condensada e pesada (peso único) — pode ficar heavy demais para 2-3 linhas de título.",
  },
];

const SCRIPT_CANDIDATES: {
  name: string;
  style: "italic" | "normal";
  weight: number;
  note: string;
}[] = [
  {
    name: "Parisienne",
    style: "normal",
    weight: 400,
    note: "★ recomendada — script/cursiva de verdade (letras conectadas e fluidas), sofisticada, comum em branding de estética premium. Não é itálico de serif, é cursiva mesmo, como o brief pediu.",
  },
  {
    name: "Playfair Display",
    style: "italic",
    weight: 600,
    note: "Atual. É itálico de serif elegante, mas tecnicamente não é 'script/cursiva' — mais reto e menos fluido que o pedido.",
  },
  {
    name: "Cormorant Garamond",
    style: "italic",
    weight: 600,
    note: "Serif itálico mais fino/delicado que Playfair. Também não é script.",
  },
  {
    name: "Bodoni Moda",
    style: "italic",
    weight: 600,
    note: "Alto contraste, editorial de moda — bonito, mas contraste forte pode brigar com a sans-serif de baixo contraste ao lado.",
  },
  {
    name: "Italiana",
    style: "normal",
    weight: 400,
    note: "Display serif elegante em caixa alta — não é cursiva, é outra categoria (bom para eyebrow/rótulo, não para a palavra de destaque).",
  },
];

export default function TypographyComparisonPage() {
  return (
    <div className="h-full flex flex-col">
      <TopBar title="Comparação tipográfica" showBack />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold mb-1">Comparação tipográfica</h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            Antes de trocar a fonte do brand.json, comparando lado a lado contra o pedido:
            sans-serif geométrica/condensada/alta para o título pesado, e uma script elegante
            (não itálico de serif) para a palavra de destaque.
          </p>

          <h2 className="text-lg font-semibold mb-3">
            Sans-serif do título (&ldquo;As 5 objeções que mais fazem&rdquo;)
          </h2>
          <div className="space-y-4 mb-10">
            {SANS_CANDIDATES.map((c) => (
              <div key={c.name} className="rounded-xl border border-border bg-surface overflow-hidden">
                <RawPreview
                  html={sansCandidate(c.name, c.weight, c.letterSpacing)}
                  fonts={[{ name: c.name, weight: c.weight }]}
                  height={190}
                />
                <div className="p-3 border-t border-border">
                  <p className="text-sm font-semibold">
                    {c.name} · peso {c.weight}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.note}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-semibold mb-3">
            Script de destaque (&ldquo;paciente sumir&rdquo;)
          </h2>
          <div className="space-y-4 mb-10">
            {SCRIPT_CANDIDATES.map((c) => (
              <div key={c.name} className="rounded-xl border border-border bg-surface overflow-hidden">
                <RawPreview
                  html={scriptCandidate(c.name, c.style, c.weight)}
                  fonts={[{ name: c.name, weight: c.weight, italic: c.style === "italic" }]}
                  height={170}
                />
                <div className="p-3 border-t border-border">
                  <p className="text-sm font-semibold">
                    {c.name} · {c.style} {c.weight}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
