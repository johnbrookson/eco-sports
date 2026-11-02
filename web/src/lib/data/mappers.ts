import type {
  DiscoverableAthletesData,
  PublicAthleteBySlugData,
  PublicPerformanceEventsData,
} from "@basketball-net/dataconnect";

import type {
  Athlete,
  AthleteCareer,
  AthleteMedia,
} from "@/types/athlete";
import type {
  PerformanceContext,
  PerformanceEvent,
  PerformanceMetricValues,
} from "@/types/performance";
import { canonicalUuid } from "./uuid";

// Converte as linhas do banco nos tipos do app (alinhados aos JSON Schemas).
// O banco guarda o atleta "achatado" em colunas; o app usa os blocos aninhados
// (profile, contact, sport...). Colunas nulas viram campos ausentes, como nos
// mocks, e um bloco sem nenhum campo vira `undefined`.

type PublicAthleteRow = PublicAthleteBySlugData["athletes"][number];
type DirectoryAthleteRow = DiscoverableAthletesData["athletes"][number];

// Cada operação seleciona um subconjunto das colunas; o da vitrine é o menor.
export type AthleteRow = DirectoryAthleteRow & Partial<PublicAthleteRow>;

function opt<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined;
}

function compact<T extends object>(block: T): T | undefined {
  const entries = Object.entries(block).filter(([, v]) => v != null);
  return entries.length ? (Object.fromEntries(entries) as T) : undefined;
}

export function toAthlete(row: AthleteRow): Athlete {
  return {
    id: canonicalUuid(row.id),
    tenantId: canonicalUuid(row.tenantId),
    slug: opt(row.slug),
    profile: {
      firstName: row.firstName,
      lastName: row.lastName,
      preferredName: opt(row.preferredName),
      birthDate: row.birthDate,
      gender: row.gender,
      country: row.country,
      state: opt(row.state),
      city: opt(row.city),
      nationality: opt(row.nationality),
      photoUrl: opt(row.photoUrl),
      bio: opt(row.bio),
    },
    contact: compact({
      email: opt(row.contactEmail),
      phone: opt(row.contactPhone),
      instagram: opt(row.contactInstagram),
      linkedin: opt(row.contactLinkedin),
    }),
    sport: {
      discipline: row.discipline,
      primaryPosition: opt(row.primaryPosition),
      secondaryPositions: opt(row.secondaryPositions),
      dominantSide: opt(row.dominantSide),
    },
    physicalProfile: compact({
      heightCm: opt(row.heightCm),
      weightKg: opt(row.weightKg),
      wingspanCm: opt(row.wingspanCm),
    }),
    category: row.category,
    career: opt(row.career) as AthleteCareer | undefined,
    media: opt(row.media) as AthleteMedia | undefined,
    status: row.status,
    visibility: {
      publicProfileEnabled: row.publicProfileEnabled,
      discoverable: row.discoverable,
      showPhoto: row.showPhoto,
      showAge: row.showAge,
      showCity: row.showCity,
      showPhysicalProfile: row.showPhysicalProfile,
      showHighlightVideos: row.showHighlightVideos,
      showAchievements: row.showAchievements,
      showCurrentClub: row.showCurrentClub,
      showContact: row.showContact,
      showMatchStats: row.showMatchStats,
      showAssessmentStats: row.showAssessmentStats,
    },
    tags: opt(row.tags),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

type PerformanceEventRow =
  PublicPerformanceEventsData["performanceEvents"][number];

// No banco o tipo do evento é coluna própria (filtro); no app ele mora dentro
// de `context`.
export function toPerformanceEvent(row: PerformanceEventRow): PerformanceEvent {
  const context = (row.context ?? {}) as Omit<PerformanceContext, "sourceType">;
  return {
    id: canonicalUuid(row.id),
    tenantId: canonicalUuid(row.tenantId),
    athleteId: canonicalUuid(row.athleteId),
    sport: row.sport,
    context: { ...context, sourceType: row.sourceType },
    period: {
      startedAt: row.startedAt,
      endedAt: row.endedAt,
      season: opt(row.season),
      cycle: opt(row.cycle),
    },
    metrics: row.metrics as PerformanceMetricValues,
    createdAt: row.createdAt,
  };
}
