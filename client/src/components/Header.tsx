import { Link, NavLink } from "react-router-dom";
import { MapPinned } from "lucide-react";

type HeaderProps = {
  demoMode?: boolean;
};

export function Header({ demoMode }: HeaderProps) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition ${
      isActive ? "text-brand-700" : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
            <MapPinned className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="font-display block text-lg font-bold leading-none text-slate-900">
              FindSure
            </span>
            <span className="text-xs text-slate-500">Know before you go.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          <NavLink to="/" end className={linkClass}>
            Search
          </NavLink>
          <NavLink to="/search?q=laptop%20repair" className={linkClass}>
            Businesses
          </NavLink>
          <a href="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            How it works
          </a>
        </nav>

        {demoMode ? (
          <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800">
            Demo data
          </span>
        ) : (
          <span className="hidden text-xs text-slate-400 sm:inline">Live Places</span>
        )}
      </div>
    </header>
  );
}
