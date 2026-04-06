import { cache } from "react";
import type { Athlete } from "@/types/athlete";
import { mockAthletes } from "./athletes";

// React cache() memoiza dentro da mesma request, permitindo que
// generateMetadata e o componente de página chamem esses helpers
// sem duplicar trabalho. Quando o backend chegar, a implementação
// vira um fetch real — a assinatura permanece.

async function fetchPublicAthleteBySlug(slug: string): Promise<Athlete | null> {
  const athlete = mockAthletes.find((a) => a.slug === slug);
  if (!athlete) return null;
  if (!athlete.visibility.publicProfileEnabled) return null;
  return athlete;
}

async function fetchAthleteById(id: string): Promise<Athlete | null> {
  return mockAthletes.find((a) => a.id === id) ?? null;
}

export const getPublicAthleteBySlug = cache(fetchPublicAthleteBySlug);
export const getAthleteById = cache(fetchAthleteById);

// Unicidade de slug é escopada por tenant (por convenção do schema).
// Exclui o próprio atleta para que manter o slug atual nunca colida.
// Quando o backend real existir, esta função vira uma query com UNIQUE
// constraint no banco; a semântica e assinatura permanecem.
async function checkSlugAvailable(
  slug: string,
  tenantId: string,
  currentAthleteId: string,
): Promise<boolean> {
  return !mockAthletes.some(
    (a) =>
      a.slug === slug &&
      a.tenantId === tenantId &&
      a.id !== currentAthleteId,
  );
}

export const isSlugAvailableForAthlete = cache(checkSlugAvailable);

export async function listPublicAthleteSlugs(): Promise<string[]> {
  return mockAthletes
    .filter((a) => a.visibility.publicProfileEnabled && a.slug)
    .map((a) => a.slug as string);
}

async function fetchAthletesByIds(ids: string[]): Promise<Athlete[]> {
  return mockAthletes.filter((a) => ids.includes(a.id));
}

export const getAthletesByIds = cache(fetchAthletesByIds);

// Derivado de birthDate. Usado para determinar se mudanças de visibilidade
// requerem aprovação do guardian.
export function isMinorAthlete(athlete: Athlete): boolean {
  const birth = new Date(athlete.profile.birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age < 18;
}

// Gera slug a partir do nome + ano de nascimento.
// Transliteração simples: remove acentos, lowercase, troca espaços por hífens.
// Se colidir com slug existente no tenant, appenda sufixo numérico.
export function generateAthleteSlug(
  firstName: string,
  lastName: string,
  birthDate: string,
  tenantId: string,
): string {
  const birthYear = new Date(birthDate).getFullYear();
  const base = `${firstName} ${lastName} ${birthYear}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  let candidate = base;
  let suffix = 2;
  while (mockAthletes.some((a) => a.slug === candidate && a.tenantId === tenantId)) {
    candidate = `${base}-${suffix}`;
    suffix++;
  }
  return candidate;
}

// Deriva categoria de base a partir da idade.
export function deriveCategoryFromBirthDate(birthDate: string): string {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  if (age <= 13) return "sub-13";
  if (age <= 15) return "sub-15";
  if (age <= 17) return "sub-17";
  if (age <= 19) return "sub-19";
  if (age <= 21) return "sub-21";
  return "adulto";
}

// Push de atleta novo no array mock (mutação in-memory para o stub).
export function addAthlete(athlete: Athlete): void {
  mockAthletes.push(athlete);
}

// Mutação in-place para o stub. Retorna o atleta atualizado.
// Não é memoizado — cada chamada deve reexecutar para refletir a última edição.
export function updateAthleteById(
  id: string,
  updater: (current: Athlete) => Athlete,
): Athlete | null {
  const index = mockAthletes.findIndex((a) => a.id === id);
  if (index === -1) return null;
  const updated = updater(mockAthletes[index]);
  updated.updatedAt = new Date().toISOString();
  mockAthletes[index] = updated;
  return updated;
}
