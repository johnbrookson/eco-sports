import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InstagramIcon, LinkedinIcon, Mail, Phone } from "lucide-react";

import { CourtLines } from "@/components/court-lines";
import { LiteYouTube } from "@/components/lite-youtube";
import { ScoutModeButton } from "@/components/scout-mode-button";
import { ScrollReveal } from "@/components/scroll-reveal";

import {
  getPublicAthleteBySlug,
  listPublicAthleteSlugs,
} from "@/lib/mock/get-athlete";
import { getPerformanceEventsForAthlete } from "@/lib/mock/get-performance";
import type { Athlete } from "@/types/athlete";
import type { PerformanceEvent } from "@/types/performance";

// Força geração estática com base nos slugs conhecidos.
// Quando o backend existir, trocar por ISR (revalidate) ou fetch dinâmico.
export async function generateStaticParams() {
  const slugs = await listPublicAthleteSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/atleta/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const athlete = await getPublicAthleteBySlug(slug);
  if (!athlete) {
    return { title: "Perfil não encontrado — basketball.net" };
  }

  const name = formatFullName(athlete);
  const position = formatPosition(athlete.sport.primaryPosition);
  const club = athlete.visibility.showCurrentClub
    ? athlete.career?.currentClub
    : undefined;

  const title = club
    ? `${name} — ${position} · ${club}`
    : `${name} — ${position}`;
  const description =
    athlete.profile.bio ??
    `Perfil de ${name}, ${position.toLowerCase()} da categoria ${athlete.category} em ${athlete.sport.discipline}.`;

  const photo = athlete.visibility.showPhoto
    ? athlete.profile.photoUrl
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: photo ? [{ url: photo, width: 1600, height: 900 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: photo ? [photo] : undefined,
    },
  };
}

export default async function AthleteProfilePage(
  props: PageProps<"/atleta/[slug]">,
) {
  const { slug } = await props.params;
  const athlete = await getPublicAthleteBySlug(slug);
  if (!athlete) notFound();

  const bio = athlete.profile.bio;
  const v = athlete.visibility;

  const fullName = formatFullName(athlete);
  const position = formatPosition(athlete.sport.primaryPosition);
  const age = v.showAge ? computeAge(athlete.profile.birthDate) : undefined;
  const location = v.showCity ? formatLocation(athlete) : undefined;
  const currentClub = v.showCurrentClub ? athlete.career?.currentClub : undefined;
  const physical = v.showPhysicalProfile ? athlete.physicalProfile : undefined;
  const highlightVideos = v.showHighlightVideos
    ? (athlete.media?.highlightVideoUrls ?? [])
    : [];
  const achievements = v.showAchievements
    ? (athlete.career?.achievements ?? [])
    : [];
  const contactItems =
    v.showContact && athlete.contact ? buildContactItems(athlete.contact) : [];

  const showPerformance = v.showMatchStats || v.showAssessmentStats;
  const perfEvents = showPerformance
    ? await getPerformanceEventsForAthlete(athlete.id)
    : [];

  const ctas = [
    { href: "#ficha", label: "Ver ficha", primary: true },
    ...(highlightVideos.length > 0
      ? [{ href: "#videos", label: "Highlights", primary: false }]
      : []),
    ...(contactItems.length > 0
      ? [{ href: "#contato", label: "Contato", primary: false }]
      : []),
  ];

  return (
    <article className="bg-background">
      <HeroSection
        athlete={athlete}
        fullName={fullName}
        position={position}
        age={age}
        location={location}
        currentClub={currentClub}
        physical={physical}
        ctas={ctas}
      />

      <ScoutSheetSection
        athlete={athlete}
        fullName={fullName}
        position={position}
        age={age}
        location={location}
        currentClub={currentClub}
        physical={physical}
      >
        {showPerformance && perfEvents.length > 0 && (
          <PerformanceSection
            events={perfEvents}
            showMatchStats={!!v.showMatchStats}
            showAssessmentStats={!!v.showAssessmentStats}
          />
        )}
      </ScoutSheetSection>

      {highlightVideos.length > 0 && (
        <HighlightsSection videoUrls={highlightVideos} name={fullName} />
      )}

      {bio && <StorySection bio={bio} />}

      {achievements.length > 0 && (
        <AchievementsSection achievements={achievements} />
      )}

      {contactItems.length > 0 && (
        <ContactSection items={contactItems} name={fullName} />
      )}
    </article>
  );
}

// ============================================================
// Sections
// ============================================================

// Visual inspirado no site do EC (enricoceron.com.br): títulos `.display`,
// rótulos `.kicker`, linhas de quadra no hero e a ficha imprimível (Scout
// Mode). Tudo via tokens, então o perfil segue o tema ativo; no tema
// echo-charlie ele fica igual ao site do EC.

function HeroSection({
  athlete,
  fullName,
  position,
  age,
  location,
  currentClub,
  physical,
  ctas,
}: {
  athlete: Athlete;
  fullName: string;
  position: string;
  age?: number;
  location?: string;
  currentClub?: string;
  physical?: Athlete["physicalProfile"];
  ctas: { href: string; label: string; primary: boolean }[];
}) {
  const showPhoto = athlete.visibility.showPhoto && athlete.profile.photoUrl;
  const kicker = [position, athlete.category.toUpperCase(), currentClub]
    .filter(Boolean)
    .join(" · ");

  // Três números grandes no rodapé do hero, só com o que as flags liberam.
  const stats: { value: string; label: string }[] = [];
  if (physical?.heightCm)
    stats.push({ value: formatHeight(physical.heightCm), label: "Altura" });
  if (physical?.wingspanCm)
    stats.push({ value: `${physical.wingspanCm}`, label: "Envergadura (cm)" });
  if (age !== undefined) stats.push({ value: `${age}`, label: "Anos" });
  if (stats.length < 3)
    stats.push({ value: athlete.category.toUpperCase(), label: "Categoria" });

  return (
    <section className="relative isolate flex min-h-svh items-end overflow-hidden bg-profile-surface pt-24 text-white print:hidden">
      {showPhoto && (
        <div className="absolute inset-y-0 right-0 -z-20 w-full md:w-3/5">
          <Image
            src={athlete.profile.photoUrl!}
            alt={fullName}
            fill
            priority
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover object-top opacity-50 md:opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-profile-surface via-profile-surface/40 to-transparent" />
        </div>
      )}

      <CourtLines />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_30%,color-mix(in_oklch,var(--primary)_35%,transparent),transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-profile-surface to-transparent" />

      {/* Categoria em contorno ao fundo (o EC usa o número da camisa, que o
          schema ainda não tem). */}
      <span
        className="display outline-text pointer-events-none absolute -right-4 top-16 -z-10 select-none text-[28vw] leading-none [--outline-text-color:var(--color-white)] md:text-[20vw]"
        aria-hidden
      >
        {athlete.category.toUpperCase()}
      </span>

      <div className="mx-auto w-full max-w-6xl px-6 pb-14 md:pb-20">
        <p className="kicker mb-5">{kicker}</p>
        <h1 className="display text-[19vw] sm:text-[15vw] lg:text-[11rem]">
          <span className="block">{athlete.profile.preferredName ?? athlete.profile.firstName}</span>
          <span className="block text-primary">{athlete.profile.lastName}</span>
        </h1>
        {location && (
          <p className="mt-6 text-lg text-white/70">{location}</p>
        )}

        <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/15 pt-6">
          {stats.slice(0, 3).map((s) => (
            <div key={s.label}>
              <p className="display text-4xl normal-case sm:text-6xl">{s.value}</p>
              <p className="mt-1 text-xs uppercase text-white/60 sm:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {ctas.map((cta) => (
            <a
              key={cta.href}
              href={cta.href}
              className={
                cta.primary
                  ? "rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/85"
                  : "rounded-full border border-white/30 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:border-primary hover:text-primary"
              }
            >
              {cta.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="kicker">{kicker}</p>
      <h2 className="display mt-3 text-5xl text-foreground sm:text-7xl">
        {title}
      </h2>
      {children}
    </div>
  );
}

// Ficha do atleta: é o que o Scout Mode imprime, junto com a performance
// (passada como children) e as conquistas.
function ScoutSheetSection({
  athlete,
  fullName,
  position,
  age,
  location,
  currentClub,
  physical,
  children,
}: {
  athlete: Athlete;
  fullName: string;
  position: string;
  age?: number;
  location?: string;
  currentClub?: string;
  physical?: Athlete["physicalProfile"];
  children?: React.ReactNode;
}) {
  const measures: { label: string; value: string }[] = [];
  if (physical?.heightCm)
    measures.push({ label: "Altura", value: formatHeight(physical.heightCm) });
  if (physical?.wingspanCm)
    measures.push({ label: "Envergadura", value: `${physical.wingspanCm} cm` });
  if (physical?.weightKg)
    measures.push({ label: "Peso", value: `${physical.weightKg} kg` });
  if (
    physical &&
    athlete.sport.dominantSide &&
    athlete.sport.dominantSide !== "not_applicable"
  ) {
    measures.push({
      label: "Lado dominante",
      value: formatDominantSide(athlete.sport.dominantSide),
    });
  }

  const secondary = athlete.sport.secondaryPositions?.map(formatPosition);
  const facts: { label: string; value: string }[] = [
    {
      label: "Posição",
      value: secondary?.length ? `${position} (também ${secondary.join(", ").toLowerCase()})` : position,
    },
    { label: "Categoria", value: athlete.category.toUpperCase() },
    ...(currentClub ? [{ label: "Clube", value: currentClub }] : []),
    ...(age !== undefined ? [{ label: "Idade", value: `${age} anos` }] : []),
    ...(location ? [{ label: "Cidade", value: location }] : []),
  ];

  return (
    <section
      id="ficha"
      className="scroll-mt-4 border-y border-border bg-card py-20 md:py-28 print:border-0 print:py-0"
    >
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeader kicker="Ficha do atleta" title="Ficha técnica">
              <p className="mt-3 text-lg text-muted-foreground">
                {fullName} · {position} · {athlete.category.toUpperCase()}
              </p>
            </SectionHeader>
            <ScoutModeButton />
          </div>
        </ScrollReveal>

        {measures.length > 0 && (
          <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {measures.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-border bg-background/60 p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {m.label}
                </p>
                <p className="display mt-3 text-4xl normal-case text-foreground sm:text-5xl">
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        )}

        <dl
          className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${measures.length > 0 ? "mt-4" : "mt-14"}`}
        >
          {facts.map((f) => (
            <div key={f.label} className="rounded-2xl border border-border p-6">
              <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {f.label}
              </dt>
              <dd className="mt-2 text-lg font-semibold text-foreground">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>

        {children}

        <p className="mt-10 hidden text-sm text-muted-foreground print:block">
          Perfil público em basketball.net · /atleta/{athlete.slug}
        </p>
      </div>
    </section>
  );
}

function HighlightsSection({
  videoUrls,
  name,
}: {
  videoUrls: string[];
  name: string;
}) {
  return (
    <section id="videos" className="scroll-mt-4 bg-background py-20 md:py-28 print:hidden">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <SectionHeader kicker="Vídeos" title="Highlights" />
        </ScrollReveal>
        <div
          className={`mt-10 grid gap-5 ${videoUrls.length > 1 ? "md:grid-cols-2" : ""}`}
        >
          {videoUrls.map((url, i) => {
            const videoId = toYouTubeId(url);
            const title = `${name} — highlight ${i + 1}`;
            return (
              <div
                key={url + i}
                className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-profile-surface"
              >
                {videoId ? (
                  <LiteYouTube videoId={videoId} title={title} />
                ) : (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center font-semibold text-white"
                  >
                    Assistir vídeo →
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StorySection({ bio }: { bio: string }) {
  return (
    <section className="border-y border-border bg-card py-20 md:py-28 print:hidden">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <SectionHeader kicker="Trajetória" title="História" />
          <p className="mt-10 max-w-3xl text-xl font-medium leading-relaxed text-foreground md:text-2xl">
            {bio}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

function AchievementsSection({ achievements }: { achievements: string[] }) {
  return (
    <section className="bg-background py-20 md:py-28 print:py-10">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <SectionHeader kicker="Conquistas" title="Destaques" />
        </ScrollReveal>
        <ol className="mt-10 space-y-4 md:space-y-5">
          {achievements.map((achievement, i) => (
            <li
              key={i}
              className="flex items-baseline gap-6 border-b border-border pb-4 last:border-0 last:pb-0 md:pb-5"
            >
              <span className="display w-12 shrink-0 text-3xl tabular-nums text-primary md:text-4xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-lg font-semibold leading-snug text-foreground md:text-xl">
                {achievement}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---- Performance (public profile) ----

type PerfCardData = {
  label: string;
  value: string;
  delta: number | null;
  baseline: number;
  hint: string;
  lowerIsBetter?: boolean;
  trendName: string;
  digits: number;
};

function PerformanceSection({
  events,
  showMatchStats,
  showAssessmentStats,
}: {
  events: PerformanceEvent[];
  showMatchStats: boolean;
  showAssessmentStats: boolean;
}) {
  const matches = showMatchStats
    ? events.filter((e) => e.context.sourceType === "match")
    : [];
  const assessments = showAssessmentStats
    ? events.filter((e) => e.context.sourceType === "assessment")
    : [];

  if (matches.length === 0 && assessments.length === 0) return null;

  // Match stats — avg of last 5 vs preceding
  const matchChrono = [...matches].reverse(); // oldest first
  const recentM = matchChrono.slice(-5);
  const precedingM = matchChrono.slice(0, Math.max(0, matchChrono.length - 5));
  const hasMatchDelta = precedingM.length >= 2;

  const avgOf = (
    evts: PerformanceEvent[],
    get: (e: PerformanceEvent) => number | undefined,
  ) => {
    const vals = evts.map(get).filter((v): v is number => v != null);
    return vals.length === 0 ? 0 : vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  const matchCards: PerfCardData[] =
    matches.length > 0
      ? (
          [
            { label: "Pontos / jogo", trendName: "pontos", get: (e: PerformanceEvent) => e.metrics.points, digits: 1 },
            { label: "Assistências", trendName: "assistências", get: (e: PerformanceEvent) => e.metrics.assists, digits: 1 },
            { label: "Rebotes", trendName: "rebotes", get: (e: PerformanceEvent) => e.metrics.rebounds, digits: 1 },
            { label: "Minutos", trendName: "minutos", get: (e: PerformanceEvent) => e.metrics.minutesPlayed, digits: 0 },
          ] as const
        ).map(({ get, digits, ...rest }) => {
          const recentAvg = avgOf(recentM, get);
          const precedingAvg = hasMatchDelta ? avgOf(precedingM, get) : 0;
          return {
            ...rest,
            value: formatNum(recentAvg, digits),
            delta: hasMatchDelta ? recentAvg - precedingAvg : null,
            baseline: precedingAvg,
            hint: "últimas 5",
            digits,
          };
        })
      : [];

  // Assessment stats — latest vs previous
  const assessChrono = [...assessments].reverse();
  const latestA = assessChrono.at(-1);
  const prevA = assessChrono.length >= 2 ? assessChrono.at(-2)! : null;

  const assessMetrics: {
    label: string;
    trendName: string;
    get: (e: PerformanceEvent) => number | undefined;
    unit: string;
    digits: number;
    lowerIsBetter?: boolean;
  }[] = [
    { label: "Impulsão vertical", trendName: "impulsão", get: (e) => e.metrics.verticalJumpCm, unit: " cm", digits: 0 },
    { label: "Sprint", trendName: "sprint", get: (e) => e.metrics.sprintSpeedMps, unit: " m/s", digits: 2 },
    { label: "Agilidade", trendName: "agilidade", get: (e) => e.metrics.agilitySeconds, unit: "s", digits: 2, lowerIsBetter: true },
    { label: "Coach rating", trendName: "nota do coach", get: (e) => e.metrics.coachRating, unit: "/10", digits: 1 },
  ];

  const assessmentCards: PerfCardData[] =
    assessments.length > 0 && latestA
      ? assessMetrics
          .map((m): PerfCardData | null => {
            const latestVal = m.get(latestA) ?? null;
            const prevVal = prevA ? (m.get(prevA) ?? null) : null;
            if (latestVal == null) return null;
            return {
              label: m.label,
              trendName: m.trendName,
              value: `${formatNum(latestVal, m.digits)}${m.unit}`,
              delta: prevVal != null ? latestVal - prevVal : null,
              baseline: prevVal ?? 0,
              hint: "última avaliação",
              lowerIsBetter: m.lowerIsBetter,
              digits: m.digits,
            };
          })
          .filter((c): c is PerfCardData => c != null)
      : [];

  // Trend badge — classify each metric's delta
  const allCards = [...matchCards, ...assessmentCards];
  const deltas = allCards
    .filter((c) => c.delta != null && c.trendName !== "minutos")
    .map((c) => {
      const pct = c.baseline !== 0 ? c.delta! / c.baseline : 0;
      const adjusted = c.lowerIsBetter ? -pct : pct;
      const dir: "up" | "down" | "stable" =
        adjusted > 0.05 ? "up" : adjusted < -0.05 ? "down" : "stable";
      return { name: c.trendName, dir };
    });

  const ups = deltas.filter((d) => d.dir === "up");
  const downs = deltas.filter((d) => d.dir === "down");
  const stables = deltas.filter((d) => d.dir === "stable");

  let trendLabel: string;
  let trendColor: string;
  let trendDetail: string | null = null;

  if (deltas.length === 0) {
    const parts: string[] = [];
    if (matches.length > 0)
      parts.push(`${matches.length} ${matches.length === 1 ? "partida" : "partidas"}`);
    if (assessments.length > 0)
      parts.push(`${assessments.length} ${assessments.length === 1 ? "avaliação" : "avaliações"}`);
    trendLabel = `${parts.join(" · ")} na temporada`;
    trendColor = "text-muted-foreground";
  } else if (ups.length > downs.length) {
    trendLabel = "Em evolução";
    trendColor = "text-emerald-500";
    trendDetail = perfTrendDetail(ups, stables, downs);
  } else if (downs.length > ups.length) {
    trendLabel = "Em queda";
    trendColor = "text-red-400";
    trendDetail = perfTrendDetail(ups, stables, downs);
  } else {
    trendLabel = "Desempenho estável";
    trendColor = "text-muted-foreground";
    trendDetail = perfTrendDetail(ups, stables, downs);
  }

  const bothTypes = matchCards.length > 0 && assessmentCards.length > 0;

  // Renderizada dentro da ficha (ScoutSheetSection), então entra no Scout Mode.
  return (
    <div className="mt-16">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Performance na temporada
        </h3>

        <div className="mt-3 mb-8 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm font-semibold">
          <span className={trendColor}>{trendLabel}</span>
          {trendDetail && (
            <span className="text-muted-foreground font-normal">
              · {trendDetail}
            </span>
          )}
        </div>

        {matchCards.length > 0 && (
          <>
            {bothTypes && (
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                Partidas
              </p>
            )}
            <PerfStatsGrid cards={matchCards} />
          </>
        )}

        {assessmentCards.length > 0 && (
          <div className={matchCards.length > 0 ? "mt-10" : ""}>
            {bothTypes && (
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                Avaliações Físicas
              </p>
            )}
            <PerfStatsGrid cards={assessmentCards} />
          </div>
        )}
      </div>
    </div>
  );
}

function PerfStatsGrid({ cards }: { cards: PerfCardData[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <PerfStatCard key={card.label} card={card} />
      ))}
    </div>
  );
}

function PerfStatCard({ card }: { card: PerfCardData }) {
  const { label, value, delta, baseline, hint, lowerIsBetter, digits } = card;

  let deltaStr: string | null = null;
  let colorClass = "text-muted-foreground";

  if (delta != null) {
    const pct = baseline !== 0 ? delta / baseline : 0;
    const adjusted = lowerIsBetter ? -pct : pct;

    if (delta === 0) {
      deltaStr = "→";
    } else {
      const arrow = delta > 0 ? "↑" : "↓";
      deltaStr = `${arrow}\u00A0${formatNum(Math.abs(delta), digits)}`;
    }

    if (adjusted > 0.05) colorClass = "text-emerald-500";
    else if (adjusted < -0.05) colorClass = "text-red-400";
  }

  return (
    <div className="rounded-2xl border border-border bg-background/60 p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="display mt-3 whitespace-nowrap text-3xl normal-case tabular-nums text-foreground lg:text-4xl">
        {value}
      </p>
      <p className="text-sm mt-2 text-muted-foreground">
        {deltaStr && <span className={colorClass}>{deltaStr}</span>}
        {deltaStr && " · "}
        <span>{hint}</span>
      </p>
    </div>
  );
}

function perfTrendDetail(
  ups: { name: string }[],
  stables: { name: string }[],
  downs: { name: string }[],
): string | null {
  const parts: string[] = [];
  if (ups.length > 0)
    parts.push(`${ups.map((u) => u.name).join(" e ")} em alta`);
  if (stables.length > 0) {
    const names = stables.map((s) => s.name).join(" e ");
    parts.push(`${names} ${stables.length === 1 ? "estável" : "estáveis"}`);
  }
  if (downs.length > 0)
    parts.push(`${downs.map((d) => d.name).join(" e ")} em queda`);
  return parts.length > 0 ? parts.join(", ") : null;
}

type ContactItem = {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
};

function buildContactItems(
  contact: NonNullable<Athlete["contact"]>,
): ContactItem[] {
  const items: ContactItem[] = [];
  if (contact.email)
    items.push({
      icon: Mail,
      label: "E-mail",
      value: contact.email,
      href: `mailto:${contact.email}`,
    });
  if (contact.phone)
    items.push({
      icon: Phone,
      label: "Telefone",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
    });
  if (contact.instagram)
    items.push({
      icon: InstagramIcon,
      label: "Instagram",
      value: contact.instagram,
      href: `https://instagram.com/${contact.instagram.replace(/^@/, "")}`,
    });
  if (contact.linkedin)
    items.push({
      icon: LinkedinIcon,
      label: "LinkedIn",
      value: contact.linkedin.replace(/^https?:\/\//, ""),
      href: contact.linkedin,
    });
  return items;
}

function ContactSection({
  items,
  name,
}: {
  items: ContactItem[];
  name: string;
}) {
  return (
    <section
      id="contato"
      className="scroll-mt-4 border-t border-border bg-card py-20 md:py-28 print:hidden"
    >
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <SectionHeader kicker="Contato" title={`Fale com ${name.split(" ")[0]}`} />
        </ScrollReveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-5 rounded-2xl border border-border bg-background/60 p-5 transition-colors hover:border-primary"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="truncate text-base font-bold text-foreground">
                    {item.value}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Formatters
// ============================================================

function formatFullName(athlete: Athlete): string {
  const first = athlete.profile.preferredName ?? athlete.profile.firstName;
  return `${first} ${athlete.profile.lastName}`;
}

function computeAge(birthDate: string): number {
  const b = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}

function formatLocation(athlete: Athlete): string | undefined {
  const { city, state, country } = athlete.profile;
  const parts = [city, state].filter(Boolean);
  if (parts.length === 0) return country;
  return parts.join(", ");
}

function formatNum(n: number, digits: number): string {
  if (Number.isNaN(n)) return "—";
  return n.toFixed(digits).replace(".", ",");
}

function formatHeight(heightCm: number): string {
  const meters = (heightCm / 100).toFixed(2).replace(".", ",");
  return `${meters}m`;
}

function formatPosition(position?: string): string {
  if (!position) return "Atleta";
  const map: Record<string, string> = {
    point_guard: "Armador",
    shooting_guard: "Ala-armador",
    small_forward: "Ala",
    power_forward: "Ala-pivô",
    center: "Pivô",
  };
  return map[position] ?? position;
}

function formatDominantSide(side: NonNullable<Athlete["sport"]["dominantSide"]>): string {
  const map: Record<typeof side, string> = {
    left: "Canhoto",
    right: "Destro",
    ambidextrous: "Ambidestro",
    not_applicable: "—",
  };
  return map[side];
}

function toYouTubeId(url: string): string | undefined {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1) || undefined;
    }
    if (u.hostname.includes("youtube.com")) {
      return u.searchParams.get("v") ?? undefined;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

