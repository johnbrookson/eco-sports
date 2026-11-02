import { describe, expect, it } from "vitest";
import type { OperationOptions } from "firebase-admin/data-connect";
import * as sdk from "@basketball-net/dataconnect";
import {
  athleteByUser,
  discoverableAthletes,
  managedAthletesByGuardian,
  performanceEventsByAthlete,
  publicAthleteBySlug,
  publicAthleteSlugs,
  publicPerformanceEvents,
} from "@basketball-net/dataconnect";

import { mockGuardianRelationships } from "@/lib/mock/guardian-relationships";
import { mockPerformanceEvents } from "@/lib/mock/performance";
import { getDataConnectClient } from "./client";
import { canonicalUuid } from "./uuid";

// Cada operação do conector vira um endpoint na internet, que qualquer um chama
// com a API key do app (pública). Todas são @auth(level: NO_ACCESS): só o
// servidor as executa, pelo Admin SDK. Este arquivo garante isso para todas,
// inclusive as que forem criadas depois, e confere os filtros das leituras da
// área logada contra os dados demo do `npm run seed:data`.

const JOAO_ID = "a7b4c5d8-1e2f-4a3b-9c8d-0e1f2a3b4c5d";
const MARIANA_ID = "b8c5d6e9-2f3a-5b4c-0d9e-1f2a3b4c5d6e";
const ENRICO_ID = "c9d6e7f0-3a4b-6c5d-1e0f-2a3b4c5d6e7f";

const dc = () => getDataConnectClient();

// Uma chamada de exemplo por operação do SDK gerado.
const operations: Record<string, (o?: OperationOptions) => Promise<unknown>> = {
  athleteByUser: (o) => athleteByUser(dc(), { userId: "usr-joao" }, o),
  performanceEventsByAthlete: (o) => performanceEventsByAthlete(dc(), { athleteId: JOAO_ID }, o),
  managedAthletesByGuardian: (o) => managedAthletesByGuardian(dc(), { guardianId: "usr-rodrigo" }, o),
  publicAthleteBySlug: (o) => publicAthleteBySlug(dc(), { slug: "mariana-costa-2007" }, o),
  publicAthleteSlugs: (o) => publicAthleteSlugs(dc(), o),
  discoverableAthletes: (o) => discoverableAthletes(dc(), {}, o),
  publicPerformanceEvents: (o) => publicPerformanceEvents(dc(), { athleteId: MARIANA_ID }, o),
};

describe("acesso direto às operações do conector", () => {
  it("cobre todas as operações do SDK gerado", () => {
    const generated = Object.entries(sdk)
      .filter(([, value]) => typeof value === "function")
      .map(([name]) => name);
    expect(Object.keys(operations).sort()).toEqual(generated.sort());
  });

  it.each(Object.entries(operations))("%s recusa visitante e usuário logado", async (_, run) => {
    await expect(run({ impersonate: { unauthenticated: true } })).rejects.toThrow();
    await expect(run({ impersonate: { authClaims: { sub: "usr-joao" } } })).rejects.toThrow();
  });
});

describe("leituras da área logada", () => {
  it("athleteByUser devolve o atleta do uid recebido", async () => {
    const { data } = await athleteByUser(dc(), { userId: "usr-joao" });
    expect(data.athletes.map((a) => canonicalUuid(a.id))).toEqual([JOAO_ID]);
  });

  it("athleteByUser não devolve nada para quem não é atleta", async () => {
    const { data } = await athleteByUser(dc(), { userId: "usr-rodrigo" });
    expect(data.athletes).toEqual([]);
  });

  it("performanceEventsByAthlete devolve todos os eventos, inclusive os que o perfil público esconde", async () => {
    const { data } = await performanceEventsByAthlete(dc(), { athleteId: JOAO_ID });
    const expected = mockPerformanceEvents.filter((e) => e.athleteId === JOAO_ID);
    expect(data.performanceEvents).toHaveLength(expected.length);
    expect(new Set(data.performanceEvents.map((e) => e.sourceType))).toEqual(
      new Set(expected.map((e) => e.context.sourceType)),
    );
  });

  it("managedAthletesByGuardian devolve os atletas do responsável recebido", async () => {
    const { data } = await managedAthletesByGuardian(dc(), { guardianId: "usr-rodrigo" });
    const mock = mockGuardianRelationships.find((r) => r.guardianUserId === "usr-rodrigo")!;
    expect(
      data.guardianRelationships.map((r) => ({
        athleteId: canonicalUuid(r.athlete.id),
        legallyResponsible: r.legallyResponsible,
      })),
    ).toEqual([{ athleteId: ENRICO_ID, legallyResponsible: mock.legallyResponsible }]);
  });

  it("managedAthletesByGuardian não devolve nada para quem não é responsável", async () => {
    const { data } = await managedAthletesByGuardian(dc(), { guardianId: "usr-joao" });
    expect(data.guardianRelationships).toEqual([]);
  });
});
