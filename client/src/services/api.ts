import type { SearchParams, Business, ReportType } from "../types";

const BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export function searchBusinesses(params: SearchParams) {
  const q = new URLSearchParams();
  q.set("q", params.q);
  q.set("lat", String(params.lat));
  q.set("lng", String(params.lng));
  if (params.sort) q.set("sort", params.sort);
  if (params.trust) q.set("trust", params.trust);
  if (params.openNow) q.set("openNow", "true");
  if (params.recentlyVerified) q.set("recentlyVerified", "true");
  if (params.outdated) q.set("outdated", "true");
  if (params.minRating != null) q.set("minRating", String(params.minRating));
  if (params.maxDistance != null) q.set("maxDistance", String(params.maxDistance));

  return request<import("../types").SearchResponse>(`/businesses/search?${q}`);
}

export function getBusiness(id: string, lat?: number, lng?: number) {
  const q = new URLSearchParams();
  if (lat != null) q.set("lat", String(lat));
  if (lng != null) q.set("lng", String(lng));
  const suffix = q.toString() ? `?${q}` : "";
  return request<{ demoMode: boolean; business: Business }>(
    `/businesses/${id}${suffix}`
  );
}

export function submitReport(
  id: string,
  payload: {
    type: ReportType;
    description?: string;
    reporterName?: string;
    reporterEmail?: string;
  }
) {
  return request<{ report: unknown; business: Business }>(
    `/businesses/${id}/reports`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export function submitConfirmation(
  id: string,
  type:
    | "LOCATION_CONFIRMED"
    | "BUSINESS_OPEN"
    | "ADDRESS_CORRECT"
    | "BUSINESS_FOUND"
) {
  return request<{ confirmation: unknown; business: Business }>(
    `/businesses/${id}/confirm`,
    {
      method: "POST",
      body: JSON.stringify({ type }),
    }
  );
}

export function getHealth() {
  return request<{ status: string; demoMode: boolean }>("/health");
}
