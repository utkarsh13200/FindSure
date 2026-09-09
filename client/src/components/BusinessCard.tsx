import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Navigation, Star } from "lucide-react";
import type { Business } from "../types";
import {
  concernLabel,
  directionsUrl,
  formatRelativeDate,
  trustBadgeClasses,
} from "../utils/format";

type Props = {
  business: Business;
  selected?: boolean;
  onSelect?: () => void;
  userLocation?: { lat: number; lng: number };
  searchParams?: string;
};

export function BusinessCard({
  business,
  selected,
  onSelect,
  userLocation,
  searchParams = "",
}: Props) {
  const { trust } = business;
  const warning =
    trust.concernState === "POTENTIALLY_MOVED" ||
    trust.concernState === "POTENTIALLY_CLOSED" ||
    trust.confidence === "low";

  return (
    <article
      className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
        selected ? "border-brand-500 ring-2 ring-brand-100" : "border-slate-200"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="w-full text-left"
        aria-pressed={selected}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900">
              {business.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              {business.rating != null && (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {business.rating.toFixed(1)}
                </span>
              )}
              {business.distanceKm != null && (
                <span>{business.distanceKm} km away</span>
              )}
              {business.openNow ? (
                <span className="text-emerald-700">Open now</span>
              ) : (
                <span className="text-slate-500">Closed now</span>
              )}
            </div>
          </div>
          <div
            className={`rounded-xl border px-2.5 py-1.5 text-center ${trustBadgeClasses(trust)}`}
          >
            <div className="text-[10px] font-semibold uppercase tracking-wide">
              Trust
            </div>
            <div className="text-lg font-bold leading-none">{trust.score}</div>
            <div className="text-[10px]">/ 100</div>
          </div>
        </div>

        {warning ? (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <div className="font-semibold">{concernLabel(trust.concernState)}</div>
              <div className="text-amber-800/90">
                Last verified: {formatRelativeDate(trust.lastVerifiedAt)}
              </div>
              {trust.relocationReports > 0 && (
                <div>
                  {trust.relocationReports} user
                  {trust.relocationReports === 1 ? "" : "s"} reported this business
                  may have moved
                </div>
              )}
              {trust.closureReports > 0 && (
                <div>
                  {trust.closureReports} report
                  {trust.closureReports === 1 ? "" : "s"} of possible closure
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Location verified {formatRelativeDate(trust.lastVerifiedAt)}
            </span>
            <span>{trust.recentConfirmations} recent confirmations</span>
          </div>
        )}
      </button>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          to={`/business/${business.id}${searchParams ? `?${searchParams}` : ""}`}
          className="rounded-xl bg-brand-700 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          {warning ? "Review details" : "View details"}
        </Link>
        <a
          href={directionsUrl(business, userLocation)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Navigation className="h-4 w-4" />
          Directions
        </a>
      </div>
    </article>
  );
}
