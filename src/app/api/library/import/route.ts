import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { addImages, hasUrl } from "@/lib/image-library";

const UPLOAD_DIR = path.resolve(process.cwd(), "public/uploads");

// Prefix of files in public/uploads → category + starter tags.
const PREFIXES: Record<string, { category: string; tags: string[] }> = {
  aera: { category: "lifestyle", tags: ["mulheres", "experiencia", "estetica", "bem-estar"] },
  her: { category: "mulher", tags: ["selfie", "celular", "natural", "feminino"] },
  nat: { category: "mulher", tags: ["natural", "casual", "feminino", "old money"] },
  luxo: { category: "luxo", tags: ["luxo", "bolsa", "interior", "aesthetic"] },
  odonto: { category: "clinica", tags: ["odontologia", "dentista", "consultorio"] },
  consultorio: { category: "clinica", tags: ["consultorio", "interior", "clinica"] },
  tenis: { category: "tenis", tags: ["tenis", "esporte", "quadra"] },
  kimi: { category: "esporte", tags: ["f1", "automobilismo", "antes e depois"] },
  resultado: { category: "provas", tags: ["resultado", "prova social", "print"] },
  perfil: { category: "perfil", tags: ["perfil", "instagram", "print"] },
  pedro: { category: "perfil", tags: ["pedro", "foto"] },
  maquina: { category: "objetos", tags: ["maquina de escrever", "copywriting"] },
  post: { category: "objetos", tags: ["post-it", "plano"] },
};

// UUID-named files and slide-N.png are app uploads / exports, not curated photos.
const SKIP = /^([0-9a-f]{8}-[0-9a-f]{4}-|slide-\d|nsm-logo)/;

export async function POST() {
  const files = (await readdir(UPLOAD_DIR)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !SKIP.test(f));
  const items = [];
  for (const f of files) {
    const url = `/uploads/${f}`;
    if (await hasUrl(url)) continue;
    const base = path.parse(f).name;
    const prefix = base.split("-")[0];
    const rule = PREFIXES[prefix] ?? { category: "geral", tags: [] };
    const meta = await sharp(path.join(UPLOAD_DIR, f)).metadata();
    items.push({
      url,
      name: base,
      category: rule.category,
      tags: rule.tags,
      width: meta.width ?? 0,
      height: meta.height ?? 0,
    });
  }
  const created = await addImages(items);
  return NextResponse.json({ imported: created.length });
}
