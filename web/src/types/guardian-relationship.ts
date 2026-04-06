// fonte: schemas/guardian-relationship.json
// Mantenha alinhado com o JSON Schema em `schemas/guardian-relationship.json`.
// Futuro: gerar automaticamente via json-schema-to-typescript.

export type GuardianRelationshipType =
  | "mother"
  | "father"
  | "stepmother"
  | "stepfather"
  | "grandparent"
  | "sibling_adult"
  | "legal_guardian"
  | "foster_parent"
  | "other";

export type GuardianRelationshipStatus =
  | "pending_verification"
  | "active"
  | "revoked"
  | "expired";

export interface ProofDocument {
  type:
    | "birth_certificate"
    | "legal_guardianship"
    | "power_of_attorney"
    | "court_order"
    | "other";
  url: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface GuardianRelationship {
  id: string;
  tenantId: string;
  athleteId: string;
  guardianUserId: string;
  relationshipType: GuardianRelationshipType;
  isPrimary?: boolean;
  legallyResponsible: boolean;
  proofDocuments?: ProofDocument[];
  status: GuardianRelationshipStatus;
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
  updatedAt: string;
}
