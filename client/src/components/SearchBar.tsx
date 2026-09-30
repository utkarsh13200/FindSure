import { useEffect, useState, type FormEvent } from "react";
import { LocateFixed, Search } from "lucide-react";
import {
  INDIA_CITIES,
  resolveIndiaLocation,
  CITY_SEARCH_RADIUS_KM,
  findCityMention,
} from "../utils/indiaCities";

type SearchBarProps = {
  initialQuery?: string;
  initialLocationLabel?: string;
  onSearch: (payload: {
    q: string;
    lat: number;
    lng: number;
    locationLabel: string;
    indiaWide: boolean;
    radiusKm: number;
  }) => void;
  compact?: boolean;
};

export function SearchBar({
  initialQuery = "Laptop repair",
  initialLocationLabel = "India",
  onSearch,
  compact,
}: SearchBarProps) {
  const initial = resolveIndiaLocation(initialLocationLabel);
  const [q, setQ] = useState(initialQuery);
  const [locationLabel, setLocationLabel] = useState(initial.label);
  const [coords, setCoords] = useState({ lat: initial.lat, lng: initial.lng });
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    setQ(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (initialLocationLabel === "Current location") {
      setLocationLabel("Current location");
      return;
    }
    const resolved = resolveIndiaLocation(initialLocationLabel);
    setLocationLabel(resolved.label);
    setCoords({ lat: resolved.lat, lng: resolved.lng });
  }, [initialLocationLabel]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;

    const useGeo = locationLabel === "Current location";
    let resolved = resolveIndiaLocation(locationLabel);

    // If location is still India/unknown-wide, try to read a city from the query
    // (users often type "laptop repair Mumbai" in the first field).
    if (!useGeo && resolved.isIndiaWide) {
      const mentioned = findCityMention(q) || findCityMention(locationLabel);
      if (mentioned) {
        resolved = {
          label: mentioned.label,
          lat: mentioned.lat,
          lng: mentioned.lng,
          radiusKm: CITY_SEARCH_RADIUS_KM,
          isIndiaWide: false,
        };
        setLocationLabel(mentioned.label);
      }
    }

    const lat = useGeo ? coords.lat : resolved.lat;
    const lng = useGeo ? coords.lng : resolved.lng;
    onSearch({
      q: q.trim(),
      lat,
      lng,
      locationLabel: useGeo ? locationLabel : resolved.label,
      indiaWide: useGeo ? false : resolved.isIndiaWide,
      radiusKm: useGeo ? CITY_SEARCH_RADIUS_KM : resolved.radiusKm || CITY_SEARCH_RADIUS_KM,
    });
  }

  function useMyLocation() {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported. Search by city instead.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLabel("Current location");
        setLocating(false);
      },
      () => {
        setLocating(false);
        setGeoError(
          "We couldn't access your location. Search by city or address instead."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "w-full" : "w-full"}>
      <div
        className={`flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center ${
          compact ? "" : "sm:p-2.5"
        }`}
      >
        <label className="sr-only" htmlFor="search-query">
          Search query
        </label>
        <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <input
            id="search-query"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Laptop repair near me"
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="hidden h-8 w-px bg-slate-200 sm:block" />
        <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2">
          <label className="sr-only" htmlFor="search-location">
            Location
          </label>
          <input
            id="search-location"
            value={locationLabel}
            onChange={(e) => {
              const value = e.target.value;
              setLocationLabel(value);
              const resolved = resolveIndiaLocation(value);
              if (value.trim() && value !== "Current location") {
                setCoords({ lat: resolved.lat, lng: resolved.lng });
              }
            }}
            placeholder="City — results within 10 km"
            list="india-cities"
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          <datalist id="india-cities">
            {INDIA_CITIES.filter((c) => c.label !== "India").map((c) => (
              <option key={c.label} value={c.label} />
            ))}
            <option value="India" />
          </datalist>
          <button
            type="button"
            onClick={useMyLocation}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50"
            aria-label="Use current location"
          >
            <LocateFixed className="h-4 w-4" />
            {locating ? "…" : "Near me"}
          </button>
        </div>
        <button
          type="submit"
          className="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
        >
          Search
        </button>
      </div>
      {geoError && (
        <p className="mt-2 text-sm text-amber-700" role="status">
          {geoError}
        </p>
      )}
    </form>
  );
}
