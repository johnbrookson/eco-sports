import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { mockAthletes } from "@/lib/mock/athletes";
import { mockPerformanceEvents } from "@/lib/mock/performance";
import type { Athlete } from "@/types/athlete";
import type { PerformanceEvent } from "@/types/performance";
import { getDataConnectClient } from "./client";
import { getPublicAthleteBySlug, listPublicAthleteSlugs } from "./get-athlete";
import { getPublicPerformanceEventsForAthlete } from "./get-performance";
import { listDirectoryFacets, searchDiscoverableAthletes } from "./search-athletes";
import { canonicalUuid } from "./uuid";

// Leituras públicas contra o emulador, com os dados demo do `npm run seed:data`.
// Além deles, o teste grava num tenant próprio atletas que nunca podem aparecer
// onde não devem: um com perfil privado, um só com link direto e dois que
// liberaram só um tipo de estatística (partidas ou avaliações), cada um com um
// evento de cada tipo.

const TEST_TENANT = "0e5f3c1a-7b2d-4c8e-9f61-3a2b1c0d9e8f";
const PRIVATE = {
  id: "0e5f3c1a-0000-4000-8000-000000000001",
  slug: "teste-perfil-privado",
  position: "test_private_position",
};
const LINK_ONLY = {
  id: "0e5f3c1a-0000-4000-8000-000000000002",
  slug: "teste-so-link-direto",
  position: "test_link_only_position",
};
const MATCH_ONLY = {
  id: "0e5f3c1a-0000-4000-8000-000000000003",
  slug: "teste-so-partidas",
  position: "test_match_only_position",
};
const ASSESSMENT_ONLY = {
  id: "0e5f3c1a-0000-4000-8000-000000000004",
  slug: "teste-so-avaliacoes",
  position: "test_assessment_only_position",
};

function fixtureAthlete(
  f: typeof PRIVATE,
  visibility: {
    publicProfileEnabled: boolean;
    discoverable: boolean;
    showMatchStats?: boolean;
    showAssessmentStats?: boolean;
  },
) {
  return {
    id: f.id,
    tenantId: TEST_TENANT,
    slug: f.slug,
    firstName: "Teste",
    lastName: f.slug,
    birthDate: "2008-01-01",
    gender: "other",
    country: "BR",
    discipline: "basketball",
    primaryPosition: f.position,
    category: "sub-test",
    status: "active",
    showMatchStats: true,
    showAssessmentStats: true,
    ...visibility,
  };
}

function fixtureEvent(n: number, athleteId: string, sourceType: "match" | "assessment") {
  return {
    id: `0e5f3c1a-0000-4000-8000-0000000000e${n}`,
    tenantId: TEST_TENANT,
    athleteId,
    sport: "basketball",
    sourceType,
    startedAt: `2026-01-0${n}T10:00:00Z`,
    endedAt: `2026-01-0${n}T11:00:00Z`,
    metrics: sourceType === "match" ? { points: 10 } : { verticalJumpCm: 50 },
  };
}

async function cleanup() {
  await getDataConnectClient().executeGraphql(
    `mutation ($tenantId: UUID!) {
      performanceEvent_deleteMany(where: { tenantId: { eq: $tenantId } })
      athlete_deleteMany(where: { tenantId: { eq: $tenantId } })
      tenant_delete(id: $tenantId)
    }`,
    { variables: { tenantId: TEST_TENANT } },
  );
}

beforeAll(async () => {
  await cleanup();
  await getDataConnectClient().executeGraphql(
    `mutation ($tenant: Tenant_Data!, $athletes: [Athlete_Data!]!, $events: [PerformanceEvent_Data!]!) {
      tenant_upsert(data: $tenant)
      athlete_upsertMany(data: $athletes)
      performanceEvent_upsertMany(data: $events)
    }`,
    {
      variables: {
        tenant: {
          id: TEST_TENANT,
          type: "individual",
          name: "Tenant de teste",
          country: "BR",
          subscriptionTier: "free",
          subscriptionStatus: "active",
          status: "active",
        },
        athletes: [
          fixtureAthlete(PRIVATE, { publicProfileEnabled: false, discoverable: true }),
          fixtureAthlete(LINK_ONLY, { publicProfileEnabled: true, discoverable: false }),
          fixtureAthlete(MATCH_ONLY, {
            publicProfileEnabled: true,
            discoverable: false,
            showMatchStats: true,
            showAssessmentStats: false,
          }),
          fixtureAthlete(ASSESSMENT_ONLY, {
            publicProfileEnabled: true,
            discoverable: false,
            showMatchStats: false,
            showAssessmentStats: true,
          }),
        ],
        events: [
          fixtureEvent(1, PRIVATE.id, "match"),
          fixtureEvent(2, MATCH_ONLY.id, "match"),
          fixtureEvent(3, MATCH_ONLY.id, "assessment"),
          fixtureEvent(4, ASSESSMENT_ONLY.id, "match"),
          fixtureEvent(5, ASSESSMENT_ONLY.id, "assessment"),
        ],
      },
    },
  );
});

afterAll(cleanup);

// Campos que o perfil público devolve, no formato do mock. O banco não guarda
// consents nem guardians; education, pendingVisibility e os dados físicos
// sensíveis não saem nas leituras públicas. Datas comparadas como instante.
function publicView(a: Athlete) {
  const v = a.visibility;
  return JSON.parse(
    JSON.stringify({
      ...a,
      consents: undefined,
      guardians: undefined,
      education: undefined,
      pendingVisibility: undefined,
      physicalProfile: a.physicalProfile && {
        heightCm: a.physicalProfile.heightCm,
        weightKg: a.physicalProfile.weightKg,
        wingspanCm: a.physicalProfile.wingspanCm,
      },
      visibility: Object.fromEntries(
        Object.entries({
          publicProfileEnabled: v.publicProfileEnabled,
          discoverable: v.discoverable,
          showPhoto: v.showPhoto,
          showAge: v.showAge,
          showCity: v.showCity,
          showPhysicalProfile: v.showPhysicalProfile,
          showHighlightVideos: v.showHighlightVideos,
          showAchievements: v.showAchievements,
          showCurrentClub: v.showCurrentClub,
          showContact: v.showContact,
          showMatchStats: v.showMatchStats,
          showAssessmentStats: v.showAssessmentStats,
        }).map(([k, flag]) => [k, flag ?? false]),
      ),
      createdAt: Date.parse(a.createdAt),
      updatedAt: Date.parse(a.updatedAt),
    }),
  );
}

// Evento no formato do mock, sem os ids que a carga converte (tenant e evento
// viram UUID v5 do id antigo; o do atleta é conferido à parte). Datas
// comparadas como instante.
function eventView(e: PerformanceEvent) {
  return JSON.parse(
    JSON.stringify({
      ...e,
      id: undefined,
      tenantId: undefined,
      athleteId: undefined,
      period: {
        ...e.period,
        startedAt: Date.parse(e.period.startedAt),
        endedAt: Date.parse(e.period.endedAt),
      },
      createdAt: Date.parse(e.createdAt),
    }),
  );
}

describe("canonicalUuid", () => {
  it("põe os hífens no UUID que o Data Connect devolve sem eles", () => {
    expect(canonicalUuid("A7B4C5D81E2F4A3B9C8D0E1F2A3B4C5D")).toBe(
      "a7b4c5d8-1e2f-4a3b-9c8d-0e1f2a3b4c5d",
    );
  });

  it("mantém um UUID que já está no formato canônico", () => {
    expect(canonicalUuid("a7b4c5d8-1e2f-4a3b-9c8d-0e1f2a3b4c5d")).toBe(
      "a7b4c5d8-1e2f-4a3b-9c8d-0e1f2a3b4c5d",
    );
  });

  it("recusa o que não é UUID", () => {
    expect(() => canonicalUuid("tenant-demo-individual")).toThrow();
  });
});

describe("getPublicAthleteBySlug", () => {
  it.each(mockAthletes.map((a) => [a.slug!, a] as const))(
    "%s volta do banco igual ao mock nos campos públicos",
    async (slug, mock) => {
      const athlete = await getPublicAthleteBySlug(slug);
      expect(athlete).not.toBeNull();
      expect(publicView(athlete!)).toEqual(
        publicView({ ...mock, tenantId: athlete!.tenantId }),
      );
    },
  );

  it("devolve null para slug inexistente", async () => {
    expect(await getPublicAthleteBySlug("ninguem-com-este-slug")).toBeNull();
  });

  it("devolve null para perfil privado, mesmo descobrível", async () => {
    expect(await getPublicAthleteBySlug(PRIVATE.slug)).toBeNull();
  });

  it("encontra o perfil só com link direto", async () => {
    const athlete = await getPublicAthleteBySlug(LINK_ONLY.slug);
    expect(athlete?.id).toBe(LINK_ONLY.id);
  });
});

describe("listPublicAthleteSlugs", () => {
  it("lista os perfis publicados e nunca o privado", async () => {
    const slugs = await listPublicAthleteSlugs();
    expect(slugs).toEqual(
      expect.arrayContaining([...mockAthletes.map((a) => a.slug), LINK_ONLY.slug]),
    );
    expect(slugs).not.toContain(PRIVATE.slug);
  });
});

describe("searchDiscoverableAthletes", () => {
  it("só devolve perfis publicados e descobríveis", async () => {
    const results = await searchDiscoverableAthletes();
    const slugs = results.map((a) => a.slug);
    expect(slugs).toEqual(expect.arrayContaining(mockAthletes.map((a) => a.slug)));
    expect(slugs).not.toContain(PRIVATE.slug);
    expect(slugs).not.toContain(LINK_ONLY.slug);
    for (const a of results) {
      expect(a.visibility.publicProfileEnabled).toBe(true);
      expect(a.visibility.discoverable).toBe(true);
    }
  });

  it("filtra por posição e categoria no banco", async () => {
    const guards = await searchDiscoverableAthletes({ position: "point_guard" });
    expect(guards.map((a) => a.slug)).toContain("joao-silva-2008");
    expect(guards.every((a) => a.sport.primaryPosition === "point_guard")).toBe(true);

    const sub17 = await searchDiscoverableAthletes({ category: "sub-17" });
    expect(sub17.length).toBeGreaterThan(0);
    expect(sub17.every((a) => a.category === "sub-17")).toBe(true);
  });

  it("trata filtro vazio como ausente, e não como nulo", async () => {
    const all = await searchDiscoverableAthletes();
    const empty = await searchDiscoverableAthletes({ position: "", category: "" });
    expect(empty.map((a) => a.id)).toEqual(all.map((a) => a.id));
  });

  it("busca por nome e sobrenome juntos, sem diferenciar maiúsculas", async () => {
    const results = await searchDiscoverableAthletes({ q: "Mariana COSTA" });
    expect(results.map((a) => a.slug)).toContain("mariana-costa-2007");
    expect(results.map((a) => a.slug)).not.toContain("joao-silva-2008");
  });

  it("não devolve nada para nome que não existe", async () => {
    expect(await searchDiscoverableAthletes({ q: "zzz-sem-resultado" })).toEqual([]);
  });
});

describe("listDirectoryFacets", () => {
  it("só oferece posições de atletas descobríveis", async () => {
    const { positions, categories } = await listDirectoryFacets();
    expect(positions).toEqual(
      expect.arrayContaining(["point_guard", "power_forward", "small_forward"]),
    );
    expect(positions).not.toContain(PRIVATE.position);
    expect(positions).not.toContain(LINK_ONLY.position);
    expect(categories).not.toContain("sub-test");
    expect(positions).toEqual([...positions].sort());
  });
});

describe("getPublicPerformanceEventsForAthlete", () => {
  it("devolve os eventos que o atleta liberou, iguais aos do mock e mais recentes primeiro", async () => {
    const mariana = mockAthletes.find((a) => a.slug === "mariana-costa-2007")!;
    expect(mariana.visibility.showMatchStats).toBe(true);
    expect(mariana.visibility.showAssessmentStats).toBe(true);

    const events = await getPublicPerformanceEventsForAthlete(mariana.id);
    const expected = mockPerformanceEvents
      .filter((e) => e.athleteId === mariana.id)
      .sort((a, b) => Date.parse(b.period.startedAt) - Date.parse(a.period.startedAt));
    expect(events.map(eventView)).toEqual(expected.map(eventView));
    expect(events.every((e) => e.athleteId === mariana.id)).toBe(true);
  });

  it("não devolve eventos de quem não liberou as estatísticas", async () => {
    const joao = mockAthletes.find((a) => a.slug === "joao-silva-2008")!;
    expect(joao.visibility.showMatchStats).toBe(false);
    expect(await getPublicPerformanceEventsForAthlete(joao.id)).toEqual([]);
  });

  it("não devolve eventos de perfil privado, mesmo com as estatísticas liberadas", async () => {
    expect(await getPublicPerformanceEventsForAthlete(PRIVATE.id)).toEqual([]);
  });

  // Os atletas demo liberaram os dois tipos ou nenhum: só estes distinguem um
  // filtro por tipo de um filtro que olha as duas flags juntas.
  it.each([
    ["partidas", MATCH_ONLY, "match"],
    ["avaliações", ASSESSMENT_ONLY, "assessment"],
  ] as const)("com só %s liberadas, não devolve o outro tipo", async (_, fixture, sourceType) => {
    const events = await getPublicPerformanceEventsForAthlete(fixture.id);
    expect(events.map((e) => e.context.sourceType)).toEqual([sourceType]);
  });
});
