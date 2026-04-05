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

export async function listPublicAthleteSlugs(): Promise<string[]> {
  return mockAthletes
    .filter((a) => a.visibility.publicProfileEnabled && a.slug)
    .map((a) => a.slug as string);
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
