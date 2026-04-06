import Link from "next/link";
import {
  ArrowRight,
  User,
  Users,
  BarChart3,
  Clock,
  Eye,
  EyeOff,
  TrendingUp,
  Trophy,
  Activity,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import {
  getCurrentAthlete,
  getCurrentPersona,
  getCurrentUser,
  getManagedAthletesForCurrentUser,
} from "@/lib/auth/dal";
import { getPerformanceEventsForAthlete } from "@/lib/mock/get-performance";
import type { Athlete } from "@/types/athlete";

export const metadata = {
  title: "Dashboard — Eco-Sports",
};

// ---------------------------------------------------------------------------
// Guardian Dashboard
// ---------------------------------------------------------------------------

async function GuardianDashboard() {
  const user = await getCurrentUser();
  const athletes = await getManagedAthletesForCurrentUser();
  const firstName = user.name.split(" ")[0];

  const pendingCount = athletes.filter((a) => a.pendingVisibility).length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Olá, {firstName}
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Painel do Responsável
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
          Acompanhe a evolução dos seus atletas e aprove alterações de
          visibilidade.
        </p>
      </div>

      {/* Alerta de aprovações pendentes */}
      {pendingCount > 0 && (
        <Link
          href="/app/aprovacoes"
          className="flex items-center gap-3 rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-5 mb-8 hover:border-amber-500/50 transition-colors"
        >
          <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">
              {pendingCount === 1
                ? "1 aprovação pendente"
                : `${pendingCount} aprovações pendentes`}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Alterações de visibilidade aguardando sua autorização.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </Link>
      )}

      {/* Atletas supervisionados */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Atletas supervisionados
          </h2>
        </div>

        {athletes.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum atleta vinculado.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {athletes.map((athlete) => (
              <GuardianAthleteCard key={athlete.id} athlete={athlete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GuardianAthleteCard({ athlete }: { athlete: Athlete }) {
  const fullName = `${athlete.profile.firstName} ${athlete.profile.lastName}`;
  const initials = `${athlete.profile.firstName[0]}${athlete.profile.lastName[0]}`.toUpperCase();
  const hasPending = !!athlete.pendingVisibility;

  return (
    <Link
      href={`/app/atletas/${athlete.id}`}
      className="group rounded-2xl border border-border bg-card p-5 hover:border-primary transition-colors"
    >
      <div className="flex items-center gap-3 mb-4">
        {athlete.profile.photoUrl ? (
          <img
            src={athlete.profile.photoUrl}
            alt={fullName}
            className="h-12 w-12 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-foreground truncate">{fullName}</p>
          <p className="text-xs text-muted-foreground">
            {athlete.sport.primaryPosition
              ? `${athlete.sport.primaryPosition.replace(/_/g, " ")} — `
              : ""}
            {athlete.category}
          </p>
        </div>
      </div>

      {athlete.career?.currentClub && (
        <p className="text-xs text-muted-foreground mb-3">
          {athlete.career.currentClub}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {athlete.visibility.publicProfileEnabled ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600">
              <Eye className="h-3 w-3" /> Público
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <EyeOff className="h-3 w-3" /> Oculto
            </span>
          )}
          {hasPending && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600">
              Pendente
            </span>
          )}
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Athlete Dashboard (existing)
// ---------------------------------------------------------------------------

export default async function AppDashboardPage() {
  const persona = await getCurrentPersona();

  if (persona === "parent_guardian") {
    return <GuardianDashboard />;
  }

  const athlete = await getCurrentAthlete();
  const events = await getPerformanceEventsForAthlete(athlete.id);
  const firstName = athlete.profile.preferredName ?? athlete.profile.firstName;

  const matchCount = events.filter((e) => e.context.sourceType === "match").length;
  const assessmentCount = events.filter(
    (e) => e.context.sourceType === "assessment",
  ).length;
  const isPublic = athlete.visibility.publicProfileEnabled;
  const isDiscoverable = athlete.visibility.discoverable;

  const lastMatch = events
    .filter((e) => e.context.sourceType === "match")
    .sort(
      (a, b) =>
        new Date(b.period.startedAt).getTime() - new Date(a.period.startedAt).getTime(),
    )[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Olá, {firstName}
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Bem-vindo à sua central.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
          Acompanhe seus números, gerencie seu perfil e veja sua evolução.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Partidas
            </span>
            <Trophy className="h-4 w-4 text-primary" />
          </div>
          <p className="text-3xl font-black tracking-tight">{matchCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            registradas na plataforma
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Avaliações
            </span>
            <Activity className="h-4 w-4 text-accent" />
          </div>
          <p className="text-3xl font-black tracking-tight">
            {assessmentCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            físicas e técnicas
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Perfil público
            </span>
            {isPublic ? (
              <Eye className="h-4 w-4 text-green-600" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <p className="text-3xl font-black tracking-tight">
            {isPublic ? "Ativo" : "Oculto"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isDiscoverable
              ? "visível na vitrine"
              : "acesso apenas por link direto"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Última partida
            </span>
            <TrendingUp className="h-4 w-4 text-chart-1" />
          </div>
          <p className="text-3xl font-black tracking-tight">
            {lastMatch
              ? new Date(lastMatch.period.startedAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                })
              : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {lastMatch
              ? (lastMatch.context.competition ?? lastMatch.context.opponent ?? "partida registrada")
              : "nenhuma registrada"}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 mb-8">
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

        <Link
          href="/app/performance"
          className="group rounded-2xl border border-border bg-card p-6 hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Acompanhar
              </p>
              <p className="text-base font-black text-foreground">
                Performance
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Histórico de métricas por partida e avaliação. Gráficos de evolução
            e benchmarks por categoria.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Ver performance
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>

      {/* Footer info */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
