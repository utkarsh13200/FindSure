/**
 * Central freshness & trust thresholds.
 * Tunable without changing algorithm code elsewhere.
 */
export const FRESHNESS = {
  /** Days since last verification → high confidence */
  HIGH_DAYS: 30,
  /** Days since last verification → medium confidence */
  MEDIUM_DAYS: 120,
  /** Confirmations counted as "recent" */
  RECENT_CONFIRMATION_DAYS: 90,
  /** Reports older than this decay heavily */
  REPORT_DECAY_DAYS: 365,
} as const;

export const TRUST_WEIGHTS = {
  BASE: 100,
  /** Per month past HIGH_DAYS without verification */
  STALE_PER_MONTH: 4,
  MAX_STALE_PENALTY: 35,
  /** Weighted relocation / closure / not-found reports */
  RELOCATION_PER_WEIGHTED: 12,
  CLOSURE_PER_WEIGHTED: 15,
  NOT_FOUND_PER_WEIGHTED: 10,
  WRONG_INFO_PER_WEIGHTED: 4,
  MAX_REPORT_PENALTY: 55,
  /** Bonus for recent confirmations (capped) */
  CONFIRMATION_BONUS: 2,
  MAX_CONFIRMATION_BONUS: 12,
  OWNER_VERIFICATION_BONUS: 8,
  RECENT_REVIEW_BONUS: 3,
  NO_RECENT_CONFIRMATION_PENALTY: 8,
} as const;

export type ConcernState =
  | "NO_CONCERN"
  | "NEEDS_VERIFICATION"
  | "POTENTIALLY_MOVED"
  | "POTENTIALLY_CLOSED";

export type ConfidenceLevel = "high" | "medium" | "low";
