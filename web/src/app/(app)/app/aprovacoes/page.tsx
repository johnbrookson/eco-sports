import {
  ShieldCheck,
  CheckCircle2,
  Users,
} from "lucide-react";

import { getManagedAthletesForCurrentUser } from "@/lib/auth/dal";
import type { Athlete } from "@/types/athlete";
import { ApprovalCard } from "./approval-card";

export const metadata = {
  title: "Aprovações — Eco-Sports",
};

const VISIBILITY_LABELS: Record<string, string> = {
  publicProfileEnabled: "Perfil público",
  discoverable: "Vitrine pública",
  showMatchStats: "Stats de partidas",
  showAssessmentStats: "Stats de avaliações",
};

export default async function AprovacoesPage() {
  const athletes = await getManagedAthletesForCurrentUser();
  const pending = athletes.filter((a) => a.pendingVisibility);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:py-14">
      <header className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Responsável
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Aprovações
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
          Alterações de visibilidade solicitadas pelos seus atletas que precisam
          da sua autorização.
        </p>
      </header>

      {pending.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground mb-1">
            Tudo em dia
          </p>
          <p className="text-xs text-muted-foreground">
            Nenhuma aprovação pendente no momento.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((athlete) => (
            <ApprovalCard
              key={athlete.id}
              athleteId={athlete.id}
              athleteName={`${athlete.profile.firstName} ${athlete.profile.lastName}`}
              photoUrl={athlete.profile.photoUrl}
              category={athlete.category}
              changes={
                athlete.pendingVisibility
                  ? Object.entries(athlete.pendingVisibility.changes).map(
                      ([key, value]) => ({
                        flag: key,
                        label: VISIBILITY_LABELS[key] ?? key,
                        desired: !!value,
                      }),
                    )
                  : []
              }
              requestedAt={athlete.pendingVisibility!.requestedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
