import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";

import { getManagedAthletesForCurrentUser } from "@/lib/auth/dal";
import type { Athlete } from "@/types/athlete";

export const metadata = {
  title: "Meus Atletas — Eco-Sports",
};

export default async function MeusAtletasPage() {
  const athletes = await getManagedAthletesForCurrentUser();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      <header className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Responsável
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Meus Atletas
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
          Atletas sob sua responsabilidade. Clique para ver detalhes do perfil e
          da performance.
        </p>
      </header>

      {athletes.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Nenhum atleta vinculado à sua conta.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {athletes.map((athlete) => (
            <AthleteCard key={athlete.id} athlete={athlete} />
          ))}
        </div>
      )}
    </div>
  );
}

function AthleteCard({ athlete }: { athlete: Athlete }) {
  const fullName = `${athlete.profile.firstName} ${athlete.profile.lastName}`;
  const initials = `${athlete.profile.firstName[0]}${athlete.profile.lastName[0]}`.toUpperCase();
  const hasPending = !!athlete.pendingVisibility;

  const position = athlete.sport.primaryPosition?.replace(/_/g, " ") ?? "";

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
            className="h-14 w-14 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-foreground truncate">{fullName}</p>
          <p className="text-xs text-muted-foreground">
            {position ? `${position} — ` : ""}
            {athlete.category}
          </p>
          {athlete.career?.currentClub && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {athlete.career.currentClub}
            </p>
          )}
        </div>
      </div>

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
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
              Aprovação pendente
            </span>
          )}
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}
