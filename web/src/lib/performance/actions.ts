"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { getCurrentAthlete } from "@/lib/auth/dal";
import { pushPerformanceEvent } from "@/lib/mock/get-performance";
import type { PerformanceEvent } from "@/types/performance";

// Server Action: registra um novo evento no histórico do atleta logado.
// Escopo v1 (decisão 1B do plano): apenas `match` e `assessment`.
// Autorização autoritativa via DAL — proxy.ts é só a primeira camada.

const MatchEventSchema = z.object({
  sourceType: z.literal("match"),
  startedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Data/hora inválida."),
  durationMinutes: z.coerce
    .number()
    .min(1, "Informe a duração.")
    .max(180, "Máximo de 180 minutos."),
  competition: z.string().trim().optional(),
  opponent: z.string().trim().optional(),
  location: z.string().trim().optional(),
  minutesPlayed: z.coerce.number().min(0).max(120),
  points: z.coerce.number().min(0).max(200),
  assists: z.coerce.number().min(0).max(50),
  rebounds: z.coerce.number().min(0).max(50),
  steals: z.coerce.number().min(0).max(30).optional(),
  blocks: z.coerce.number().min(0).max(30).optional(),
  turnovers: z.coerce.number().min(0).max(30).optional(),
  notes: z.string().trim().max(500).optional(),
});

const AssessmentEventSchema = z.object({
  sourceType: z.literal("assessment"),
  startedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Data/hora inválida."),
  durationMinutes: z.coerce
    .number()
    .min(1, "Informe a duração.")
    .max(300, "Máximo de 300 minutos."),
  location: z.string().trim().optional(),
  verticalJumpCm: z.coerce.number().min(0).max(150).optional(),
  sprintSpeedMps: z.coerce.number().min(0).max(15).optional(),
  agilitySeconds: z.coerce.number().min(0).max(30).optional(),
  enduranceScore: z.coerce.number().min(0).max(10).optional(),
  coachRating: z.coerce.number().min(0).max(10).optional(),
  notes: z.string().trim().max(500).optional(),
});

const CreateEventSchema = z.discriminatedUnion("sourceType", [
  MatchEventSchema,
  AssessmentEventSchema,
]);

export type AddEventFormState =
  | {
      ok?: boolean;
      errors?: Partial<Record<string, string[]>>;
      message?: string;
    }
  | undefined;

function addMinutes(isoLocal: string, minutes: number): string {
  const start = new Date(isoLocal);
  const end = new Date(start.getTime() + minutes * 60_000);
  return end.toISOString();
}

function randomId(): string {
  // UUID-ish sem dependência extra. Só para o stub — backend real usa UUIDv7.
  return (
    "perf-" +
    Math.random().toString(36).slice(2, 10) +
    "-" +
    Date.now().toString(36)
  );
}

export async function addPerformanceEvent(
  _prev: AddEventFormState,
  formData: FormData,
): Promise<AddEventFormState> {
  const athlete = await getCurrentAthlete();

  const raw = Object.fromEntries(formData.entries());
  const parsed = CreateEventSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      errors: z.flattenError(parsed.error).fieldErrors,
      message: "Revise os campos marcados.",
    };
  }

  const data = parsed.data;
  const startedAtIso = new Date(data.startedAt).toISOString();
  const endedAtIso = addMinutes(data.startedAt, data.durationMinutes);
  const createdAt = new Date().toISOString();

  const event: PerformanceEvent =
    data.sourceType === "match"
      ? {
          id: randomId(),
          tenantId: athlete.tenantId,
          athleteId: athlete.id,
          sport: athlete.sport.discipline,
          context: {
            sourceType: "match",
            competition: data.competition || undefined,
            opponent: data.opponent || undefined,
            location: data.location || undefined,
            notes: data.notes || undefined,
          },
          period: {
            startedAt: startedAtIso,
            endedAt: endedAtIso,
          },
          metrics: {
            minutesPlayed: data.minutesPlayed,
            points: data.points,
            assists: data.assists,
            rebounds: data.rebounds,
            steals: data.steals,
            blocks: data.blocks,
            turnovers: data.turnovers,
          },
          createdAt,
        }
      : {
          id: randomId(),
          tenantId: athlete.tenantId,
          athleteId: athlete.id,
          sport: athlete.sport.discipline,
          context: {
            sourceType: "assessment",
            location: data.location || undefined,
            notes: data.notes || undefined,
          },
          period: {
            startedAt: startedAtIso,
            endedAt: endedAtIso,
          },
          metrics: {
            verticalJumpCm: data.verticalJumpCm,
            sprintSpeedMps: data.sprintSpeedMps,
            agilitySeconds: data.agilitySeconds,
            enduranceScore: data.enduranceScore,
            coachRating: data.coachRating,
          },
          createdAt,
        };

  pushPerformanceEvent(event);
  revalidatePath("/app/performance");

  // Se o perfil público expõe performance, revalidar a página do atleta.
  const v = athlete.visibility;
  if ((v.showMatchStats || v.showAssessmentStats) && athlete.slug) {
    revalidatePath(`/atleta/${athlete.slug}`);
  }

  return {
    ok: true,
    message:
      data.sourceType === "match" ? "Partida registrada." : "Avaliação registrada.",
  };
}
