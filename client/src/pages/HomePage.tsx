import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ShieldCheck, TriangleAlert } from "lucide-react";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header demoMode />
      <main>
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-brand-700">
              FindSure
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Find a local service you can trust.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
              Search nearby businesses and see whether their location and
              information are still reliable — before you travel there.
            </p>
          </div>

          <div
            className="mx-auto mt-8 max-w-3xl animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            <SearchBar
              onSearch={({ q, lat, lng, locationLabel, indiaWide }) => {
                const params = new URLSearchParams({
                  q,
                  lat: String(lat),
                  lng: String(lng),
                  loc: locationLabel,
                  india: indiaWide ? "1" : "0",
                });
                navigate(`/search?${params}`);
              }}
            />
          </div>

          <div className="mx-auto mt-6 flex flex-wrap justify-center gap-2 text-sm text-slate-500">
            {["Laptop repair", "Phone repair", "AC repair", "Plumber", "Car repair"].map(
              (chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() =>
                    navigate(
                      `/search?q=${encodeURIComponent(chip)}&lat=22.5937&lng=78.9629&loc=India&india=1`
                    )
                  }
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 hover:border-brand-300 hover:text-brand-700"
                >
                  {chip}
                </button>
              )
            )}
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-t border-slate-200/80 bg-white/70 py-14"
        >
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3">
            <Feature
              icon={<ShieldCheck className="h-5 w-5 text-brand-700" />}
              title="Trust score"
              body="A transparent score from verification age, confirmations, and weighted user reports — not an opaque AI rating."
            />
            <Feature
              icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              title="Freshness signals"
              body="See when a listing was last verified and how many recent customers confirmed the business is still there."
            />
            <Feature
              icon={<TriangleAlert className="h-5 w-5 text-amber-600" />}
              title="Stale listing warnings"
              body="Relocation and closure reports are weighted over time. One report never auto-closes a listing."
            />
          </div>
          <p className="mx-auto mt-10 max-w-2xl px-4 text-center text-sm text-slate-500">
            Hypothesis: clearer freshness and verification signals help users avoid
            wasted trips to inaccurate local listings. Expected outcome and
            measurement approach are documented in the README.
          </p>
        </section>
      </main>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
        {icon}
      </div>
      <h2 className="font-display text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}
