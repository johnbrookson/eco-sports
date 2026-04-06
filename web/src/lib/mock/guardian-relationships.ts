import { cache } from "react";
import type { GuardianRelationship } from "@/types/guardian-relationship";

// Mock fixtures para o relacionamento guardian → athlete.
// Segue o mesmo padrão de mutação in-memory dos outros mocks.

export const mockGuardianRelationships: GuardianRelationship[] = [
  {
    id: "gr-rodrigo-enrico",
    tenantId: "tenant-demo-individual",
    athleteId: "c9d6e7f0-3a4b-6c5d-1e0f-2a3b4c5d6e7f", // Enrico
    guardianUserId: "usr-rodrigo",
    relationshipType: "father",
    isPrimary: true,
    legallyResponsible: true,
    status: "active",
    createdAt: "2026-03-01T09:00:00-03:00",
    updatedAt: "2026-03-01T09:00:00-03:00",
  },
];

async function fetchRelationshipsForUser(
  userId: string,
): Promise<GuardianRelationship[]> {
  return mockGuardianRelationships.filter(
    (r) => r.guardianUserId === userId && r.status === "active",
  );
}

async function fetchRelationshipForAthlete(
  userId: string,
  athleteId: string,
): Promise<GuardianRelationship | null> {
  return (
    mockGuardianRelationships.find(
      (r) =>
        r.guardianUserId === userId &&
        r.athleteId === athleteId &&
        r.status === "active",
    ) ?? null
  );
}

export const getGuardianRelationshipsForUser = cache(
  fetchRelationshipsForUser,
);

export const getGuardianRelationshipForAthlete = cache(
  fetchRelationshipForAthlete,
);
