import "server-only";

// Mapping usuário → domínio (papéis, tenants, atleta, atletas supervisionados).
// Login e senha vivem no Firebase Authentication; o `id` aqui é o uid do
// Firebase. Os usuários demo são criados lá com esse mesmo uid por
// `npm run seed:auth` (web/scripts/seed-demo-users.mjs). Na Fase 3 este
// arquivo dá lugar às tabelas User/OrganizationMembership do Data Connect.

export interface MockUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  specialties: string[];
  tenants: string[];
  athleteId?: string;
  managedAthleteIds?: string[]; // mapping domain para parent_guardian
}

export const mockUsers: MockUser[] = [
  {
    id: "usr-joao",
    email: "joao@demo.basketball.net",
    name: "João Silva",
    roles: ["athlete"],
    specialties: [],
    tenants: ["tenant-demo-individual"],
    athleteId: "a7b4c5d8-1e2f-4a3b-9c8d-0e1f2a3b4c5d",
  },
  {
    id: "usr-mariana",
    email: "mariana@demo.basketball.net",
    name: "Mariana Costa",
    roles: ["athlete"],
    specialties: [],
    tenants: ["tenant-demo-individual"],
    athleteId: "b8c5d6e9-2f3a-5b4c-0d9e-1f2a3b4c5d6e",
  },
  {
    id: "usr-enrico",
    email: "enrico@demo.basketball.net",
    name: "Enrico Ceron",
    roles: ["athlete"],
    specialties: [],
    tenants: ["tenant-demo-individual"],
    athleteId: "c9d6e7f0-3a4b-6c5d-1e0f-2a3b4c5d6e7f",
  },
  {
    id: "usr-rodrigo",
    email: "rodrigo@demo.basketball.net",
    name: "Rodrigo Ceron",
    roles: ["parent_guardian"],
    specialties: [],
    tenants: ["tenant-demo-individual"],
    managedAthleteIds: ["c9d6e7f0-3a4b-6c5d-1e0f-2a3b4c5d6e7f"], // Enrico
  },
];

export function findMockUserById(id: string): MockUser | null {
  return mockUsers.find((u) => u.id === id) ?? null;
}

export function findMockUserByEmail(email: string): MockUser | null {
  return (
    mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) ??
    null
  );
}

export function addMockUser(user: MockUser): void {
  mockUsers.push(user);
}
