import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;

export enum AthleteStatus {
  prospect = "prospect",
  active = "active",
  inactive = "inactive",
  graduated = "graduated",
  archived = "archived",
}
export enum DominantSide {
  left = "left",
  right = "right",
  ambidextrous = "ambidextrous",
  not_applicable = "not_applicable",
}
export enum Gender {
  female = "female",
  male = "male",
  non_binary = "non_binary",
  prefer_not_to_say = "prefer_not_to_say",
  other = "other",
}
export enum GuardianRelationshipType {
  mother = "mother",
  father = "father",
  stepmother = "stepmother",
  stepfather = "stepfather",
  grandparent = "grandparent",
  sibling_adult = "sibling_adult",
  legal_guardian = "legal_guardian",
  foster_parent = "foster_parent",
  other = "other",
}
export enum PerformanceSourceType {
  training = "training",
  match = "match",
  assessment = "assessment",
  video_review = "video_review",
  combined = "combined",
}

export interface AthleteByUserData {
  athletes: ({
    id: UUIDString;
    slug?: string | null;
    firstName: string;
    lastName: string;
    category: string;
    pendingVisibility?: unknown | null;
  } & Athlete_Key)[];
}

export interface AthleteByUserVariables {
  userId: string;
}

export interface Athlete_Key {
  id: UUIDString;
  __typename?: 'Athlete_Key';
}

export interface Consent_Key {
  id: UUIDString;
  __typename?: 'Consent_Key';
}

export interface DiscoverableAthletesData {
  athletes: ({
    id: UUIDString;
    tenantId: UUIDString;
    slug?: string | null;
    firstName: string;
    lastName: string;
    preferredName?: string | null;
    birthDate: DateString;
    gender: Gender;
    country: string;
    discipline: string;
    primaryPosition?: string | null;
    category: string;
    photoUrl?: string | null;
    career?: unknown | null;
    status: AthleteStatus;
    publicProfileEnabled: boolean;
    discoverable: boolean;
    showPhoto: boolean;
    showCurrentClub: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Athlete_Key)[];
}

export interface DiscoverableAthletesVariables {
  position?: string | null;
  category?: string | null;
}

export interface GuardianRelationship_Key {
  id: UUIDString;
  __typename?: 'GuardianRelationship_Key';
}

export interface ManagedAthletesByGuardianData {
  guardianRelationships: ({
    legallyResponsible: boolean;
    relationshipType: GuardianRelationshipType;
    athlete: {
      id: UUIDString;
      slug?: string | null;
      firstName: string;
      lastName: string;
      category: string;
      pendingVisibility?: unknown | null;
    } & Athlete_Key;
  })[];
}

export interface ManagedAthletesByGuardianVariables {
  guardianId: string;
}

export interface OrganizationMembership_Key {
  id: UUIDString;
  __typename?: 'OrganizationMembership_Key';
}

export interface PerformanceEvent_Key {
  id: UUIDString;
  __typename?: 'PerformanceEvent_Key';
}

export interface PerformanceEventsByAthleteData {
  performanceEvents: ({
    id: UUIDString;
    sourceType: PerformanceSourceType;
    startedAt: TimestampString;
    endedAt: TimestampString;
    season?: string | null;
    context?: unknown | null;
    metrics: unknown;
  } & PerformanceEvent_Key)[];
}

export interface PerformanceEventsByAthleteVariables {
  athleteId: UUIDString;
}

export interface PublicAthleteBySlugData {
  athletes: ({
    id: UUIDString;
    tenantId: UUIDString;
    slug?: string | null;
    firstName: string;
    lastName: string;
    preferredName?: string | null;
    birthDate: DateString;
    gender: Gender;
    country: string;
    state?: string | null;
    city?: string | null;
    nationality?: string | null;
    photoUrl?: string | null;
    bio?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    contactInstagram?: string | null;
    contactLinkedin?: string | null;
    discipline: string;
    primaryPosition?: string | null;
    secondaryPositions?: string[] | null;
    dominantSide?: DominantSide | null;
    heightCm?: number | null;
    weightKg?: number | null;
    wingspanCm?: number | null;
    category: string;
    career?: unknown | null;
    media?: unknown | null;
    status: AthleteStatus;
    publicProfileEnabled: boolean;
    discoverable: boolean;
    showPhoto: boolean;
    showAge: boolean;
    showCity: boolean;
    showPhysicalProfile: boolean;
    showHighlightVideos: boolean;
    showAchievements: boolean;
    showCurrentClub: boolean;
    showContact: boolean;
    showMatchStats: boolean;
    showAssessmentStats: boolean;
    tags?: string[] | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Athlete_Key)[];
}

export interface PublicAthleteBySlugVariables {
  slug: string;
}

export interface PublicAthleteSlugsData {
  athletes: ({
    slug?: string | null;
  })[];
}

export interface PublicPerformanceEventsData {
  performanceEvents: ({
    id: UUIDString;
    tenantId: UUIDString;
    athleteId: UUIDString;
    sport: string;
    sourceType: PerformanceSourceType;
    context?: unknown | null;
    startedAt: TimestampString;
    endedAt: TimestampString;
    season?: string | null;
    cycle?: string | null;
    metrics: unknown;
    createdAt: TimestampString;
  } & PerformanceEvent_Key)[];
}

export interface PublicPerformanceEventsVariables {
  athleteId: UUIDString;
}

export interface Tenant_Key {
  id: UUIDString;
  __typename?: 'Tenant_Key';
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'AthleteByUser' Query. Allow users to execute without passing in DataConnect. */
export function athleteByUser(dc: DataConnect, vars: AthleteByUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AthleteByUserData>>;
/** Generated Node Admin SDK operation action function for the 'AthleteByUser' Query. Allow users to pass in custom DataConnect instances. */
export function athleteByUser(vars: AthleteByUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AthleteByUserData>>;

/** Generated Node Admin SDK operation action function for the 'PerformanceEventsByAthlete' Query. Allow users to execute without passing in DataConnect. */
export function performanceEventsByAthlete(dc: DataConnect, vars: PerformanceEventsByAthleteVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<PerformanceEventsByAthleteData>>;
/** Generated Node Admin SDK operation action function for the 'PerformanceEventsByAthlete' Query. Allow users to pass in custom DataConnect instances. */
export function performanceEventsByAthlete(vars: PerformanceEventsByAthleteVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<PerformanceEventsByAthleteData>>;

/** Generated Node Admin SDK operation action function for the 'ManagedAthletesByGuardian' Query. Allow users to execute without passing in DataConnect. */
export function managedAthletesByGuardian(dc: DataConnect, vars: ManagedAthletesByGuardianVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ManagedAthletesByGuardianData>>;
/** Generated Node Admin SDK operation action function for the 'ManagedAthletesByGuardian' Query. Allow users to pass in custom DataConnect instances. */
export function managedAthletesByGuardian(vars: ManagedAthletesByGuardianVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ManagedAthletesByGuardianData>>;

/** Generated Node Admin SDK operation action function for the 'PublicAthleteBySlug' Query. Allow users to execute without passing in DataConnect. */
export function publicAthleteBySlug(dc: DataConnect, vars: PublicAthleteBySlugVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<PublicAthleteBySlugData>>;
/** Generated Node Admin SDK operation action function for the 'PublicAthleteBySlug' Query. Allow users to pass in custom DataConnect instances. */
export function publicAthleteBySlug(vars: PublicAthleteBySlugVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<PublicAthleteBySlugData>>;

/** Generated Node Admin SDK operation action function for the 'PublicAthleteSlugs' Query. Allow users to execute without passing in DataConnect. */
export function publicAthleteSlugs(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<PublicAthleteSlugsData>>;
/** Generated Node Admin SDK operation action function for the 'PublicAthleteSlugs' Query. Allow users to pass in custom DataConnect instances. */
export function publicAthleteSlugs(options?: OperationOptions): Promise<ExecuteOperationResponse<PublicAthleteSlugsData>>;

/** Generated Node Admin SDK operation action function for the 'DiscoverableAthletes' Query. Allow users to execute without passing in DataConnect. */
export function discoverableAthletes(dc: DataConnect, vars?: DiscoverableAthletesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DiscoverableAthletesData>>;
/** Generated Node Admin SDK operation action function for the 'DiscoverableAthletes' Query. Allow users to pass in custom DataConnect instances. */
export function discoverableAthletes(vars?: DiscoverableAthletesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DiscoverableAthletesData>>;

/** Generated Node Admin SDK operation action function for the 'PublicPerformanceEvents' Query. Allow users to execute without passing in DataConnect. */
export function publicPerformanceEvents(dc: DataConnect, vars: PublicPerformanceEventsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<PublicPerformanceEventsData>>;
/** Generated Node Admin SDK operation action function for the 'PublicPerformanceEvents' Query. Allow users to pass in custom DataConnect instances. */
export function publicPerformanceEvents(vars: PublicPerformanceEventsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<PublicPerformanceEventsData>>;

