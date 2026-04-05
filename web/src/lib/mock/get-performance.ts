import { cache } from "react";

import type { PerformanceEvent } from "@/types/performance";
import { mockPerformanceEvents } from "./performance";

// Fetchers de histórico de performance. Memoizados por request via
// React cache() — a mesma chamada em Server Component e em Server Action
// durante a mesma request reexecuta apenas uma vez.
// Quando o backend existir, troca pela query real — assinatura mantida.

async function fetchEventsForAthlete(
  athleteId: string,
): Promise<PerformanceEvent[]> {
  return mockPerformanceEvents
    .filter((e) => e.athleteId === athleteId)
    .sort(
      (a, b) =>
        new Date(b.period.startedAt).getTime() -
        new Date(a.period.startedAt).getTime(),
    );
}

export const getPerformanceEventsForAthlete = cache(fetchEventsForAthlete);

// Mutação in-place consistente com o padrão do mockAthletes/saveProfile.
// Usado pelo Server Action addPerformanceEvent.
export function pushPerformanceEvent(event: PerformanceEvent): void {
  mockPerformanceEvents.push(event);
}
