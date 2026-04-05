import Link from "next/link";
import { ArrowRight, User, BarChart3, Clock } from "lucide-react";

import { getCurrentAthlete } from "@/lib/auth/dal";

export const metadata = {
  title: "Dashboard — Eco-Sports",
};

export default async function AppDashboardPage() {
  const athlete = await getCurrentAthlete();
  const firstName = athlete.profile.preferredName ?? athlete.profile.firstName;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Olá, {firstName}
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Bem-vindo à sua central.
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Esta é a área autenticada do Eco-Sports. No MVP, o perfil do atleta é
          a tela viva — as outras seções estão em construção e serão liberadas
          nas próximas entregas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/app/perfil"
          className="group rounded-2xl border border-border bg-card p-6 hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Editar
              </p>
              <p className="text-base font-black text-foreground">
                Meu perfil
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Atualize sua bio, foto, dados físicos, clube e conquistas — e
            controle o que aparece no perfil público.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Abrir perfil
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Em breve
              </p>
              <p className="text-base font-black text-muted-foreground">
                Performance
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Histórico de métricas por treino, jogo e avaliação. Gráficos de
            evolução e benchmarks por categoria.
          </p>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>
          Última atualização do perfil:{" "}
          {new Date(athlete.updatedAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
