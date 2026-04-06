"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSession, deleteSession } from "./session";
import { findMockUserByCredentials } from "./mock-users";
import { PERSONA_COOKIE_NAME } from "./dal";

// Server Actions do stub de auth.
// Quando trocarmos por um provider real (Keycloak/Auth.js/Clerk/Auth0),
// apenas o corpo dessas funções muda — a assinatura e o shape de FormState
// permanecem, então nenhuma tela precisa ser alterada.

const SignInSchema = z.object({
  email: z.string().trim().toLowerCase().email({
    message: "Informe um e-mail válido.",
  }),
  password: z.string().min(1, { message: "Informe sua senha." }),
});

export type SignInFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
        form?: string[];
      };
      values?: {
        email?: string;
      };
    }
  | undefined;

export async function signIn(
  _prev: SignInFormState,
  formData: FormData,
): Promise<SignInFormState> {
  const parsed = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
      values: { email: String(formData.get("email") ?? "") },
    };
  }

  const user = findMockUserByCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    return {
      errors: { form: ["E-mail ou senha inválidos."] },
      values: { email: parsed.data.email },
    };
  }

  await createSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles,
    specialties: user.specialties,
    tenants: user.tenants,
  });

  // Setar cookie de persona com o primeiro role do user.
  // Não é HttpOnly — o persona switcher (client component) precisa ler.
  const cookieStore = await cookies();
  cookieStore.set(PERSONA_COOKIE_NAME, user.roles[0], {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: "lax",
    path: "/",
  });

  // Dashboard role-aware — funciona pra athlete e parent_guardian.
  redirect("/app");
}

export async function signOut(): Promise<void> {
  await deleteSession();
  const cookieStore = await cookies();
  cookieStore.delete(PERSONA_COOKIE_NAME);
  redirect("/login");
}
