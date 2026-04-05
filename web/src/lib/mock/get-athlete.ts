import { cache } from "react";
import type { Athlete } from "@/types/athlete";
import { mockAthletes, mockAthleteBios } from "./athletes";

// React cache() memoiza dentro da mesma request, permitindo que
// generateMetadata e o componente de página chamem esse helper
// sem duplicar trabalho. Quando o backend chegar, a implementação
// vira um fetch real — a assinatura permanece.

export interface PublicAthleteView {
  athlete: Athlete;
  bio?: string;
}

async function fetchAthleteBySlug(
  slug: string,
): Promise<PublicAthleteView | null> {
  const athlete = mockAthletes.find((a) => a.slug === slug);
  if (!athlete) return null;
  if (!athlete.visibility.publicProfileEnabled) return null;
  return { athlete, bio: mockAthleteBios[slug] };
}

export const getAthleteBySlug = cache(fetchAthleteBySlug);

export async function listPublicAthleteSlugs(): Promise<string[]> {
  return mockAthletes
    .filter((a) => a.visibility.publicProfileEnabled && a.slug)
    .map((a) => a.slug as string);
}
