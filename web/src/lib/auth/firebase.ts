import "server-only";

import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

// Acesso ao Firebase Authentication pelo servidor.
//
// - Admin SDK: cria usuários, emite e verifica o session cookie. No App
//   Hosting (Cloud Run) usa as credenciais padrão do serviço e o FIREBASE_CONFIG
//   injetado pelo Firebase. Localmente usa o emulador do Auth quando
//   FIREBASE_AUTH_EMULATOR_HOST está definido (ver web/README.md).
// - REST do Identity Toolkit: confere e-mail + senha e devolve o ID token que
//   o Admin SDK troca por session cookie. Assim o login continua sendo uma
//   Server Action com useActionState, sem SDK do Firebase no cliente.

export function getAdminAuth(): Auth {
  const app = getApps()[0] ?? initializeApp();
  return getAuth(app);
}

// A API key do app da Web é pública (vai em qualquer cliente Firebase). O
// next.config.ts a copia do FIREBASE_WEBAPP_CONFIG no build do App Hosting.
function getApiKey(): string {
  const key = process.env.FIREBASE_API_KEY;
  if (key) return key;
  if (process.env.FIREBASE_AUTH_EMULATOR_HOST) return "emulator-api-key";
  throw new Error(
    "FIREBASE_API_KEY não configurada. No App Hosting ela vem do FIREBASE_WEBAPP_CONFIG; localmente, use o emulador do Auth.",
  );
}

function identityToolkitUrl(method: string): string {
  const emulator = process.env.FIREBASE_AUTH_EMULATOR_HOST;
  const base = emulator
    ? `http://${emulator}/identitytoolkit.googleapis.com/v1`
    : "https://identitytoolkit.googleapis.com/v1";
  return `${base}/${method}?key=${encodeURIComponent(getApiKey())}`;
}

export type PasswordSignInResult =
  | { ok: true; uid: string; idToken: string }
  | { ok: false; reason: "invalid-credentials" | "too-many-attempts" | "unavailable" };

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<PasswordSignInResult> {
  let response: Response;
  try {
    response = await fetch(identityToolkitUrl("accounts:signInWithPassword"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, reason: "unavailable" };
  }

  const body = (await response.json().catch(() => ({}))) as {
    localId?: string;
    idToken?: string;
    error?: { message?: string };
  };

  if (response.ok && body.localId && body.idToken) {
    return { ok: true, uid: body.localId, idToken: body.idToken };
  }

  const code = body.error?.message ?? "";
  if (code.startsWith("TOO_MANY_ATTEMPTS_TRY_LATER")) {
    return { ok: false, reason: "too-many-attempts" };
  }
  if (
    code.startsWith("INVALID_LOGIN_CREDENTIALS") ||
    code.startsWith("INVALID_PASSWORD") ||
    code.startsWith("EMAIL_NOT_FOUND") ||
    code.startsWith("USER_DISABLED") ||
    code.startsWith("INVALID_EMAIL")
  ) {
    return { ok: false, reason: "invalid-credentials" };
  }
  console.error("Firebase signInWithPassword falhou:", response.status, code);
  return { ok: false, reason: "unavailable" };
}
