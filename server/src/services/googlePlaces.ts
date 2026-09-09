/**
 * Google Places (New) API client.
 * Used when DEMO_MODE=false and GOOGLE_MAPS_API_KEY is set.
 */

export type PlacesSearchResult = {
  googlePlaceId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
  reviewCount?: number;
  phone?: string;
  website?: string;
  googleMapsUrl?: string;
  openNow?: boolean;
};

function getApiKey(): string | undefined {
  return process.env.GOOGLE_MAPS_API_KEY || undefined;
}

export function isGooglePlacesEnabled(): boolean {
  return process.env.DEMO_MODE !== "true" && Boolean(getApiKey());
}

export async function searchPlacesNearby(
  query: string,
  lat: number,
  lng: number,
  radiusMeters = 8000
): Promise<PlacesSearchResult[]> {
  const key = getApiKey();
  if (!key) return [];

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.currentOpeningHours",
    },
    body: JSON.stringify({
      textQuery: query,
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: radiusMeters,
        },
      },
      maxResultCount: 20,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Places API error:", res.status, text);
    throw new Error("Google Places search failed");
  }

  const data = (await res.json()) as {
    places?: Array<{
      id?: string;
      displayName?: { text?: string };
      formattedAddress?: string;
      location?: { latitude?: number; longitude?: number };
      rating?: number;
      userRatingCount?: number;
      nationalPhoneNumber?: string;
      websiteUri?: string;
      googleMapsUri?: string;
      currentOpeningHours?: { openNow?: boolean };
    }>;
  };

  return (data.places ?? []).map((p) => ({
    googlePlaceId: p.id ?? "",
    name: p.displayName?.text ?? "Unknown",
    address: p.formattedAddress ?? "",
    latitude: p.location?.latitude ?? lat,
    longitude: p.location?.longitude ?? lng,
    rating: p.rating,
    reviewCount: p.userRatingCount,
    phone: p.nationalPhoneNumber,
    website: p.websiteUri,
    googleMapsUrl: p.googleMapsUri,
    openNow: p.currentOpeningHours?.openNow,
  }));
}
