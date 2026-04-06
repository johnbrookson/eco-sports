"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSession, deleteSession } from "./session";
import {
  findMockUserByCredentials,
  findMockUserByEmail,
  addMockUser,
  type MockUser,
} from "./mock-users";
import { PERSONA_COOKIE_NAME } from "./dal";
import {
  addAthlete,
  generateAthleteSlug,
  deriveCategoryFromBirthDate,
} from "@/lib/mock/get-athlete";
import { addGuardianRelationship } from "@/lib/mock/guardian-relationships";
import type { Athlete } from "@/types/athlete";
import type { GuardianRelationship } from "@/types/guardian-relationship";

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

// --- Sign Up ---

const DEMO_TENANT = "tenant-demo-individual";

const SignUpBaseSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: "Sobrenome deve ter pelo menos 2 caracteres." }),
  email: z.string().trim().toLowerCase().email({
    message: "Informe um e-mail válido.",
  }),
  password: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres." }),
  confirmPassword: z.string().min(1, { message: "Confirme sua senha." }),
});

const AthleteSignUpSchema = SignUpBaseSchema.extend({
  role: z.literal("athlete"),
  birthDate: z.string().min(1, { message: "Informe sua data de nascimento." }),
  athleteEmail: z.string().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
}).refine(
  (d) => {
    const birth = new Date(d.birthDate);
    if (isNaN(birth.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 8 && age <= 30;
  },
  {
    message: "Data de nascimento deve indicar idade entre 8 e 30 anos.",
    path: ["birthDate"],
  },
);

const GuardianSignUpSchema = SignUpBaseSchema.extend({
  role: z.literal("parent_guardian"),
  birthDate: z.string().optional(),
  athleteEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Informe o e-mail do atleta que você supervisiona." }),
}).refine((d) => d.password === d.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

export type SignUpFormState =
  | {
      errors?: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        birthDate?: string[];
        athleteEmail?: string[];
        role?: string[];
        form?: string[];
      };
      values?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        role?: string;
        birthDate?: string;
        athleteEmail?: string;
      };
    }
  | undefined;

export async function signUp(
  _prev: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  const role = formData.get("role");
  const rawValues = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    role: String(role ?? ""),
    birthDate: String(formData.get("birthDate") ?? ""),
    athleteEmail: String(formData.get("athleteEmail") ?? ""),
  };

  // Escolher schema pela role
  const schema = role === "parent_guardian" ? GuardianSignUpSchema : AthleteSignUpSchema;

  const parsed = schema.safeParse({
    role: role,
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    birthDate: formData.get("birthDate") ?? undefined,
    athleteEmail: formData.get("athleteEmail") ?? undefined,
  });

  if (!parsed.success) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- union de dois schemas; fieldErrors é shape comum
    const fieldErrors = z.flattenError(parsed.error as z.ZodError<any>).fieldErrors;
    return {
      errors: fieldErrors as SignUpFormState & object extends { errors: infer E } ? E : never,
      values: rawValues,
    };
  }

  const data = parsed.data;

  // Email único
  if (findMockUserByEmail(data.email)) {
    return {
      errors: { email: ["Já existe uma conta com este e-mail."] },
      values: rawValues,
    };
  }

  const userId = `usr-${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date().toISOString();

  if (data.role === "athlete") {
    // Criar Athlete skeleton
    const athleteId = crypto.randomUUID();
    const slug = generateAthleteSlug(
      data.firstName,
      data.lastName,
      data.birthDate,
      DEMO_TENANT,
    );

    const athlete: Athlete = {
      id: athleteId,
      tenantId: DEMO_TENANT,
      slug,
      profile: {
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        gender: "prefer_not_to_say",
        country: "BR",
      },
      sport: { discipline: "basketball" },
      category: deriveCategoryFromBirthDate(data.birthDate),
      status: "prospect",
      consents: {
        termsAccepted: true,
        privacyAccepted: true,
        imageUseAccepted: false,
      },
      visibility: {
        publicProfileEnabled: false,
        discoverable: false,
      },
      createdAt: now,
      updatedAt: now,
    };

    addAthlete(athlete);

    const user: MockUser = {
      id: userId,
      email: data.email,
      password: data.password,
      name: `${data.firstName} ${data.lastName}`,
      roles: ["athlete"],
      specialties: [],
      tenants: [DEMO_TENANT],
      athleteId,
    };

    addMockUser(user);

    await createSession({
      sub: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
      specialties: user.specialties,
      tenants: user.tenants,
    });

    const cookieStore = await cookies();
    cookieStore.set(PERSONA_COOKIE_NAME, "athlete", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: "lax",
      path: "/",
    });

    redirect("/app/perfil?welcome=1");
  }

  // Guardian signup
  const targetUser = findMockUserByEmail(data.athleteEmail!);
  if (!targetUser || !targetUser.athleteId) {
    return {
      errors: {
        athleteEmail: ["Nenhum atleta encontrado com este e-mail."],
      },
      values: rawValues,
    };
  }

  const user: MockUser = {
    id: userId,
    email: data.email,
    password: data.password,
    name: `${data.firstName} ${data.lastName}`,
    roles: ["parent_guardian"],
    specialties: [],
    tenants: [DEMO_TENANT],
    managedAthleteIds: [targetUser.athleteId],
  };

  addMockUser(user);

  const relationship: GuardianRelationship = {
    id: `gr-${userId}-${targetUser.athleteId.slice(0, 8)}`,
    tenantId: DEMO_TENANT,
    athleteId: targetUser.athleteId,
    guardianUserId: userId,
    relationshipType: "other",
    isPrimary: false,
    legallyResponsible: true,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  addGuardianRelationship(relationship);

  await createSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles,
    specialties: user.specialties,
    tenants: user.tenants,
  });

  const cookieStore = await cookies();
  cookieStore.set(PERSONA_COOKIE_NAME, "parent_guardian", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: "lax",
    path: "/",
  });

  redirect("/app?welcome=1");
}
