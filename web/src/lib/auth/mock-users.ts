import "server-only";

// Mock de usuários para o stub de auth.
// Sem hash de senha — é explicitamente um stub e NÃO deve chegar em produção.
// O payload de sessão (lib/auth/session.ts) segue formato OIDC-like; o mapping
// user → athleteId vive aqui (não no JWT) para manter os claims puros e
// permitir troca de provider sem mexer no DAL.

export interface MockUser {
  id: string;
  email: string;
  password: string; // stub apenas; troca por auth real elimina este campo
  name: string;
  roles: string[];
  specialties: string[];
  tenants: string[];
  athleteId?: string;
}

export const mockUsers: MockUser[] = [
  {
    id: "usr-joao",
    email: "joao@demo.ecosports.app",
    password: "joao123",
    name: "João Silva",
    roles: ["athlete"],
    specialties: [],
    tenants: ["tenant-demo-individual"],
    athleteId: "a7b4c5d8-1e2f-4a3b-9c8d-0e1f2a3b4c5d",
  },
  {
    id: "usr-mariana",
    email: "mariana@demo.ecosports.app",
    password: "mariana123",
    name: "Mariana Costa",
    roles: ["athlete"],
    specialties: [],
    tenants: ["tenant-demo-individual"],
    athleteId: "b8c5d6e9-2f3a-5b4c-0d9e-1f2a3b4c5d6e",
  },
];

export function findMockUserByCredentials(
  email: string,
  password: string,
): MockUser | null {
  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
  if (!user) return null;
  if (user.password !== password) return null;
  return user;
}

export function findMockUserById(id: string): MockUser | null {
  return mockUsers.find((u) => u.id === id) ?? null;
}
