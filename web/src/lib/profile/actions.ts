"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { getCurrentAthlete } from "@/lib/auth/dal";
import {
  isSlugAvailableForAthlete,
  updateAthleteById,
} from "@/lib/mock/get-athlete";
import type { Athlete } from "@/types/athlete";

// Server Action que persiste edições do perfil do atleta.
// Durante o stub, grava in-place no mock (mockAthletes). Troca por DB write
// quando o backend existir — a assinatura e o FormState permanecem.
// A autorização é autoritativa via getCurrentAthlete() do DAL.

// Campos editáveis na v1 (Opção B — só o que o perfil público renderiza).
const ProfileFormSchema = z.object({
  // identidade
  firstName: z.string().trim().min(1, "Informe o primeiro nome."),
  lastName: z.string().trim().min(1, "Informe o sobrenome."),
  preferredName: z.string().trim().optional(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato AAAA-MM-DD."),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  photoUrl: z
    .string()
    .trim()
    .url("Informe uma URL válida (https://...).")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9][a-z0-9-]{2,59}$/,
      "Use apenas letras minúsculas, números e hífens (3-60 caracteres).",
    ),
  bio: z
    .string()
    .trim()
    .max(1000, "Limite de 1000 caracteres.")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  // esporte
  category: z.string().trim().min(1, "Informe a categoria."),
  primaryPosition: z.string().trim().optional(),
  dominantSide: z
    .enum(["left", "right", "ambidextrous", "not_applicable"])
    .optional(),

  // físico
  heightCm: z.coerce.number().min(0).max(260).optional(),
  weightKg: z.coerce.number().min(0).max(200).optional(),
  wingspanCm: z.coerce.number().min(0).max(260).optional(),

  // carreira
  currentClub: z.string().trim().optional(),
  coachName: z.string().trim().optional(),
  achievements: z.string().optional(), // textarea, uma conquista por linha

  // mídia
  highlightVideoUrl: z
    .string()
    .trim()
    .url("Informe uma URL válida de vídeo.")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  // contato
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  phone: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  linkedin: z
    .string()
    .trim()
    .url("Informe uma URL válida (https://...).")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  // visibilidade
  publicProfileEnabled: z.literal("on").optional(),
  discoverable: z.literal("on").optional(),
  showPhoto: z.literal("on").optional(),
  showAge: z.literal("on").optional(),
  showCity: z.literal("on").optional(),
  showPhysicalProfile: z.literal("on").optional(),
  showHighlightVideos: z.literal("on").optional(),
  showAchievements: z.literal("on").optional(),
  showCurrentClub: z.literal("on").optional(),
  showContact: z.literal("on").optional(),
  showMatchStats: z.literal("on").optional(),
  showAssessmentStats: z.literal("on").optional(),
});

export type ProfileFormState =
  | {
      ok?: boolean;
      errors?: Partial<Record<string, string[]>>;
      message?: string;
    }
  | undefined;

function parseAchievements(raw?: string): string[] | undefined {
  if (!raw) return undefined;
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : undefined;
}

function toBool(v: "on" | undefined): boolean {
  return v === "on";
}

export async function saveProfile(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  // Autorização autoritativa — o DAL redireciona para /login se sessão inválida.
  const current = await getCurrentAthlete();

  const raw = Object.fromEntries(formData.entries());
  const parsed = ProfileFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      errors: z.flattenError(parsed.error).fieldErrors,
      message: "Revise os campos marcados.",
    };
  }

  const data = parsed.data;
  const previousSlug = current.slug;

  // Unicidade de slug escopada por tenant. A função exclui o próprio
  // atleta, então manter o slug atual nunca dispara erro.
  const slugAvailable = await isSlugAvailableForAthlete(
    data.slug,
    current.tenantId,
    current.id,
  );
  if (!slugAvailable) {
    return {
      ok: false,
      errors: {
        slug: ["Este slug já está em uso por outro atleta. Escolha outro."],
      },
      message: "Revise os campos marcados.",
    };
  }

  const updated = updateAthleteById(current.id, (existing): Athlete => {
    return {
      ...existing,
      slug: data.slug,
      profile: {
        ...existing.profile,
        firstName: data.firstName,
        lastName: data.lastName,
        preferredName: data.preferredName || undefined,
        birthDate: data.birthDate,
        city: data.city || undefined,
        state: data.state || undefined,
        photoUrl: data.photoUrl,
        bio: data.bio,
      },
      category: data.category,
      sport: {
        ...existing.sport,
        primaryPosition: data.primaryPosition || undefined,
        dominantSide: data.dominantSide ?? existing.sport.dominantSide,
      },
      physicalProfile: {
        ...existing.physicalProfile,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        wingspanCm: data.wingspanCm,
      },
      career: {
        ...existing.career,
        currentClub: data.currentClub || undefined,
        coachName: data.coachName || undefined,
        achievements: parseAchievements(data.achievements),
      },
      media: {
        ...existing.media,
        highlightVideoUrls: data.highlightVideoUrl
          ? [data.highlightVideoUrl]
          : undefined,
      },
      contact: {
        email: data.email,
        phone: data.phone || undefined,
        instagram: data.instagram || undefined,
        linkedin: data.linkedin,
      },
      visibility: {
        publicProfileEnabled: toBool(data.publicProfileEnabled),
        discoverable: toBool(data.discoverable),
        showPhoto: toBool(data.showPhoto),
        showAge: toBool(data.showAge),
        showCity: toBool(data.showCity),
        showPhysicalProfile: toBool(data.showPhysicalProfile),
        showHighlightVideos: toBool(data.showHighlightVideos),
        showAchievements: toBool(data.showAchievements),
        showCurrentClub: toBool(data.showCurrentClub),
        showContact: toBool(data.showContact),
        showMatchStats: toBool(data.showMatchStats),
        showAssessmentStats: toBool(data.showAssessmentStats),
      },
    };
  });

  if (!updated) {
    return {
      ok: false,
      message: "Não foi possível salvar. Tente novamente.",
    };
  }

  // Invalida o cache do perfil público (antigo e novo slug, caso mudem)
  // e da vitrine /atletas, já que a flag discoverable pode ter mudado.
  if (previousSlug) revalidatePath(`/atleta/${previousSlug}`);
  if (updated.slug && updated.slug !== previousSlug) {
    revalidatePath(`/atleta/${updated.slug}`);
  }
  revalidatePath("/app/perfil");
  revalidatePath("/atletas");

  return { ok: true, message: "Perfil atualizado." };
}
