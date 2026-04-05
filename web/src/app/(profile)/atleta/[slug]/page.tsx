import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  MapPin,
  InstagramIcon,
  LinkedinIcon,
  Mail,
  Phone,
  PlayCircle,
  Trophy,
  TrendingUp,
} from "lucide-react";

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
    return { title: "Perfil não encontrado — Eco-Sports" };
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
  const highlightVideo =
    v.showHighlightVideos && athlete.media?.highlightVideoUrls?.[0]
      ? athlete.media.highlightVideoUrls[0]
      : undefined;

  const showPerformance = v.showMatchStats || v.showAssessmentStats;
  const perfEvents = showPerformance
    ? await getPerformanceEventsForAthlete(athlete.id)
    : [];

  return (
    <article className="bg-background">
      <HeroSection
        athlete={athlete}
        fullName={fullName}
        position={position}
        age={age}
        location={location}
        currentClub={currentClub}
      />

      {bio && <BioSection bio={bio} />}

      {highlightVideo && <HighlightVideoSection videoUrl={highlightVideo} />}

      {v.showPhysicalProfile && athlete.physicalProfile && (
        <PhysicalStatsSection athlete={athlete} />
      )}

      {v.showAchievements && athlete.career?.achievements && athlete.career.achievements.length > 0 && (
        <AchievementsSection achievements={athlete.career.achievements} />
      )}

      {showPerformance && perfEvents.length > 0 && (
        <PerformanceSection
          events={perfEvents}
          showMatchStats={!!v.showMatchStats}
          showAssessmentStats={!!v.showAssessmentStats}
        />
      )}

      {v.showContact && athlete.contact && (
        <ContactSection contact={athlete.contact} name={fullName} />
      )}
    </article>
  );
}

// ============================================================
// Sections
// ============================================================

function HeroSection({
  athlete,
  fullName,
  position,
  age,
  location,
  currentClub,
}: {
  athlete: Athlete;
  fullName: string;
  position: string;
  age?: number;
  location?: string;
  currentClub?: string;
}) {
  const showPhoto = athlete.visibility.showPhoto && athlete.profile.photoUrl;

  return (
    <section className="relative isolate overflow-hidden bg-profile-surface text-white">
      {showPhoto && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={athlete.profile.photoUrl!}
            alt={fullName}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-profile-surface" />
          <div className="absolute inset-0 bg-gradient-to-r from-profile-surface via-transparent to-transparent" />
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="flex flex-col gap-5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {formatDiscipline(athlete.sport.discipline)}
            </span>
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 backdrop-blur-sm">
              {athlete.category.toUpperCase()}
            </span>
            {currentClub && (
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 backdrop-blur-sm">
                {currentClub}
              </span>
            )}
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
            <span className="block text-white">{athlete.profile.firstName}</span>
            <span className="block text-primary">
              {athlete.profile.lastName}
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base font-semibold text-white/80">
            <span className="text-primary uppercase tracking-wider text-sm font-bold">
              {position}
            </span>
            {age !== undefined && (
              <>
                <Dot />
                <span>{age} anos</span>
              </>
            )}
            {location && (
              <>
                <Dot />
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function BioSection({ bio }: { bio: string }) {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-6">
          Perfil
        </p>
        <p className="text-xl md:text-2xl leading-relaxed font-medium text-foreground">
          {bio}
        </p>
      </div>
    </section>
  );
}

function HighlightVideoSection({ videoUrl }: { videoUrl: string }) {
  const embedUrl = toYouTubeEmbed(videoUrl);
  return (
    <section className="bg-card border-y border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="flex items-center gap-3 mb-8">
          <PlayCircle className="h-5 w-5 text-primary" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Highlights
          </p>
        </div>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-border">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="Highlight video"
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center text-white"
            >
              Assistir vídeo →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function PhysicalStatsSection({ athlete }: { athlete: Athlete }) {
  const phys = athlete.physicalProfile!;
  const stats: { label: string; value: string }[] = [];
  if (phys.heightCm) stats.push({ label: "Altura", value: formatHeight(phys.heightCm) });
  if (phys.weightKg) stats.push({ label: "Peso", value: `${phys.weightKg} kg` });
  if (phys.wingspanCm) stats.push({ label: "Envergadura", value: `${phys.wingspanCm} cm` });
  if (athlete.sport.dominantSide && athlete.sport.dominantSide !== "not_applicable") {
    stats.push({
      label: "Lado dominante",
      value: formatDominantSide(athlete.sport.dominantSide),
    });
  }

  if (stats.length === 0) return null;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-10">
          Ficha Física
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden ring-1 ring-border">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card px-6 py-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                {stat.label}
              </p>
              <p className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AchievementsSection({ achievements }: { achievements: string[] }) {
  return (
    <section className="bg-card border-y border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="flex items-center gap-3 mb-10">
          <Trophy className="h-5 w-5 text-primary" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Conquistas
          </p>
        </div>
        <ul className="space-y-4 md:space-y-5">
          {achievements.map((achievement, i) => (
            <li
              key={i}
              className="flex items-start gap-6 border-b border-border pb-4 md:pb-5 last:border-0 last:pb-0"
            >
              <span className="text-primary font-black text-xl md:text-2xl tabular-nums tracking-tight shrink-0 w-10">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-lg md:text-xl font-semibold text-foreground leading-snug">
                {achievement}
              </span>
            </li>
          ))}
        </ul>
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

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Performance
          </p>
        </div>

        <div className="mb-10 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm font-semibold">
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
    </section>
  );
}

function PerfStatsGrid({ cards }: { cards: PerfCardData[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden ring-1 ring-border">
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
    <div className="bg-card px-6 py-10">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">
        {label}
      </p>
      <p className="text-4xl md:text-5xl font-black tracking-tight text-foreground tabular-nums">
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

function ContactSection({
  contact,
  name,
}: {
  contact: NonNullable<Athlete["contact"]>;
  name: string;
}) {
  const items: { icon: typeof Mail; label: string; value: string; href: string }[] = [];
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

  if (items.length === 0) return null;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
          Contato
        </p>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-10 max-w-2xl">
          Interessado em conhecer melhor {name.split(" ")[0]}?
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-5 hover:border-primary transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-base font-bold text-foreground truncate">
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
// Atoms
// ============================================================

function Dot() {
  return <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden />;
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

function formatDiscipline(discipline: string): string {
  const map: Record<string, string> = {
    basketball: "Basquete",
    soccer: "Futebol",
    volleyball: "Vôlei",
  };
  return map[discipline] ?? discipline;
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

function toYouTubeEmbed(url: string): string | undefined {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : undefined;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : undefined;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

