import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { getSession, type SessionPayload } from "./session";
import { findMockUserById, type MockUser } from "./mock-users";
import { getAthleteById } from "@/lib/mock/get-athlete";
import type { Athlete } from "@/types/athlete";

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
    // Sessão válida mas aponta pra usuário inexistente — caso raro (ex:
    // usuário deletado após login). Trata como sessão inválida.
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
