import "server-only";

import { cache } from "react";
import { publicPerformanceEvents } from "@basketball-net/dataconnect";

import type { PerformanceEvent } from "@/types/performance";
import { getDataConnectClient } from "./client";
import { toPerformanceEvent } from "./mappers";

// Histórico de performance no banco, mais recente primeiro.

// Perfil público: o banco só devolve eventos de perfil publicado e dos tipos
// que o atleta liberou (showMatchStats / showAssessmentStats). Uma lista vazia
// significa "nada a mostrar", não "atleta sem eventos".
async function fetchPublicEventsForAthlete(
  athleteId: string,
): Promise<PerformanceEvent[]> {
  const { data } = await publicPerformanceEvents(getDataConnectClient(), {
    athleteId,
  });
  return data.performanceEvents.map(toPerformanceEvent);
}

export const getPublicPerformanceEventsForAthlete = cache(
  fetchPublicEventsForAthlete,
);
