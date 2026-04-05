"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { createSession, deleteSession } from "./session";
import { findMockUserByCredentials } from "./mock-users";

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

  // Redirect dispara dentro do Server Action — quem chamou não precisa tratar.
  redirect("/app/perfil");
}

export async function signOut(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
