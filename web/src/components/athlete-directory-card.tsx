import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Athlete } from "@/types/athlete";

// Card minimalista da vitrine pública.
// Exibe apenas um SUBSET dos dados do perfil — mesmo que o atleta tenha ligado
// todas as flags granulares, a listagem não mostra idade exata, cidade, bio,
// contato, métricas ou highlights. O card é um "teaser" — detalhes ficam no
// perfil individual /atleta/[slug], onde as flags granulares aplicam.

const positionMap: Record<string, string> = {
  point_guard: "Armador",
  shooting_guard: "Ala-armador",
  small_forward: "Ala",
  power_forward: "Ala-pivô",
  center: "Pivô",
};

export function AthleteDirectoryCard({ athlete }: { athlete: Athlete }) {
  const v = athlete.visibility;
  const showPhoto = v.showPhoto && athlete.profile.photoUrl;
  const fullName = `${
    athlete.profile.preferredName ?? athlete.profile.firstName
  } ${athlete.profile.lastName}`;
  const position = athlete.sport.primaryPosition
    ? (positionMap[athlete.sport.primaryPosition] ?? athlete.sport.primaryPosition)
    : null;
  const club = v.showCurrentClub ? athlete.career?.currentClub : undefined;

  return (
    <Link
      href={`/atleta/${athlete.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card hover:border-primary transition-colors"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#0b0f1a]">
        {showPhoto ? (
          <Image
            src={athlete.profile.photoUrl!}
            alt={fullName}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl font-black tracking-tight text-white/20">
              {athlete.profile.firstName[0]}
              {athlete.profile.lastName[0]}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
            {athlete.category}
          </span>
        </div>

        <div className="absolute inset-x-4 bottom-4">
          {position && (
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-1">
              {position}
            </p>
          )}
          <p className="text-xl font-black tracking-tight text-white leading-tight">
            {athlete.profile.firstName}
          </p>
          <p className="text-xl font-black tracking-tight text-white leading-tight">
            {athlete.profile.lastName}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="text-xs font-semibold text-muted-foreground truncate">
          {club ?? "Ver perfil completo"}
        </p>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </div>
    </Link>
  );
}
