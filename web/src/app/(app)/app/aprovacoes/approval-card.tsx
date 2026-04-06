"use client";

import { useActionState } from "react";
import {
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  Clock,
} from "lucide-react";

import {
  resolveVisibilityApproval,
  type ApprovalFormState,
} from "@/lib/guardian/actions";

interface ApprovalCardProps {
  athleteId: string;
  athleteName: string;
  photoUrl?: string;
  category: string;
  changes: { flag: string; label: string; desired: boolean }[];
  requestedAt: string;
}

export function ApprovalCard({
  athleteId,
  athleteName,
  photoUrl,
  category,
  changes,
  requestedAt,
}: ApprovalCardProps) {
  const [approveState, approveAction, approvePending] = useActionState(
    resolveVisibilityApproval,
    undefined,
  );
  const [rejectState, rejectAction, rejectPending] = useActionState(
    resolveVisibilityApproval,
    undefined,
  );

  const state = approveState ?? rejectState;
  const isPending = approvePending || rejectPending;

  // Se já resolveu, mostra feedback
  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-5">
        <p className="text-sm font-semibold text-green-700">{state.message}</p>
      </div>
    );
  }

  const initials = athleteName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const requestDate = new Date(requestedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={athleteName}
            className="h-11 w-11 rounded-xl object-cover shrink-0"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm shrink-0">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground">{athleteName}</p>
          <p className="text-xs text-muted-foreground">{category}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <Clock className="h-3 w-3" />
          {requestDate}
        </div>
      </div>

      {/* Mudanças */}
      <div className="space-y-2 mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Alterações solicitadas
        </p>
        {changes.map((c) => (
          <div
            key={c.flag}
            className="flex items-center gap-2 text-sm"
          >
            <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-foreground font-medium">{c.label}</span>
            <span className="text-xs text-muted-foreground">
              {c.desired ? "desligado → ligado" : "ligado → desligado"}
            </span>
          </div>
        ))}
      </div>

      {/* Erro */}
      {state && !state.ok && state.message && (
        <p className="text-xs text-red-600 mb-3">{state.message}</p>
      )}

      {/* Ações */}
      <div className="flex gap-3">
        <form action={approveAction}>
          <input type="hidden" name="athleteId" value={athleteId} />
          <input type="hidden" name="approve" value="true" />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            Aprovar
          </button>
        </form>
        <form action={rejectAction}>
          <input type="hidden" name="athleteId" value={athleteId} />
          <input type="hidden" name="approve" value="false" />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-bold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Rejeitar
          </button>
        </form>
      </div>
    </div>
  );
}
