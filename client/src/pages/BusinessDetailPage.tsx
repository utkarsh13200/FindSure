import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Navigation,
  Phone,
  Star,
} from "lucide-react";
import { Header } from "../components/Header";
import { ReportModal } from "../components/ReportModal";
import {
  getBusiness,
  submitConfirmation,
  submitReport,
} from "../services/api";
import {
  concernLabel,
  confidenceLabel,
  confirmationLabel,
  directionsUrl,
  formatRelativeDate,
  reportTypeLabel,
  trustBadgeClasses,
} from "../utils/format";

export function BusinessDetailPage() {
  const { id = "" } = useParams();
  const [params] = useSearchParams();
  const lat = params.get("lat") ? Number(params.get("lat")) : undefined;
  const lng = params.get("lng") ? Number(params.get("lng")) : undefined;
  const [reportOpen, setReportOpen] = useState(false);
  const [reviewSort, setReviewSort] = useState<"recent" | "highest" | "lowest">(
    "recent"
  );
  const [showReports, setShowReports] = useState(false);
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["business", id, lat, lng],
    queryFn: () => getBusiness(id, lat, lng),
    enabled: Boolean(id),
  });

  const confirmMutation = useMutation({
    mutationFn: (type: "LOCATION_CONFIRMED" | "BUSINESS_OPEN" | "ADDRESS_CORRECT" | "BUSINESS_FOUND") =>
      submitConfirmation(id, type),
    onSuccess: (data) => {
      qc.setQueryData(["business", id, lat, lng], {
        demoMode: query.data?.demoMode ?? true,
        business: data.business,
      });
    },
  });

  const reportMutation = useMutation({
    mutationFn: (payload: Parameters<typeof submitReport>[1]) =>
      submitReport(id, payload),
    onSuccess: (data) => {
      qc.setQueryData(["business", id, lat, lng], {
        demoMode: query.data?.demoMode ?? true,
        business: data.business,
      });
      qc.invalidateQueries({ queryKey: ["search"] });
    },
  });

  const business = query.data?.business;
  const reviews = useMemo(() => {
    const list = [...(business?.reviews ?? [])];
    list.sort((a, b) => {
      if (reviewSort === "highest") return b.rating - a.rating;
      if (reviewSort === "lowest") return a.rating - b.rating;
      return new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime();
    });
    return list;
  }, [business?.reviews, reviewSort]);

  return (
    <div className="min-h-screen pb-16">
      <Header demoMode={query.data?.demoMode} />
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Link
          to={`/search?${params.toString() || "q=laptop%20repair"}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to results
        </Link>

        {query.isLoading && (
          <div className="mt-6 h-64 animate-pulse rounded-2xl bg-slate-200/70" />
        )}

        {query.isError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
            Could not load this business.{" "}
            <button type="button" className="font-semibold underline" onClick={() => query.refetch()}>
              Try again
            </button>
          </div>
        )}

        {business && (
          <article className="mt-6 space-y-6 animate-fade-up">
            <header>
              <h1 className="font-display text-3xl font-bold text-slate-900">
                {business.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                {business.rating != null && (
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {business.rating.toFixed(1)} · {business.reviewCount} Google reviews
                  </span>
                )}
                {business.distanceKm != null && <span>{business.distanceKm} km away</span>}
              </div>
            </header>

            <section
              className={`rounded-2xl border p-4 ${trustBadgeClasses(business.trust)}`}
            >
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide">
                    Trust score
                  </div>
                  <div className="font-display text-4xl font-bold">
                    {business.trust.score}
                    <span className="text-lg font-semibold">/100</span>
                  </div>
                  <div className="mt-1 text-sm font-semibold uppercase tracking-wide">
                    {confidenceLabel(business.trust.confidence)}
                  </div>
                </div>
                {business.trust.concernState !== "NO_CONCERN" && (
                  <div className="rounded-xl bg-white/70 px-3 py-2 text-sm font-semibold">
                    {concernLabel(business.trust.concernState)}
                  </div>
                )}
              </div>

              <ul className="mt-4 space-y-1.5 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Location verified {formatRelativeDate(business.trust.lastVerifiedAt)}
                </li>
                <li>✓ {business.trust.recentConfirmations} recent customer confirmations</li>
                <li>
                  {business.trust.relocationReports === 0
                    ? "✓ No relocation reports"
                    : `⚠ ${business.trust.relocationReports} relocation reports`}
                </li>
                <li>
                  {business.trust.closureReports === 0
                    ? "✓ No closure reports"
                    : `🚨 ${business.trust.closureReports} closure reports`}
                </li>
              </ul>

              {(business.trust.concernState === "POTENTIALLY_MOVED" ||
                business.trust.relocationReports > 0) && (
                <div className="mt-4 rounded-xl border border-amber-300/60 bg-white/80 p-3 text-sm text-amber-950">
                  <p className="font-semibold">⚠ Location may be outdated</p>
                  <p className="mt-1">
                    {business.trust.relocationReports} user
                    {business.trust.relocationReports === 1 ? "" : "s"} reported that
                    this business has moved.
                  </p>
                  {business.reports[0] && (
                    <p className="mt-1 text-amber-900/80">
                      Last report: {formatRelativeDate(business.reports[0].createdAt)}
                    </p>
                  )}
                  <button
                    type="button"
                    className="mt-2 font-semibold text-amber-900 underline"
                    onClick={() => setShowReports((v) => !v)}
                  >
                    {showReports ? "Hide reports" : "See reports"}
                  </button>
                </div>
              )}

              {business.trust.concernState === "POTENTIALLY_CLOSED" && (
                <div className="mt-4 rounded-xl border border-red-200 bg-white/80 p-3 text-sm text-red-900">
                  <p className="font-semibold">🚨 Possible closure</p>
                  <p className="mt-1">
                    {business.trust.closureReports} recent users reported that this
                    business may be closed.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="font-display text-lg font-semibold">Location</h2>
              <p className="mt-1 text-slate-700">{business.address}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={
                    business.googleMapsUrl ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ExternalLink className="h-4 w-4" /> Open in Google Maps
                </a>
                <a
                  href={directionsUrl(
                    business,
                    lat != null && lng != null ? { lat, lng } : undefined
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-700 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600"
                >
                  <Navigation className="h-4 w-4" /> Get directions
                </a>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="font-display text-lg font-semibold">Contact</h2>
              <div className="mt-2 space-y-2 text-sm text-slate-700">
                {business.phone ? (
                  <a href={`tel:${business.phone}`} className="inline-flex items-center gap-2 hover:text-brand-700">
                    <Phone className="h-4 w-4" /> {business.phone}
                  </a>
                ) : (
                  <p>Phone not listed</p>
                )}
                {business.website ? (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-brand-700 hover:underline"
                  >
                    Website
                  </a>
                ) : (
                  <p>Website not listed</p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-semibold">
                  Recent confirmations
                </h2>
                <button
                  type="button"
                  disabled={confirmMutation.isPending}
                  onClick={() => confirmMutation.mutate("LOCATION_CONFIRMED")}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-60"
                >
                  {confirmMutation.isPending ? "Saving…" : "I confirm this location"}
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {business.confirmations.length === 0 && (
                  <li className="text-sm text-slate-500">No confirmations yet.</li>
                )}
                {business.confirmations.map((c, i) => (
                  <li
                    key={c.id ?? i}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
                  >
                    <span className="inline-flex items-center gap-2 text-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      {confirmationLabel(c.type)}
                    </span>
                    <span className="text-slate-500">
                      {formatRelativeDate(c.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {showReports && (
              <section className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="font-display text-lg font-semibold">Reports</h2>
                <ul className="mt-3 space-y-2">
                  {business.reports.map((r) => (
                    <li key={r.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                      <div className="font-semibold">{reportTypeLabel(r.type)}</div>
                      {r.description && (
                        <p className="mt-1 text-slate-600">{r.description}</p>
                      )}
                      <p className="mt-1 text-xs text-slate-500">
                        {formatRelativeDate(r.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-semibold">Customer reviews</h2>
                <label className="text-sm text-slate-600">
                  Sort{" "}
                  <select
                    value={reviewSort}
                    onChange={(e) =>
                      setReviewSort(e.target.value as typeof reviewSort)
                    }
                    className="ml-1 rounded-lg border border-slate-200 px-2 py-1"
                  >
                    <option value="recent">Most recent</option>
                    <option value="highest">Highest rated</option>
                    <option value="lowest">Lowest rated</option>
                  </select>
                </label>
              </div>
              <ul className="mt-3 space-y-3">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-xl border border-slate-100 p-3">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-semibold text-slate-900">{r.author}</span>
                      <span className="text-slate-500">
                        {formatRelativeDate(r.reviewDate)}
                      </span>
                    </div>
                    <div className="mt-1 text-amber-500">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </div>
                    <p className="mt-1 text-sm text-slate-700">{r.text}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <h2 className="font-display text-lg font-semibold">
                Report incorrect information
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Help others avoid a wasted trip if this listing looks wrong.
              </p>
              <button
                type="button"
                onClick={() => setReportOpen(true)}
                className="mt-3 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Report a problem
              </button>
            </section>
          </article>
        )}
      </div>

      {business && (
        <ReportModal
          open={reportOpen}
          businessName={business.name}
          onClose={() => setReportOpen(false)}
          onSubmit={async (payload) => {
            await reportMutation.mutateAsync(payload);
          }}
        />
      )}
    </div>
  );
}
