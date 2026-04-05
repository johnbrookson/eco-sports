// fonte: schemas/performance-metrics.json
// Mantenha alinhado com o JSON Schema em `schemas/performance-metrics.json`.
// Cada registro representa UM evento atômico no histórico do atleta
// (uma partida, um treino, uma avaliação). Um atleta tem N desses registros.

export type PerformanceSourceType =
  | "training"
  | "match"
  | "assessment"
  | "video_review"
  | "combined";

export type SeasonTrend = "up" | "down" | "stable" | "unknown";

export interface PerformanceContext {
  sourceType: PerformanceSourceType;
  sessionId?: string;
  matchId?: string;
  opponent?: string;
  competition?: string;
  location?: string;
  notes?: string;
}

export interface PerformancePeriod {
  startedAt: string;
  endedAt: string;
  season?: string;
  cycle?: string;
}

export interface PerformanceMetricValues {
  // Box score (basquete)
  minutesPlayed?: number;
  points?: number;
  assists?: number;
  rebounds?: number;
  steals?: number;
  blocks?: number;
  turnovers?: number;
  fouls?: number;
  fieldGoalAttempts?: number;
  fieldGoalsMade?: number;
  threePointAttempts?: number;
  threePointsMade?: number;
  freeThrowAttempts?: number;
  freeThrowsMade?: number;
  fieldGoalPct?: number;
  threePointPct?: number;
  freeThrowPct?: number;
  // Físico
  sprintSpeedMps?: number;
  verticalJumpCm?: number;
  agilitySeconds?: number;
  enduranceScore?: number;
  // Técnico
  coachRating?: number;
  technicalNotes?: string;
  videoTags?: string[];
}

export interface PerformanceBenchmarks {
  positionAverage?: Record<string, unknown>;
  teamAverage?: Record<string, unknown>;
  seasonTrend?: SeasonTrend;
}

export interface PerformanceAttachment {
  type: "video" | "image" | "report" | "spreadsheet" | "other";
  url: string;
  label?: string;
}

export interface PerformanceEvent {
  id: string;
  tenantId: string;
  athleteId: string;
  sport: string;
  context: PerformanceContext;
  period: PerformancePeriod;
  metrics: PerformanceMetricValues;
  benchmarks?: PerformanceBenchmarks;
  attachments?: PerformanceAttachment[];
  createdAt: string;
}
