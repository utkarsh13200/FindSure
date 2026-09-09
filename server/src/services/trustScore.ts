import {
  FRESHNESS,
  TRUST_WEIGHTS,
  type ConcernState,
  type ConfidenceLevel,
} from "../utils/config.js";

export type ReportLike = {
  type: string;
  createdAt: Date;
};

export type ConfirmationLike = {
  type: string;
  createdAt: Date;
  status?: string;
};

export type VerificationLike = {
  type: string;
  source: string;
  createdAt: Date;
};

export type ReviewLike = {
  reviewDate: Date;
};

export type TrustInput = {
  verifications: VerificationLike[];
  confirmations: ConfirmationLike[];
  reports: ReportLike[];
  reviews?: ReviewLike[];
  now?: Date;
};

export type TrustResult = {
  score: number;
  confidence: ConfidenceLevel;
  lastVerifiedAt: string | null;
  recentConfirmations: number;
  relocationReports: number;
  closureReports: number;
  notFoundReports: number;
  concernState: ConcernState;
  signals: {
    stalePenalty: number;
    reportPenalty: number;
    confirmationBonus: number;
    ownerBonus: number;
    reviewBonus: number;
    noConfirmationPenalty: number;
  };
};

function daysBetween(a: Date, b: Date): number {
  return Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24);
}

/**
 * Newer reports weigh more; reports older than REPORT_DECAY_DAYS approach 0.
 * Linear decay: weight = max(0, 1 - age/DECAY_DAYS)
 */
export function reportWeight(createdAt: Date, now: Date): number {
  const age = daysBetween(createdAt, now);
  return Math.max(0, 1 - age / FRESHNESS.REPORT_DECAY_DAYS);
}

function sumWeighted(reports: ReportLike[], types: string[], now: Date): number {
  return reports
    .filter((r) => types.includes(r.type))
    .reduce((sum, r) => sum + reportWeight(r.createdAt, now), 0);
}

function countRecentReports(reports: ReportLike[], types: string[], now: Date, withinDays = 180): number {
  return reports.filter(
    (r) => types.includes(r.type) && daysBetween(r.createdAt, now) <= withinDays
  ).length;
}

/**
 * Deterministic trust score — transparent product logic, not an opaque AI score.
 *
 * Base 100, then:
 * - Penalize stale verification, weighted relocation/closure/not-found reports
 * - Bonus for recent confirmations, owner verification, recent reviews
 * - Small penalty when there are no recent confirmations
 *
 * Concern state (product rule): a single report never auto-closes a listing.
 * 1 recent report → NEEDS_VERIFICATION
 * 2+ relocation → POTENTIALLY_MOVED
 * 2+ closure → POTENTIALLY_CLOSED
 */
export function calculateTrustScore(input: TrustInput): TrustResult {
  const now = input.now ?? new Date();
  const { verifications, confirmations, reports, reviews = [] } = input;

  const lastVerification = [...verifications].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )[0];

  const lastVerifiedAt = lastVerification?.createdAt ?? null;
  const daysSinceVerification = lastVerifiedAt
    ? daysBetween(lastVerifiedAt, now)
    : 365;

  let stalePenalty = 0;
  if (daysSinceVerification > FRESHNESS.HIGH_DAYS) {
    const monthsOver = (daysSinceVerification - FRESHNESS.HIGH_DAYS) / 30;
    stalePenalty = Math.min(
      TRUST_WEIGHTS.MAX_STALE_PENALTY,
      monthsOver * TRUST_WEIGHTS.STALE_PER_MONTH
    );
  }

  const relocationWeighted = sumWeighted(reports, ["MOVED", "WRONG_ADDRESS"], now);
  const closureWeighted = sumWeighted(reports, ["CLOSED"], now);
  const notFoundWeighted = sumWeighted(reports, ["DOES_NOT_EXIST"], now);
  const wrongInfoWeighted = sumWeighted(
    reports,
    ["WRONG_PHONE", "WRONG_CATEGORY", "OTHER"],
    now
  );

  const reportPenalty = Math.min(
    TRUST_WEIGHTS.MAX_REPORT_PENALTY,
    relocationWeighted * TRUST_WEIGHTS.RELOCATION_PER_WEIGHTED +
      closureWeighted * TRUST_WEIGHTS.CLOSURE_PER_WEIGHTED +
      notFoundWeighted * TRUST_WEIGHTS.NOT_FOUND_PER_WEIGHTED +
      wrongInfoWeighted * TRUST_WEIGHTS.WRONG_INFO_PER_WEIGHTED
  );

  const recentConfirmations = confirmations.filter(
    (c) =>
      (c.status ?? "active") === "active" &&
      daysBetween(c.createdAt, now) <= FRESHNESS.RECENT_CONFIRMATION_DAYS
  ).length;

  const confirmationBonus = Math.min(
    TRUST_WEIGHTS.MAX_CONFIRMATION_BONUS,
    recentConfirmations * TRUST_WEIGHTS.CONFIRMATION_BONUS
  );

  const hasOwnerVerification = verifications.some(
    (v) =>
      v.source === "owner" &&
      daysBetween(v.createdAt, now) <= FRESHNESS.MEDIUM_DAYS
  );
  const ownerBonus = hasOwnerVerification ? TRUST_WEIGHTS.OWNER_VERIFICATION_BONUS : 0;

  const hasRecentReview = reviews.some(
    (r) => daysBetween(r.reviewDate, now) <= FRESHNESS.RECENT_CONFIRMATION_DAYS
  );
  const reviewBonus = hasRecentReview ? TRUST_WEIGHTS.RECENT_REVIEW_BONUS : 0;

  const noConfirmationPenalty =
    recentConfirmations === 0 ? TRUST_WEIGHTS.NO_RECENT_CONFIRMATION_PENALTY : 0;

  const raw =
    TRUST_WEIGHTS.BASE -
    stalePenalty -
    reportPenalty -
    noConfirmationPenalty +
    confirmationBonus +
    ownerBonus +
    reviewBonus;

  const score = Math.max(0, Math.min(100, Math.round(raw)));

  let confidence: ConfidenceLevel = "low";
  if (daysSinceVerification <= FRESHNESS.HIGH_DAYS && reportPenalty < 10) {
    confidence = "high";
  } else if (daysSinceVerification <= FRESHNESS.MEDIUM_DAYS && reportPenalty < 25) {
    confidence = "medium";
  }

  const recentRelocation = countRecentReports(reports, ["MOVED", "WRONG_ADDRESS"], now);
  const recentClosure = countRecentReports(reports, ["CLOSED"], now);
  const recentNotFound = countRecentReports(reports, ["DOES_NOT_EXIST"], now);
  const recentAnyIssue = recentRelocation + recentClosure + recentNotFound;

  let concernState: ConcernState = "NO_CONCERN";
  if (recentClosure >= 2) {
    concernState = "POTENTIALLY_CLOSED";
  } else if (recentRelocation >= 2 || recentNotFound >= 2) {
    concernState = "POTENTIALLY_MOVED";
  } else if (recentAnyIssue >= 1 || daysSinceVerification > FRESHNESS.MEDIUM_DAYS) {
    concernState = "NEEDS_VERIFICATION";
  }

  return {
    score,
    confidence,
    lastVerifiedAt: lastVerifiedAt ? lastVerifiedAt.toISOString() : null,
    recentConfirmations,
    relocationReports: reports.filter((r) =>
      ["MOVED", "WRONG_ADDRESS"].includes(r.type)
    ).length,
    closureReports: reports.filter((r) => r.type === "CLOSED").length,
    notFoundReports: reports.filter((r) => r.type === "DOES_NOT_EXIST").length,
    concernState,
    signals: {
      stalePenalty: Math.round(stalePenalty * 10) / 10,
      reportPenalty: Math.round(reportPenalty * 10) / 10,
      confirmationBonus,
      ownerBonus,
      reviewBonus,
      noConfirmationPenalty,
    },
  };
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Recommended ranking blends relevance, distance, trust, rating, freshness.
 * Higher score = better rank position.
 */
export function recommendedRank(opts: {
  distanceKm: number;
  trustScore: number;
  rating: number | null;
  daysSinceVerification: number | null;
  queryMatch: number;
}): number {
  const distanceScore = Math.max(0, 40 - opts.distanceKm * 4);
  const trust = opts.trustScore * 0.35;
  const rating = (opts.rating ?? 3) * 6;
  const freshness =
    opts.daysSinceVerification == null
      ? 0
      : Math.max(0, 20 - opts.daysSinceVerification / 15);
  const relevance = opts.queryMatch * 25;
  return relevance + distanceScore + trust + rating + freshness;
}
