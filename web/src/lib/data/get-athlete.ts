import "server-only";

import { cache } from "react";
import {
  publicAthleteBySlug,
  publicAthleteSlugs,
} from "@basketball-net/dataconnect";

import type { Athlete } from "@/types/athlete";
import { getDataConnectClient } from "./client";
import { toAthlete } from "./mappers";

// Leituras do atleta no banco. Mesmas assinaturas de lib/mock/get-athlete.ts,
// para que as telas troquem só o import. O filtro de publicProfileEnabled
// acontece na operação (dataconnect/connector/public.gql), não aqui.

async function fetchPublicAthleteBySlug(slug: string): Promise<Athlete | null> {
  const { data } = await publicAthleteBySlug(getDataConnectClient(), { slug });
  const row = data.athletes[0];
  return row ? toAthlete(row) : null;
}

export const getPublicAthleteBySlug = cache(fetchPublicAthleteBySlug);

export async function listPublicAthleteSlugs(): Promise<string[]> {
  const { data } = await publicAthleteSlugs(getDataConnectClient());
  return data.athletes.flatMap((a) => (a.slug ? [a.slug] : []));
}
