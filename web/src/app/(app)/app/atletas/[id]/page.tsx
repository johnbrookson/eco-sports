import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  Activity,
  Eye,
  EyeOff,
  Clock,
  Ruler,
  Weight,
  GraduationCap,
  MapPin,
} from "lucide-react";

import { requireGuardianOf } from "@/lib/auth/dal";
import { getAthleteById } from "@/lib/mock/get-athlete";
import { getPerformanceEventsForAthlete } from "@/lib/mock/get-performance";
import type { Athlete } from "@/types/athlete";
import type { PerformanceEvent } from "@/types/performance";

export const metadata = {
  title: "Detalhe do Atleta — Eco-Sports",
};

export default async function AthleteDetailPage(
  props: { params: Promise<{ id: string }> },
) {
  const { id } = await props.params;

  // Autorização: redireciona se o user não é guardian deste atleta
  await requireGuardianOf(id);

  const athlete = await getAthleteById(id);
  if (!athlete) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-muted-foreground">Atleta não encontrado.</p>
      </div>
    );
  }

  const events = await getPerformanceEventsForAthlete(athlete.id);
  const fullName = `${athlete.profile.firstName} ${athlete.profile.lastName}`;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:py-14 space-y-10">
      {/* Back link */}
      <Link
        href="/app/atletas"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Meus Atletas
      </Link>

      {/* Hero */}
      <header className="flex items-start gap-5">
        {athlete.profile.photoUrl ? (
          <img
            src={athlete.profile.photoUrl}
            alt={fullName}
            className="h-20 w-20 rounded-2xl object-cover shrink-0"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black text-xl shrink-0">
            {athlete.profile.firstName[0]}
            {athlete.profile.lastName[0]}
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            {fullName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {athlete.sport.primaryPosition?.replace(/_/g, " ") ?? ""} —{" "}
            {athlete.category}
            {athlete.career?.currentClub
              ? ` — ${athlete.career.currentClub}`
              : ""}
          </p>
          {athlete.profile.bio && (
            <p className="text-sm text-muted-foreground mt-3 max-w-xl leading-relaxed">
              {athlete.profile.bio}
            </p>
          )}
        </div>
      </header>

      {/* Info grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {athlete.physicalProfile?.heightCm && (
          <InfoCard
            icon={Ruler}
            label="Altura"
            value={`${athlete.physicalProfile.heightCm} cm`}
          />
        )}
        {athlete.physicalProfile?.weightKg && (
          <InfoCard
            icon={Weight}
            label="Peso"
            value={`${athlete.physicalProfile.weightKg} kg`}
          />
        )}
        {athlete.profile.city && athlete.profile.state && (
          <InfoCard
            icon={MapPin}
            label="Cidade"
            value={`${athlete.profile.city}, ${athlete.profile.state}`}
          />
        )}
        {athlete.education?.schoolName && (
          <InfoCard
            icon={GraduationCap}
            label="Escola"
            value={athlete.education.schoolName}
          />
        )}
      </div>

      {/* Conquistas */}
      {athlete.career?.achievements && athlete.career.achievements.length > 0 && (
        <section>
          <SectionHeader icon={Trophy} label="Conquistas" />
          <ul className="space-y-2 mt-4">
            {athlete.career.achievements.map((a, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-foreground"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                  {i + 1}
                </span>
                {a}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Performance summary */}
      <PerformanceSummary events={events} />

      {/* Visibility status */}
      <VisibilityStatus athlete={athlete} />

      {/* Footer */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border">
        <Clock className="h-3.5 w-3.5" />
        <span>
          Última atualização:{" "}
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

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-3.5 w-3.5 text-primary" />
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </h2>
    </div>
  );
}

function PerformanceSummary({ events }: { events: PerformanceEvent[] }) {
  const matches = events
    .filter((e) => e.context.sourceType === "match")
    .sort(
      (a, b) =>
        new Date(b.period.startedAt).getTime() -
        new Date(a.period.startedAt).getTime(),
    );
  const assessments = events
    .filter((e) => e.context.sourceType === "assessment")
    .sort(
      (a, b) =>
        new Date(b.period.startedAt).getTime() -
        new Date(a.period.startedAt).getTime(),
    );

  const last5 = matches.slice(0, 5);
  const avg = (arr: number[]) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "—";

  const lastAssessment = assessments[0];

  return (
    <section>
      <SectionHeader icon={Activity} label="Performance recente" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
        <StatCard
          label="Partidas"
          value={String(matches.length)}
          sub="registradas"
        />
        <StatCard
          label="Média pts (ult. 5)"
          value={avg(last5.map((e) => e.metrics.points ?? 0))}
          sub="pontos por partida"
        />
        <StatCard
          label="Média ast (ult. 5)"
          value={avg(last5.map((e) => e.metrics.assists ?? 0))}
          sub="assistências por partida"
        />
        <StatCard
          label="Última avaliação"
          value={
            lastAssessment
              ? new Date(lastAssessment.period.startedAt).toLocaleDateString(
                  "pt-BR",
                  { day: "2-digit", month: "short" },
                )
              : "—"
          }
          sub={
            lastAssessment?.metrics.verticalJumpCm
              ? `Impulsão: ${lastAssessment.metrics.verticalJumpCm} cm`
              : "nenhuma registrada"
          }
        />
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <p className="text-2xl font-black tracking-tight mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}

function VisibilityStatus({ athlete }: { athlete: Athlete }) {
  const v = athlete.visibility;
  const pending = athlete.pendingVisibility?.changes;

  const flags: { key: string; label: string; value: boolean | undefined }[] = [
    { key: "publicProfileEnabled", label: "Perfil público", value: v.publicProfileEnabled },
    { key: "discoverable", label: "Vitrine pública", value: v.discoverable },
    { key: "showPhoto", label: "Foto", value: v.showPhoto },
    { key: "showAge", label: "Idade", value: v.showAge },
    { key: "showCity", label: "Cidade", value: v.showCity },
    { key: "showPhysicalProfile", label: "Ficha física", value: v.showPhysicalProfile },
    { key: "showHighlightVideos", label: "Vídeos", value: v.showHighlightVideos },
    { key: "showAchievements", label: "Conquistas", value: v.showAchievements },
    { key: "showCurrentClub", label: "Clube", value: v.showCurrentClub },
    { key: "showContact", label: "Contato", value: v.showContact },
    { key: "showMatchStats", label: "Stats de partidas", value: v.showMatchStats },
    { key: "showAssessmentStats", label: "Stats de avaliações", value: v.showAssessmentStats },
  ];

  return (
    <section>
      <SectionHeader icon={Eye} label="Visibilidade" />
      {pending && (
        <div className="mt-3 rounded-xl border-2 border-amber-500/30 bg-amber-500/5 px-4 py-3">
          <p className="text-xs font-bold text-amber-700">
            Alterações pendentes de aprovação
          </p>
          <ul className="mt-1 space-y-0.5">
            {Object.entries(pending).map(([key, val]) => (
              <li key={key} className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {flags.find((f) => f.key === key)?.label ?? key}
                </span>
                : {val ? "ativar" : "desativar"}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {flags.map((f) => (
          <div
            key={f.key}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5"
          >
            <span className="text-xs text-foreground">{f.label}</span>
            {f.value ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600">
                <Eye className="h-3 w-3" /> On
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <EyeOff className="h-3 w-3" /> Off
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
