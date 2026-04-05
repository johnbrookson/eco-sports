// fonte: schemas/athlete.json
// Mantenha alinhado com o JSON Schema em `schemas/athlete.json`.
// Futuro: gerar automaticamente via json-schema-to-typescript.

export type Gender =
  | "female"
  | "male"
  | "non_binary"
  | "prefer_not_to_say"
  | "other";

export type DominantSide = "left" | "right" | "ambidextrous" | "not_applicable";

export type AthleteStatus =
  | "prospect"
  | "active"
  | "inactive"
  | "graduated"
  | "archived";

export interface AthleteProfile {
  firstName: string;
  lastName: string;
  preferredName?: string;
  birthDate: string; // ISO date
  gender: Gender;
  country: string;
  state?: string;
  city?: string;
  nationality?: string;
  photoUrl?: string;
  bio?: string;
}

export interface AthleteContact {
  email?: string;
  phone?: string;
  instagram?: string;
  linkedin?: string;
}

export interface AthleteGuardian {
  name: string;
  relationship: string;
  phone?: string;
  email?: string;
}

export interface AthleteSport {
  discipline: string;
  primaryPosition?: string;
  secondaryPositions?: string[];
  dominantSide?: DominantSide;
}

export interface AthletePhysicalProfile {
  heightCm?: number;
  weightKg?: number;
  wingspanCm?: number;
  bodyFatPct?: number;
  notes?: string;
}

export interface AthleteEducation {
  schoolName?: string;
  gradeLevel?: string;
  graduationYear?: number;
  academicGoals?: string[];
}

export interface AthleteCareer {
  currentClub?: string;
  currentTeam?: string;
  coachName?: string;
  seasonGoals?: string[];
  achievements?: string[];
}

export interface AthleteMedia {
  highlightVideoUrls?: string[];
  portfolioUrl?: string;
  galleryUrls?: string[];
}

export interface AthleteConsents {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  imageUseAccepted: boolean;
  minorConsentProvided?: boolean;
  consentVersion?: string;
  acceptedAt?: string;
}

export interface AthleteVisibility {
  publicProfileEnabled: boolean;
  showPhoto?: boolean;
  showAge?: boolean;
  showCity?: boolean;
  showPhysicalProfile?: boolean;
  showHighlightVideos?: boolean;
  showAchievements?: boolean;
  showCurrentClub?: boolean;
  showContact?: boolean;
}

export interface Athlete {
  id: string;
  tenantId: string;
  slug?: string;
  profile: AthleteProfile;
  contact?: AthleteContact;
  guardians?: AthleteGuardian[];
  sport: AthleteSport;
  physicalProfile?: AthletePhysicalProfile;
  category: string;
  education?: AthleteEducation;
  career?: AthleteCareer;
  media?: AthleteMedia;
  status: AthleteStatus;
  consents: AthleteConsents;
  visibility: AthleteVisibility;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
