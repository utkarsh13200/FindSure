type FiltersState = {
  sort: string;
  trustHigh: boolean;
  trustMedium: boolean;
  trustNeeds: boolean;
  openNow: boolean;
  recentlyVerified: boolean;
  outdated: boolean;
  minRating: number | null;
  maxDistance: number | null;
};

type Props = {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
};

export type { FiltersState };

export function FiltersPanel({ value, onChange }: Props) {
  function patch(partial: Partial<FiltersState>) {
    onChange({ ...value, ...partial });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div>
        <label htmlFor="sort" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Sort
        </label>
        <select
          id="sort"
          value={value.sort}
          onChange={(e) => patch({ sort: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="recommended">Recommended</option>
          <option value="nearest">Nearest</option>
          <option value="trust">Highest trust</option>
          <option value="rating">Highest rated</option>
          <option value="recently_verified">Recently verified</option>
        </select>
      </div>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Trust
        </legend>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.trustHigh}
              onChange={(e) => patch({ trustHigh: e.target.checked })}
            />
            High confidence
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.trustMedium}
              onChange={(e) => patch({ trustMedium: e.target.checked })}
            />
            Medium confidence
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.trustNeeds}
              onChange={(e) => patch({ trustNeeds: e.target.checked })}
            />
            Needs verification
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Filters
        </legend>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.openNow}
              onChange={(e) => patch({ openNow: e.target.checked })}
            />
            Open now
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.recentlyVerified}
              onChange={(e) => patch({ recentlyVerified: e.target.checked })}
            />
            Recently verified
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.outdated}
              onChange={(e) => patch({ outdated: e.target.checked })}
            />
            Potentially outdated
          </label>
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="min-rating" className="mb-1 block text-xs font-semibold text-slate-500">
            Min rating
          </label>
          <select
            id="min-rating"
            value={value.minRating ?? ""}
            onChange={(e) =>
              patch({
                minRating: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full rounded-xl border border-slate-200 px-2 py-2 text-sm"
          >
            <option value="">Any</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="4.5">4.5+</option>
          </select>
        </div>
        <div>
          <label htmlFor="max-distance" className="mb-1 block text-xs font-semibold text-slate-500">
            Distance
          </label>
          <select
            id="max-distance"
            value={value.maxDistance ?? ""}
            onChange={(e) =>
              patch({
                maxDistance: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full rounded-xl border border-slate-200 px-2 py-2 text-sm"
          >
            <option value="">Any</option>
            <option value="2">Within 2 km</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export const defaultFilters: FiltersState = {
  sort: "recommended",
  trustHigh: false,
  trustMedium: false,
  trustNeeds: false,
  openNow: false,
  recentlyVerified: false,
  outdated: false,
  minRating: null,
  maxDistance: null,
};
