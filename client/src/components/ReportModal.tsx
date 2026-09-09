import type { ReportType } from "../types";
import { reportTypeLabel } from "../utils/format";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";

const REPORT_OPTIONS: ReportType[] = [
  "MOVED",
  "CLOSED",
  "DOES_NOT_EXIST",
  "WRONG_ADDRESS",
  "WRONG_PHONE",
  "WRONG_CATEGORY",
  "OTHER",
];

type Props = {
  open: boolean;
  businessName: string;
  onClose: () => void;
  onSubmit: (payload: {
    type: ReportType;
    description?: string;
    reporterName?: string;
    reporterEmail?: string;
  }) => Promise<void>;
};

export function ReportModal({ open, businessName, onClose, onSubmit }: Props) {
  const titleId = useId();
  const firstField = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<ReportType>("MOVED");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) {
      setDone(false);
      setError(null);
      setTimeout(() => firstField.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        type,
        description: description.trim() || undefined,
        reporterName: reporterName.trim() || undefined,
        reporterEmail: reporterEmail.trim() || undefined,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id={titleId} className="font-display text-xl font-bold text-slate-900">
              {done ? "Report submitted" : "Report incorrect information"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{businessName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {done ? (
          <div className="space-y-4">
            <p className="text-slate-700">
              Thanks for helping keep local information accurate. Your report will
              be included in this business&apos;s verification history.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-slate-900">
                What&apos;s wrong?
              </legend>
              <div className="space-y-2">
                {REPORT_OPTIONS.map((opt, i) => (
                  <label
                    key={opt}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 hover:bg-slate-50"
                  >
                    <input
                      ref={i === 0 ? firstField : undefined}
                      type="radio"
                      name="report-type"
                      value={opt}
                      checked={type === opt}
                      onChange={() => setType(opt)}
                      className="accent-brand-700"
                    />
                    <span className="text-sm text-slate-800">
                      {reportTypeLabel(opt)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="report-desc" className="mb-1 block text-sm font-semibold">
                Additional information
              </label>
              <textarea
                id="report-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Optional details that help verification"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="report-name" className="mb-1 block text-sm font-semibold">
                  Your name
                </label>
                <input
                  id="report-name"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label htmlFor="report-email" className="mb-1 block text-sm font-semibold">
                  Email
                </label>
                <input
                  id="report-email"
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit report"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
