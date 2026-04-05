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
} from "lucide-react";

import {
  getPublicAthleteBySlug,
  listPublicAthleteSlugs,
} from "@/lib/mock/get-athlete";
import type { Athlete } from "@/types/athlete";

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

