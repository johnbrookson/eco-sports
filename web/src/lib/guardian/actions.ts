"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { requireGuardianOf } from "@/lib/auth/dal";
import { getAthleteById, updateAthleteById } from "@/lib/mock/get-athlete";
import type { Athlete } from "@/types/athlete";

// Server Action para o guardian aprovar ou rejeitar mudanças de
// visibilidade pendentes de um atleta menor. Autorização autoritativa
// via requireGuardianOf() do DAL.

const ApprovalSchema = z.object({
  athleteId: z.string().min(1),
  approve: z.enum(["true", "false"]),
});

export type ApprovalFormState =
  | { ok?: boolean; message?: string }
  | undefined;

export async function resolveVisibilityApproval(
  _prev: ApprovalFormState,
  formData: FormData,
): Promise<ApprovalFormState> {
  const parsed = ApprovalSchema.safeParse({
    athleteId: formData.get("athleteId"),
    approve: formData.get("approve"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Dados inválidos." };
  }

  const { athleteId, approve } = parsed.data;
  const isApproval = approve === "true";

  // Autorização: redireciona se o user não é guardian deste atleta
  const relationship = await requireGuardianOf(athleteId);

  if (!relationship.legallyResponsible) {
    return {
      ok: false,
      message:
        "Apenas responsáveis legais podem aprovar alterações de visibilidade.",
    };
  }

  const athlete = await getAthleteById(athleteId);
  if (!athlete?.pendingVisibility) {
    return { ok: false, message: "Nenhuma alteração pendente." };
  }

  const updated = updateAthleteById(athleteId, (existing): Athlete => {
    if (isApproval && existing.pendingVisibility) {
      // Merge das mudanças aprovadas no visibility
      return {
        ...existing,
        visibility: {
          ...existing.visibility,
          ...existing.pendingVisibility.changes,
        },
        pendingVisibility: undefined,
      };
    }
    // Rejeição: apenas limpa o pendingVisibility
    return {
      ...existing,
      pendingVisibility: undefined,
    };
  });

  if (!updated) {
    return { ok: false, message: "Erro ao processar. Tente novamente." };
  }

  // Invalida caches das páginas afetadas
  revalidatePath("/app/aprovacoes");
  revalidatePath(`/app/atletas/${athleteId}`);
  revalidatePath("/app");
  if (updated.slug) revalidatePath(`/atleta/${updated.slug}`);
  revalidatePath("/atletas");

  return {
    ok: true,
    message: isApproval
      ? "Alterações aprovadas."
      : "Alterações rejeitadas.",
  };
}
