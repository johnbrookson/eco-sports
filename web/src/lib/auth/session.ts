import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Stub de session management — JWT assinado via jose, armazenado num cookie
// HttpOnly. O payload é deliberadamente próximo de OIDC/JWT claims
// (sub, email, name, roles, specialties, tenants, iat, exp) para que a troca
// por Keycloak/Auth.js/Clerk/Auth0/Supabase vire substituir ESTE arquivo
// mais o lib/auth/actions.ts sem mexer em nenhuma tela.

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

function getEncodedKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET não configurado. Defina em web/.env.local (arquivo gitignored).",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getEncodedKey());
}

export async function decrypt(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(input: {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  specialties: string[];
  tenants: string[];
}): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await encrypt(input);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
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
