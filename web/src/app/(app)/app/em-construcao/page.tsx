import Link from "next/link";
import { ArrowLeft, HardHat } from "lucide-react";

import { verifySession } from "@/lib/auth/dal";

export const metadata = {
  title: "Em construção — Eco-Sports",
};

const personaLabels: Record<string, string> = {
  parent_guardian: "Responsável",
  professional: "Profissional",
  org_admin: "Clube / Organização",
  sponsor: "Patrocinador",
  platform_admin: "Admin da plataforma",
  "nao-atleta": "usuário não-atleta",
};

export default async function EmConstrucaoPage({
  searchParams,
}: {
  searchParams: Promise<{ persona?: string | string[] }>;
}) {
  await verifySession();
  const { persona: rawPersona } = await searchParams;
  const persona = Array.isArray(rawPersona) ? rawPersona[0] : rawPersona;
  const personaLabel = persona ? personaLabels[persona] ?? persona : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
        <HardHat className="h-7 w-7" />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
        Em construção
      </p>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
        {personaLabel
          ? `A visão de ${personaLabel} está a caminho.`
          : "Essa área ainda está em construção."}
      </h1>
      <p className="text-muted-foreground max-w-xl mx-auto mb-8">
        No MVP, o Eco-Sports começa pela experiência do atleta — é a única
        persona com telas funcionais. Outras personas serão liberadas nas
        próximas entregas do roadmap.
      </p>
      <Link
        href="/app"
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao dashboard
      </Link>
    </div>
  );
}
