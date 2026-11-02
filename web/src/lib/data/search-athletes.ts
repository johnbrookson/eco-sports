import "server-only";

import { cache } from "react";
import { discoverableAthletes } from "@basketball-net/dataconnect";

import type { Athlete } from "@/types/athlete";
import { getDataConnectClient } from "./client";
import { toAthlete } from "./mappers";

// Vitrine pública em /atletas. Mesmas assinaturas de lib/mock/search-athletes.ts.
//
// O banco filtra visibilidade (publicProfileEnabled && discoverable), posição e
// categoria. A busca textual roda aqui, sobre esse conjunto: a vitrine ainda é
// pequena, e assim "joão silva" casa com nome + sobrenome como no mock.

export interface DirectoryQuery {
  q?: string;
  position?: string;
  category?: string;
}

// Filtro vazio é omitido, e não enviado como null: no Data Connect uma
// variável null vira "campo IS NULL" e a vitrine voltaria vazia.
// Argumentos posicionais (e não um objeto) para o cache() reaproveitar a
// mesma consulta entre a busca sem filtros e as facetas.
const loadDiscoverable = cache(
  async (position: string | undefined, category: string | undefined) => {
    const { data } = await discoverableAthletes(getDataConnectClient(), {
      ...(position ? { position } : {}),
      ...(category ? { category } : {}),
    });
    return data.athletes.map(toAthlete);
  },
);

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

async function runSearch(query: DirectoryQuery = {}): Promise<Athlete[]> {
  const athletes = await loadDiscoverable(query.position, query.category);
  return query.q ? athletes.filter((a) => matchesQuery(a, query.q!)) : athletes;
}

export const searchDiscoverableAthletes = cache(runSearch);

// Valores distintos dos atletas descobríveis, para os selects de filtro.
export const listDirectoryFacets = cache(
  async (): Promise<{ positions: string[]; categories: string[] }> => {
    const discoverable = await loadDiscoverable(undefined, undefined);
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
