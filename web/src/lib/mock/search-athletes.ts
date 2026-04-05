import { cache } from "react";

import type { Athlete } from "@/types/athlete";
import { mockAthletes } from "./athletes";

// Busca da vitrine pública em /atletas.
// Filtra APENAS por `visibility.discoverable === true && publicProfileEnabled`.
// Ou seja: um atleta com perfil publicado mas não descobrível nunca aparece
// aqui — continua acessível só por link direto.
// Quando o backend chegar, isso vira uma query indexada; a assinatura se
// mantém.

export interface DirectoryQuery {
  q?: string;
  position?: string;
  category?: string;
}

function isDiscoverable(a: Athlete): boolean {
  return Boolean(a.visibility.publicProfileEnabled && a.visibility.discoverable);
}

function matchesQuery(a: Athlete, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const first = a.profile.firstName.toLowerCase();
  const last = a.profile.lastName.toLowerCase();
  const preferred = a.profile.preferredName?.toLowerCase() ?? "";
  const slug = a.slug?.toLowerCase() ?? "";
  return (
    first.includes(needle) ||
    last.includes(needle) ||
    preferred.includes(needle) ||
    `${first} ${last}`.includes(needle) ||
    slug.includes(needle)
  );
}

async function runSearch(
  query: DirectoryQuery = {},
): Promise<Athlete[]> {
  return mockAthletes.filter((a) => {
    if (!isDiscoverable(a)) return false;
    if (query.q && !matchesQuery(a, query.q)) return false;
    if (query.position && a.sport.primaryPosition !== query.position) return false;
    if (query.category && a.category !== query.category) return false;
    return true;
  });
}

export const searchDiscoverableAthletes = cache(runSearch);

// Valores distintos dos atletas descobríveis, para alimentar os selects de
// filtro. Reflete somente o que existe no conjunto discoverable para evitar
// mostrar opções que nunca retornariam resultado.
export const listDirectoryFacets = cache(
  async (): Promise<{ positions: string[]; categories: string[] }> => {
    const discoverable = mockAthletes.filter(isDiscoverable);
    const positions = new Set<string>();
    const categories = new Set<string>();
    for (const a of discoverable) {
      if (a.sport.primaryPosition) positions.add(a.sport.primaryPosition);
      if (a.category) categories.add(a.category);
    }
    return {
      positions: Array.from(positions).sort(),
      categories: Array.from(categories).sort(),
    };
  },
);
