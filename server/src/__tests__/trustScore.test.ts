import { describe, expect, it } from "vitest";
import {
  calculateTrustScore,
  reportWeight,
  recommendedRank,
} from "../services/trustScore.js";

describe("calculateTrustScore", () => {
  const now = new Date("2026-09-08T12:00:00Z");

  it("scores a healthy business highly", () => {
    const result = calculateTrustScore({
      now,
      verifications: [{ type: "LOCATION", source: "field", createdAt: new Date("2026-08-27T12:00:00Z") }],
      confirmations: Array.from({ length: 8 }, (_, i) => ({
        type: "LOCATION_CONFIRMED",
        createdAt: new Date(now.getTime() - i * 3 * 86400000),
        status: "active",
      })),
      reports: [],
      reviews: [{ reviewDate: new Date("2026-09-01T12:00:00Z") }],
    });

    expect(result.score).toBeGreaterThanOrEqual(85);
    expect(result.confidence).toBe("high");
    expect(result.concernState).toBe("NO_CONCERN");
  });

  it("flags potentially moved after 2+ recent relocation reports", () => {
    const result = calculateTrustScore({
      now,
      verifications: [{ type: "LOCATION", source: "import", createdAt: new Date("2026-01-01T12:00:00Z") }],
      confirmations: [],
      reports: [
        { type: "MOVED", createdAt: new Date("2026-09-02T12:00:00Z") },
        { type: "MOVED", createdAt: new Date("2026-08-20T12:00:00Z") },
      ],
    });

    expect(result.concernState).toBe("POTENTIALLY_MOVED");
    expect(result.score).toBeLessThan(70);
  });

  it("does not auto-close on a single closure report", () => {
    const result = calculateTrustScore({
      now,
      verifications: [{ type: "LOCATION", source: "import", createdAt: new Date("2026-08-01T12:00:00Z") }],
      confirmations: [{ type: "BUSINESS_OPEN", createdAt: new Date("2026-08-15T12:00:00Z") }],
      reports: [{ type: "CLOSED", createdAt: new Date("2026-09-05T12:00:00Z") }],
    });

    expect(result.concernState).toBe("NEEDS_VERIFICATION");
    expect(result.concernState).not.toBe("POTENTIALLY_CLOSED");
  });

  it("decays old reports", () => {
    const fresh = reportWeight(new Date("2026-09-01T12:00:00Z"), now);
    const old = reportWeight(new Date("2024-09-01T12:00:00Z"), now);
    expect(fresh).toBeGreaterThan(old);
    expect(old).toBeLessThan(0.2);
  });
});

describe("recommendedRank", () => {
  it("prefers nearer high-trust results", () => {
    const near = recommendedRank({
      distanceKm: 1,
      trustScore: 90,
      rating: 4.5,
      daysSinceVerification: 10,
      queryMatch: 1,
    });
    const far = recommendedRank({
      distanceKm: 20,
      trustScore: 50,
      rating: 3,
      daysSinceVerification: 200,
      queryMatch: 0.5,
    });
    expect(near).toBeGreaterThan(far);
  });
});
