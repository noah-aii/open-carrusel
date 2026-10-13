import { getBrand } from "@/lib/brand";
import { TopBar } from "@/components/layout/TopBar";
import { ComponentCard } from "@/components/style-guide/ComponentCard";
import {
  buildTokens,
  messageBubble,
  iconPill,
  objectionList,
  photoCard,
  slideCanvas,
  exampleObjectionsSlide,
  exampleAdMockupSlide,
} from "@/lib/carousel-elements";

function centered(inner: string): string {
  return `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 60px; box-sizing: border-box;">${inner}</div>`;
}

export default async function StyleGuidePage() {
  const brand = await getBrand();
  const tokens = buildTokens(brand);

  const bubbleDefaultHtml = slideCanvas(
    centered(messageBubble("Vou pensar e te falo", { tokens, rotate: -3, fontSize: 36 })),
    { tokens, width: 1080, height: 1080, padding: 0 }
  );

  const bubbleProofHtml = slideCanvas(
    centered(
      messageBubble("Vi que vocês atendem minha queixa. Quero agendar avaliação.", {
        tokens,
        variant: "proof",
        tail: "bottom-right",
        align: "right",
        fontSize: 32,
        maxWidth: 560,
      })
    ),
    { tokens, width: 1080, height: 1080, padding: 0 }
  );

  const pillStatHtml = slideCanvas(
    centered(iconPill("barChart", "Mais pacientes", { tokens })),
    { tokens, width: 1080, height: 1080, padding: 0 }
  );

  const pillUsersHtml = slideCanvas(
    centered(iconPill("users", "Menos suposições. Mais pacientes certos.", { tokens, fontSize: 28 })),
    { tokens, width: 1080, height: 1080, padding: 0 }
  );

  const objectionListHtml = slideCanvas(
    `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: flex-end; padding-right: 60px; box-sizing: border-box;">
      ${objectionList(
        [
          "Vou pensar e te falo",
          "Preciso falar com meu marido",
          "Vi mais barato em outra clínica.",
          "Tenho medo de ficar artificial.",
          "Depois eu vejo minha agenda.",
        ],
        { tokens, itemOptions: { fontSize: 28, rotate: -2, maxWidth: 480 } }
      )}
    </div>`,
    { tokens, width: 1080, height: 1350, padding: 0 }
  );

  const backgroundOnlyHtml = slideCanvas("", { tokens });

  const fullSlideHtml = exampleObjectionsSlide(brand);

  const photoCardPlaceholderHtml = slideCanvas(
    centered(photoCard(null, { tokens, caption: "Sua clínica, do jeito certo pra você.", rotate: 4 })),
    { tokens, width: 1080, height: 1080, padding: 0 }
  );

  const adMockupSlideHtml = exampleAdMockupSlide(brand, null);

  return (
    <div className="h-full flex flex-col">
      <TopBar title="Biblioteca de elementos — Carrossel" showBack />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold mb-1">Biblioteca de elementos</h1>
          <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
            Componentes reutilizáveis extraídos por engenharia reversa das referências
            @clinicasdofuturo. Código-fonte em{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
              src/lib/carousel-elements/
            </code>
            . Cada card abaixo é renderizado ao vivo (não é imagem estática) e pode ser
            copiado como HTML pronto para colar em qualquer slide.
          </p>

          <div className="rounded-xl border border-border bg-surface p-5 mb-8 text-sm space-y-2">
            <h2 className="font-semibold mb-2">Análise visual aplicada</h2>
            <p>
              <strong>Tipografia:</strong> corpo/rótulos em &ldquo;{tokens.fonts.body}&rdquo;
              (peso 500 nos balões, 700 nas pílulas); título de efeito em &ldquo;
              {tokens.fonts.heading}&rdquo; itálico com gradiente rosa→roxo — igual ao
              carrossel já validado.
            </p>
            <p>
              <strong>Border-radius:</strong> balão de mensagem {tokens.radius.bubble}px
              (retângulo bem arredondado, não pílula total); pílula/badge{" "}
              {tokens.radius.pill}px (totalmente arredondada).
            </p>
            <p>
              <strong>Sombra:</strong> difusa e em duas camadas — <code>{tokens.shadow.soft}</code> —
              sem contorno duro, para dar sensação de elemento flutuando.
            </p>
            <p>
              <strong>Espaçamento:</strong> balão com {tokens.spacing.bubblePaddingY}×
              {tokens.spacing.bubblePaddingX}px de padding interno; pílula com{" "}
              {tokens.spacing.pillPaddingY}×{tokens.spacing.pillPaddingX}px e{" "}
              {tokens.spacing.pillIconGap}px de espaço entre ícone e texto; lista de
              objeções com {tokens.spacing.listGap}px de vão entre balões.
            </p>
            <p>
              <strong>Cores:</strong> fundo {tokens.colors.background}, superfície dos
              componentes {tokens.colors.surface}, texto {tokens.colors.text}, ícones{" "}
              {tokens.colors.icon} (mesma cor secundária da marca), verde de prova{" "}
              {tokens.colors.proofBg}/{tokens.colors.proofText} (só na mensagem que já
              converteu).
            </p>
            <p className="text-muted-foreground">
              <strong>Ponto de julgamento:</strong> a &ldquo;cauda&rdquo; do balão não é
              nítida nas referências em baixa resolução — implementei uma cauda sutil
              (canto arredondado de 45°) que pode ser desligada com{" "}
              <code>tail: &quot;none&quot;</code>. Ajuste depois de ver ao vivo se quiser
              mais ou menos pronunciada.
            </p>
          </div>

          <h2 className="text-lg font-semibold mb-3">1. Balão de mensagem</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <ComponentCard
              title="Balão padrão (objeção)"
              description='messageBubble(text, { variant: "default" }) — branco/off-white, cauda inferior-esquerda, sombra suave.'
              html={bubbleDefaultHtml}
            />
            <ComponentCard
              title="Balão de prova (convertida)"
              description='messageBubble(text, { variant: "proof" }) — verde suave, para a mensagem que já fechou, alinhada à direita como resposta.'
              html={bubbleProofHtml}
            />
          </div>

          <h2 className="text-lg font-semibold mb-3">2. Pílula / badge com ícone</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <ComponentCard
              title='iconPill("barChart", "Mais pacientes")'
              description="Ícone e texto trocáveis livremente. Aceita também um SVG customizado no lugar do nome do ícone."
              html={pillStatHtml}
            />
            <ComponentCard
              title='iconPill("users", "Menos suposições...")'
              description="Texto mais longo quebra em 2 linhas mantendo o formato de pílula (maxWidth configurável)."
              html={pillUsersHtml}
            />
          </div>

          <h2 className="text-lg font-semibold mb-3">3. Lista de objeções</h2>
          <div className="grid grid-cols-1 gap-4 mb-8">
            <ComponentCard
              title="objectionList([...5 itens])"
              description="Empilha vários messageBubble com espaçamento consistente — é a função usada pela IA do chat sempre que pedir uma lista de objeções/mensagens."
              html={objectionListHtml}
              aspectRatio="4:5"
              previewHeight={620}
            />
          </div>

          <h2 className="text-lg font-semibold mb-3">4. Card de foto / mockup de anúncio</h2>
          <div className="rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs p-3 mb-4">
            Ainda não tenho uma foto real de clínica pra testar aqui — o card abaixo usa o
            mesmo placeholder em gradiente que a IA usou no carrossel Funil Blindado.
            Manda uma foto (sua, da Kelly, ou de algum cliente NSM) e eu troco pelo real —
            é só passar o caminho do arquivo como <code>imageUrl</code>.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <ComponentCard
              title="photoCard(null, {...})"
              description="Card branco com eyebrow (fonte heading), foto/placeholder, legenda e linha 'Saiba mais →'. Passe uma URL real em /uploads/ quando tiver a foto."
              html={photoCardPlaceholderHtml}
            />
            <ComponentCard
              title="Slide 1 recomposto (Doutora, o perfil do paciente...)"
              description="exampleAdMockupSlide(brand) — reproduz o slide 1 da OUTRA referência (card de anúncio + 2 pílulas), a que tinha a imagem da clínica."
              html={adMockupSlideHtml}
              aspectRatio="4:5"
              previewHeight={620}
            />
          </div>

          <h2 className="text-lg font-semibold mb-3">5-7. Sombra, fundo pontilhado e ícones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <ComponentCard
              title="dottedBackgroundCss() / slideCanvas()"
              description="Fundo off-white com grade de pontos regulares, baixa opacidade — usado como base de toda slide."
              html={backgroundOnlyHtml}
            />
            <ComponentCard
              title="Slide completo (todos os componentes juntos)"
              description="exampleObjectionsSlide(brand) — a composição final, pronta para virar exampleSlideHtml de um style preset."
              html={fullSlideHtml}
              aspectRatio="4:5"
              previewHeight={620}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
