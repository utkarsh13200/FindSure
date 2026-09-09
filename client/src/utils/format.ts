import type { ConfidenceLevel, ConcernState, TrustInfo } from "../types";

export function formatRelativeDate(iso: string | null | undefined): string {
  if (!iso) return "Never verified";
  const date = new Date(iso);
  const days = Math.round((Date.now() - date.getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months === 1) return "1 month ago";
  if (months < 24) return `${months} months ago`;
  const years = Math.round(months / 12);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

export function confidenceLabel(level: ConfidenceLevel): string {
  if (level === "high") return "High confidence";
  if (level === "medium") return "Medium confidence";
  return "Low confidence";
}

export function concernLabel(state: ConcernState): string {
  switch (state) {
    case "POTENTIALLY_MOVED":
      return "Potentially moved";
    case "POTENTIALLY_CLOSED":
      return "Possible closure";
    case "NEEDS_VERIFICATION":
      return "Needs verification";
    default:
      return "No concern";
  }
}

export function confirmationLabel(type: string): string {
  switch (type) {
    case "LOCATION_CONFIRMED":
      return "Location confirmed";
    case "BUSINESS_OPEN":
      return "Business operating";
    case "ADDRESS_CORRECT":
      return "Correct address";
    case "BUSINESS_FOUND":
      return "Business found here";
    default:
      return type.replaceAll("_", " ").toLowerCase();
  }
}

export function reportTypeLabel(type: string): string {
  switch (type) {
    case "MOVED":
      return "Business has moved";
    case "CLOSED":
      return "Business is permanently closed";
    case "DOES_NOT_EXIST":
      return "Business does not exist here";
    case "WRONG_ADDRESS":
      return "Wrong address";
    case "WRONG_PHONE":
      return "Wrong phone number";
    case "WRONG_CATEGORY":
      return "Wrong business category";
    default:
      return "Other";
  }
}

export function trustBadgeClasses(trust: TrustInfo): string {
  if (
    trust.concernState === "POTENTIALLY_CLOSED" ||
    trust.concernState === "POTENTIALLY_MOVED"
  ) {
    return "bg-amber-50 text-amber-800 border-amber-200";
  }
  if (trust.confidence === "high") {
    return "bg-emerald-50 text-emerald-800 border-emerald-200";
  }
  if (trust.confidence === "medium") {
    return "bg-sky-50 text-sky-800 border-sky-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
}

export function directionsUrl(
  business: { latitude: number; longitude: number; name: string; googleMapsUrl?: string | null },
  from?: { lat: number; lng: number }
): string {
  if (from) {
    return `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${business.latitude},${business.longitude}&destination_place_id=&travelmode=driving`;
  }
  return (
    business.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${business.name} ${business.latitude},${business.longitude}`
    )}`
  );
}

/** Default demo framing: geographic center of India */
export const DEFAULT_CENTER = { lat: 22.5937, lng: 78.9629 };
