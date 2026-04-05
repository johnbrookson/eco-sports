import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Search } from "lucide-react";

// 404 customizado, escopado a /atleta/[slug].
// Acionado quando o page.tsx chama notFound() — seja porque o slug não existe
// ou porque visibility.publicProfileEnabled = false.
// Herda o layout de (profile): header absoluto sobre o hero + footer discreto.

export const metadata: Metadata = {
  title: "Perfil não encontrado — Eco-Sports",
  description:
    "Esse perfil de atleta não existe, foi arquivado ou ainda não foi publicado.",
  robots: { index: false, follow: false },
};

export default function AthleteNotFound() {
  return (
    <article className="bg-background">
      <section className="relative isolate overflow-hidden bg-[#0b0f1a] text-white">
        <div
          className="absolute inset-0 -z-10 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.25) 0, rgba(255,255,255,0.25) 1px, transparent 1px, transparent 14px)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-[#0b0f1a]" />

        <div className="mx-auto max-w-6xl px-6 pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="flex flex-col gap-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Erro 404
              </span>
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 backdrop-blur-sm">
                Perfil não encontrado
              </span>
            </div>

            <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
              <span className="block text-white">Atleta</span>
              <span className="block text-primary">fora de quadra</span>
            </h1>

            <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-white/70 font-medium">
              Esse perfil não existe, foi arquivado ou ainda não foi publicado
              pelo atleta. Confira se o link está correto ou volte para a
              plataforma.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
            Próximos passos
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-10 max-w-2xl">
            Provavelmente um desses caminhos resolve.
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/"
              className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-6 hover:border-primary transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ArrowRight className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Plataforma
                </p>
                <p className="text-base font-bold text-foreground">
                  Voltar para a Eco-Sports
                </p>
              </div>
            </Link>

            <Link
              href="/para-quem"
              className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-6 hover:border-primary transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Descubra
                </p>
                <p className="text-base font-bold text-foreground">
                  Para quem é o Eco-Sports
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
