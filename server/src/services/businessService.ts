import { prisma } from "../db/prisma.js";
import { AppError } from "../middleware/errorHandler.js";
import {
  calculateTrustScore,
  haversineKm,
  recommendedRank,
} from "./trustScore.js";
import { isGooglePlacesEnabled, searchPlacesNearby } from "./googlePlaces.js";
import { FRESHNESS } from "../utils/config.js";
import type { Prisma } from "@prisma/client";

const businessInclude = {
  verifications: true,
  confirmations: true,
  reports: true,
  reviews: true,
} satisfies Prisma.BusinessInclude;

type BusinessFull = Prisma.BusinessGetPayload<{ include: typeof businessInclude }>;

function daysSince(date: Date | null, now = new Date()): number | null {
  if (!date) return null;
  return (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
}

function enrichBusiness(business: BusinessFull, userLat?: number, userLng?: number) {
  const trust = calculateTrustScore({
    verifications: business.verifications,
    confirmations: business.confirmations,
    reports: business.reports,
    reviews: business.reviews,
  });

  const distanceKm =
    userLat != null && userLng != null
      ? haversineKm(userLat, userLng, business.latitude, business.longitude)
      : null;

  return {
    id: business.id,
    googlePlaceId: business.googlePlaceId,
    name: business.name,
    category: business.category,
    address: business.address,
    latitude: business.latitude,
    longitude: business.longitude,
    phone: business.phone,
    website: business.website,
    rating: business.rating,
    reviewCount: business.reviewCount,
    googleMapsUrl: business.googleMapsUrl,
    openNow: business.openNow,
    distanceKm: distanceKm != null ? Math.round(distanceKm * 10) / 10 : null,
    trust,
    confirmations: business.confirmations
      .slice()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
      .map((c) => ({
        id: c.id,
        type: c.type,
        source: c.source,
        createdAt: c.createdAt.toISOString(),
      })),
    reports: business.reports
      .slice()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((r) => ({
        id: r.id,
        type: r.type,
        description: r.description,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      })),
    reviews: business.reviews.map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      text: r.text,
      reviewDate: r.reviewDate.toISOString(),
      source: r.source,
    })),
  };
}

async function upsertFromPlaces(
  places: Awaited<ReturnType<typeof searchPlacesNearby>>,
  category: string
) {
  const results: BusinessFull[] = [];
  for (const place of places) {
    if (!place.googlePlaceId) continue;
    const existing = await prisma.business.findUnique({
      where: { googlePlaceId: place.googlePlaceId },
      include: businessInclude,
    });

    if (existing) {
      results.push(existing);
      continue;
    }

    const created = await prisma.business.create({
      data: {
        googlePlaceId: place.googlePlaceId,
        name: place.name,
        category,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        phone: place.phone,
        website: place.website,
        rating: place.rating,
        reviewCount: place.reviewCount ?? 0,
        googleMapsUrl: place.googleMapsUrl,
        openNow: place.openNow ?? true,
        verifications: {
          create: {
            type: "IMPORT",
            source: "google_places",
          },
        },
      },
      include: businessInclude,
    });
    results.push(created);
  }
  return results;
}

export async function searchBusinesses(opts: {
  q?: string;
  lat?: number;
  lng?: number;
  category?: string;
  sort?: string;
  filterTrust?: string;
  filterOpenNow?: boolean;
  filterRecentlyVerified?: boolean;
  filterOutdated?: boolean;
  minRating?: number;
  maxDistanceKm?: number;
}) {
  const query = (opts.q ?? "laptop repair").trim().toLowerCase();
  const lat = opts.lat ?? 12.9716;
  const lng = opts.lng ?? 77.5946;
  const category = opts.category ?? "laptop_repair";

  let businesses: BusinessFull[];

  if (isGooglePlacesEnabled()) {
    try {
      const places = await searchPlacesNearby(query || "laptop repair", lat, lng);
      businesses = await upsertFromPlaces(places, category);
    } catch (err) {
      console.warn("Places failed, falling back to DB:", err);
      businesses = await prisma.business.findMany({ include: businessInclude });
    }
  } else {
    businesses = await prisma.business.findMany({ include: businessInclude });
  }

  const enriched = businesses.map((b) => {
    const e = enrichBusiness(b, lat, lng);
    const hay = `${e.name} ${e.category} laptop repair`.toLowerCase();
    const tokens = query.split(/\s+/).filter(Boolean);
    const nameMatch =
      tokens.length === 0
        ? 1
        : tokens.some((t) => hay.includes(t))
          ? 1
          : 0.3;

    const lastVerified = e.trust.lastVerifiedAt
      ? new Date(e.trust.lastVerifiedAt)
      : null;

    const rank = recommendedRank({
      distanceKm: e.distanceKm ?? 50,
      trustScore: e.trust.score,
      rating: e.rating,
      daysSinceVerification: daysSince(lastVerified),
      queryMatch: nameMatch,
    });

    return { ...e, _rank: rank };
  });

  let filtered = enriched.filter((b) => {
    if (!query) return true;
    const hay = `${b.name} ${b.category} laptop repair`.toLowerCase();
    const tokens = query.split(/\s+/).filter(Boolean);
    return tokens.some((t) => hay.includes(t));
  });

  if (opts.filterOpenNow) {
    filtered = filtered.filter((b) => b.openNow);
  }
  if (opts.minRating != null) {
    filtered = filtered.filter((b) => (b.rating ?? 0) >= opts.minRating!);
  }
  if (opts.maxDistanceKm != null) {
    filtered = filtered.filter(
      (b) => b.distanceKm == null || b.distanceKm <= opts.maxDistanceKm!
    );
  }
  if (opts.filterRecentlyVerified) {
    filtered = filtered.filter((b) => {
      if (!b.trust.lastVerifiedAt) return false;
      return daysSince(new Date(b.trust.lastVerifiedAt))! <= FRESHNESS.HIGH_DAYS;
    });
  }
  if (opts.filterOutdated) {
    filtered = filtered.filter(
      (b) => b.trust.concernState !== "NO_CONCERN" || b.trust.confidence === "low"
    );
  }
  if (opts.filterTrust) {
    const levels = opts.filterTrust.split(",").map((s) => s.trim());
    filtered = filtered.filter((b) => {
      if (levels.includes("high") && b.trust.confidence === "high") return true;
      if (levels.includes("medium") && b.trust.confidence === "medium") return true;
      if (levels.includes("needs_verification") && b.trust.concernState !== "NO_CONCERN")
        return true;
      return false;
    });
  }

  const sort = opts.sort ?? "recommended";
  filtered.sort((a, b) => {
    switch (sort) {
      case "nearest":
        return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
      case "trust":
        return b.trust.score - a.trust.score;
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0);
      case "recently_verified": {
        const ad = a.trust.lastVerifiedAt
          ? new Date(a.trust.lastVerifiedAt).getTime()
          : 0;
        const bd = b.trust.lastVerifiedAt
          ? new Date(b.trust.lastVerifiedAt).getTime()
          : 0;
        return bd - ad;
      }
      default:
        return b._rank - a._rank;
    }
  });

  return {
    demoMode: process.env.DEMO_MODE === "true" || !isGooglePlacesEnabled(),
    center: { lat, lng },
    count: filtered.length,
    businesses: filtered.map(({ _rank, ...rest }) => rest),
  };
}

export async function getBusinessById(id: string, lat?: number, lng?: number) {
  const business = await prisma.business.findUnique({
    where: { id },
    include: businessInclude,
  });
  if (!business) throw new AppError("Business not found", 404);
  return {
    demoMode: process.env.DEMO_MODE === "true" || !isGooglePlacesEnabled(),
    business: enrichBusiness(business, lat, lng),
  };
}

export async function getTrust(id: string) {
  const business = await prisma.business.findUnique({
    where: { id },
    include: businessInclude,
  });
  if (!business) throw new AppError("Business not found", 404);
  return calculateTrustScore({
    verifications: business.verifications,
    confirmations: business.confirmations,
    reports: business.reports,
    reviews: business.reviews,
  });
}

export async function createReport(
  id: string,
  data: {
    type: string;
    description?: string;
    reporterName?: string;
    reporterEmail?: string;
  }
) {
  const business = await prisma.business.findUnique({ where: { id } });
  if (!business) throw new AppError("Business not found", 404);

  const report = await prisma.report.create({
    data: {
      businessId: id,
      type: data.type,
      description: data.description,
      reporterName: data.reporterName,
      reporterEmail: data.reporterEmail,
    },
  });

  const updated = await getBusinessById(id);
  return { report, business: updated.business };
}

export async function createConfirmation(
  id: string,
  data: { type: string; source?: string }
) {
  const business = await prisma.business.findUnique({ where: { id } });
  if (!business) throw new AppError("Business not found", 404);

  const confirmation = await prisma.confirmation.create({
    data: {
      businessId: id,
      type: data.type,
      source: data.source ?? "user",
    },
  });

  await prisma.verification.create({
    data: {
      businessId: id,
      type: "USER_CONFIRMATION",
      source: "user",
    },
  });

  const updated = await getBusinessById(id);
  return { confirmation, business: updated.business };
}

export async function getReports(id: string) {
  const business = await prisma.business.findUnique({ where: { id } });
  if (!business) throw new AppError("Business not found", 404);
  return prisma.report.findMany({
    where: { businessId: id },
    orderBy: { createdAt: "desc" },
  });
}

export async function getReviews(id: string, sort: string = "recent") {
  const business = await prisma.business.findUnique({ where: { id } });
  if (!business) throw new AppError("Business not found", 404);

  const reviews = await prisma.review.findMany({ where: { businessId: id } });
  reviews.sort((a, b) => {
    if (sort === "highest") return b.rating - a.rating;
    if (sort === "lowest") return a.rating - b.rating;
    return b.reviewDate.getTime() - a.reviewDate.getTime();
  });
  return reviews;
}
