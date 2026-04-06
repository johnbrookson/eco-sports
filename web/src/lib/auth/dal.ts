import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSession, type SessionPayload } from "./session";
import { findMockUserById, type MockUser } from "./mock-users";
import { getAthleteById, getAthletesByIds } from "@/lib/mock/get-athlete";
import { getGuardianRelationshipForAthlete } from "@/lib/mock/guardian-relationships";
import type { Athlete } from "@/types/athlete";
import type { GuardianRelationship } from "@/types/guardian-relationship";

// Data Access Layer — camada autoritativa de autorização.
// O proxy.ts é só a primeira linha (optimistic check). Cada Server Function,
// Server Component e Server Action que lê dado sensível DEVE passar pelo DAL.
// Todas as funções são memoizadas por request via React cache().

export const verifySession = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();
  if (!session?.sub) {
    redirect("/login");
  }
  return session;
});

export const getCurrentUser = cache(async (): Promise<MockUser> => {
  const session = await verifySession();
  const user = findMockUserById(session.sub);
  if (!user) {
    // Sessão válida mas aponta pra usuário inexistente (ex: dev server
    // reiniciou e perdeu users criados via signup in-memory).
    // O proxy limpa o cookie stale pra evitar redirect loop.
    redirect("/login");
  }
  return user;
});

export const getCurrentAthlete = cache(async (): Promise<Athlete> => {
  const user = await getCurrentUser();
  if (!user.athleteId) {
    // Usuário autenticado que não é atleta (professional, sponsor, etc).
    // Por enquanto o stub só tem personas `athlete`; quando outras entrarem,
    // esse caminho vira um redirect pra tela da persona correspondente.
    redirect("/app/em-construcao?persona=nao-atleta");
  }
  const athlete = await getAthleteById(user.athleteId);
  if (!athlete) {
    throw new Error(
      `Usuário ${user.id} aponta para atleta inexistente ${user.athleteId}`,
    );
  }
  return athlete;
});

// Helper seguro para telas públicas/condicionais que querem saber se há sessão
// mas NÃO querem fazer redirect. Não substitui verifySession em código que
// precisa garantir autenticação.
export const getOptionalSession = cache(
  async (): Promise<SessionPayload | null> => {
    return getSession();
  },
);

// --- Persona switcher ---

export const PERSONA_COOKIE_NAME = "eco-sports-persona";

// Lê o role ativo do cookie de persona. Valida que o cookie contém um role
// que o user realmente possui; se não, faz fallback pro primeiro role.
export const getCurrentPersona = cache(async (): Promise<string> => {
  const session = await verifySession();
  const cookieStore = await cookies();
  const personaCookie = cookieStore.get(PERSONA_COOKIE_NAME)?.value;
  if (personaCookie && session.roles.includes(personaCookie)) {
    return personaCookie;
  }
  return session.roles[0];
});

// --- Guardian ---

// Retorna os atletas supervisionados pelo guardian autenticado.
// Para users sem managedAthleteIds (ex: athlete), retorna array vazio.
export const getManagedAthletesForCurrentUser = cache(
  async (): Promise<Athlete[]> => {
    const user = await getCurrentUser();
    if (!user.managedAthleteIds?.length) return [];
    return getAthletesByIds(user.managedAthleteIds);
  },
);

// Verifica que o user autenticado é guardian do atleta indicado.
// Redireciona para /app se não tiver relação ativa. Retorna o
// GuardianRelationship completo para checar legallyResponsible etc.
export const requireGuardianOf = cache(
  async (athleteId: string): Promise<GuardianRelationship> => {
    const user = await getCurrentUser();
    if (!user.roles.includes("parent_guardian")) {
      redirect("/app");
    }
    const relationship = await getGuardianRelationshipForAthlete(
      user.id,
      athleteId,
    );
    if (!relationship) {
      redirect("/app");
    }
    return relationship;
  },
);
