import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { List, Map as MapIcon } from "lucide-react";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { BusinessCard } from "../components/BusinessCard";
import { BusinessMap } from "../components/BusinessMap";
import {
  FiltersPanel,
  defaultFilters,
  type FiltersState,
} from "../components/FiltersPanel";
import { searchBusinesses } from "../services/api";
import { DEFAULT_CENTER } from "../utils/format";
import { resolveIndiaLocation, CITY_SEARCH_RADIUS_KM } from "../utils/indiaCities";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  const q = params.get("q") || "laptop repair";
  const lat = Number(params.get("lat") || DEFAULT_CENTER.lat);
  const lng = Number(params.get("lng") || DEFAULT_CENTER.lng);
  const loc = params.get("loc") || "India";
  const indiaWide =
    params.get("india") === "1" ||
    resolveIndiaLocation(loc).isIndiaWide;
  const cityRadiusKm = indiaWide
    ? undefined
    : resolveIndiaLocation(loc).radiusKm || CITY_SEARCH_RADIUS_KM;

  const trustFilter = useMemo(() => {
    const parts: string[] = [];
    if (filters.trustHigh) parts.push("high");
    if (filters.trustMedium) parts.push("medium");
    if (filters.trustNeeds) parts.push("needs_verification");
    return parts.join(",") || undefined;
  }, [filters]);

  const query = useQuery({
    queryKey: [
      "search",
      q,
      lat,
      lng,
      indiaWide,
      cityRadiusKm,
      filters.sort,
      trustFilter,
      filters.openNow,
      filters.recentlyVerified,
      filters.outdated,
      filters.minRating,
      filters.maxDistance,
    ],
    queryFn: () =>
      searchBusinesses({
        q,
        lat,
        lng,
        sort: filters.sort,
        trust: trustFilter,
        openNow: filters.openNow || undefined,
        recentlyVerified: filters.recentlyVerified || undefined,
        outdated: filters.outdated || undefined,
        minRating: filters.minRating ?? undefined,
        // India-wide: no distance cap. City search: focus on metro radius unless user set a filter.
        maxDistance:
          filters.maxDistance ??
          (indiaWide ? undefined : cityRadiusKm ?? CITY_SEARCH_RADIUS_KM),
      }),
  });

  const businesses = query.data?.businesses ?? [];
  const demoMode = query.data?.demoMode ?? true;

  return (
    <div className="min-h-screen">
      <Header demoMode={demoMode} />
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <SearchBar
          compact
          initialQuery={q}
          initialLocationLabel={loc}
          onSearch={({ q: nq, lat: nlat, lng: nlng, locationLabel, indiaWide: wide }) => {
            setParams({
              q: nq,
              lat: String(nlat),
              lng: String(nlng),
              loc: locationLabel,
              india: wide ? "1" : "0",
            });
          }}
        />

        <div className="mt-3 flex items-center justify-between gap-3 md:hidden">
          <p className="text-sm text-slate-600">
            {query.isLoading ? "Searching…" : `${businesses.length} businesses found`}
          </p>
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setMobileView("list")}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                mobileView === "list" ? "bg-brand-700 text-white" : "text-slate-600"
              }`}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
            <button
              type="button"
              onClick={() => setMobileView("map")}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                mobileView === "map" ? "bg-brand-700 text-white" : "text-slate-600"
              }`}
            >
              <MapIcon className="h-3.5 w-3.5" /> Map
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr_1fr]">
          <aside className="hidden lg:block">
            <FiltersPanel value={filters} onChange={setFilters} />
          </aside>

          <section
            className={`${mobileView === "map" ? "hidden md:block" : "block"} space-y-3`}
            aria-live="polite"
          >
            <div className="flex items-center justify-between">
              <h1 className="font-display text-lg font-semibold text-slate-900">
                {query.isLoading
                  ? "Searching nearby…"
                  : `${businesses.length} businesses found`}
              </h1>
            </div>

            <div className="lg:hidden">
              <FiltersPanel value={filters} onChange={setFilters} />
            </div>

            {query.isLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-36 animate-pulse rounded-2xl bg-slate-200/70"
                  />
                ))}
              </div>
            )}

            {query.isError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <p>We couldn&apos;t load local businesses.</p>
                <button
                  type="button"
                  onClick={() => query.refetch()}
                  className="mt-2 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Try again
                </button>
              </div>
            )}

            {!query.isLoading && !query.isError && businesses.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
                <p className="font-semibold text-slate-900">No nearby businesses found.</p>
                <p className="mt-1 text-sm">
                  Try a broader search or different location.
                </p>
              </div>
            )}

            {businesses.map((b) => (
              <BusinessCard
                key={b.id}
                business={b}
                selected={selectedId === b.id}
                onSelect={() => setSelectedId(b.id)}
                userLocation={{ lat, lng }}
                searchParams={params.toString()}
              />
            ))}
          </section>

          <section
            className={`${
              mobileView === "list" ? "hidden md:block" : "block"
            } h-[420px] md:h-[calc(100vh-180px)] md:sticky md:top-20`}
          >
            <BusinessMap
              businesses={businesses}
              center={query.data?.center ?? { lat, lng }}
              selectedId={selectedId}
              userLocation={loc === "Current location" ? { lat, lng } : null}
              indiaWide={indiaWide}
              onSelect={(id) => {
                setSelectedId(id);
                setMobileView("list");
              }}
            />
            {selectedId && (
              <button
                type="button"
                className="mt-2 text-sm font-semibold text-brand-700"
                onClick={() => navigate(`/business/${selectedId}?${params}`)}
              >
                Open selected business details →
              </button>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
