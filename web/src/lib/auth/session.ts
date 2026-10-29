import "server-only";

import { cookies } from "next/headers";

import { getAdminAuth } from "./firebase";
import { findMockUserById } from "./mock-users";

// Sessão sobre o Firebase Authentication. O cookie guarda o session cookie
// emitido pelo Admin SDK (createSessionCookie), que é verificado a cada
// request. O payload exposto ao resto do app continua OIDC-like (sub, email,
// name, roles, specialties, tenants, iat, exp): identidade vem do Firebase,
// papéis e tenants vêm do mapping do usuário (mock-users hoje, tabelas
// User/OrganizationMembership do Data Connect na Fase 3). Sem custom claims,
// para que mudar um papel não exija renovar o token.

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  specialties: string[];
  tenants: string[];
  iat?: number;
  exp?: number;
}

export const SESSION_COOKIE_NAME = "eco-sports-session";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

// Verifica o session cookie e monta o payload. Retorna null se o cookie for
// inválido/expirado ou se o uid não tiver mapping (ex: usuário criado via
// signup antes de um restart, já que o mapping ainda é in-memory).
export async function decrypt(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(token);
    const user = findMockUserById(decoded.uid);
    if (!user) return null;
    return {
      sub: decoded.uid,
      email: decoded.email ?? user.email,
      name: user.name,
      roles: user.roles,
      specialties: user.specialties,
      tenants: user.tenants,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch {
    return null;
  }
}

// Troca o ID token recém-emitido pelo Firebase por um session cookie HttpOnly.
export async function createSession(idToken: string): Promise<void> {
  const token = await getAdminAuth().createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION_MS,
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + SESSION_DURATION_MS),
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return decrypt(token);
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
