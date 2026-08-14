"use client";

import { useEffect, useState, useTransition } from "react";
import { updateHostProfile } from "./actions";
import PhoneInput from "@/components/phone-input";
import { COUNTRIES } from "@/lib/countries";
import { CITIES_BY_COUNTRY } from "@/lib/cities-by-country";
import { detectDefaultCountryName } from "@/lib/country-codes";

type Host = {
  full_name: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  airbnb_profile_url: string | null;
  verification_status: string;
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  verified: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

const inputClasses =
  "w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal";

function StatusBadge({ status }: { status: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Verification status
      </span>
      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>{status}</span>
    </div>
  );
}

function ProfileView({ host, onEdit }: { host: Host; onEdit: () => void }) {
  const location = [host.city, host.country].filter(Boolean).join(", ");

  return (
    <div className="max-w-xl space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <StatusBadge status={host.verification_status} />

      <dl className="space-y-4">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Full name</dt>
          <dd className="mt-0.5 text-sm text-slate-900">{host.full_name || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</dt>
          <dd className="mt-0.5 text-sm text-slate-900">{host.phone || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</dt>
          <dd className="mt-0.5 text-sm text-slate-900">{location || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Airbnb profile</dt>
          <dd className="mt-0.5 text-sm">
            {host.airbnb_profile_url ? (
              <a
                href={host.airbnb_profile_url}
                target="_blank"
                rel="noreferrer"
                className="text-brand-teal-dark hover:underline"
              >
                {host.airbnb_profile_url}
              </a>
            ) : (
              <span className="text-slate-900">—</span>
            )}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onEdit}
        className="w-full rounded-md border border-brand-navy py-2.5 text-sm font-medium text-brand-navy transition-colors hover:bg-slate-50"
      >
        Edit profile
      </button>
    </div>
  );
}

export default function ProfileForm({ host }: { host: Host | null }) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(!host?.full_name);
  const [country, setCountry] = useState(host?.country ?? "");

  useEffect(() => {
    if (!host?.country) {
      const detected = detectDefaultCountryName();
      if (detected) setCountry(detected);
    }
  }, [host?.country]);

  const countryOptions =
    country && !COUNTRIES.includes(country) ? [country, ...COUNTRIES] : COUNTRIES;
  const citySuggestions = CITIES_BY_COUNTRY[country] ?? [];

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateHostProfile(formData);
      setEditing(false);
    });
  }

  if (!editing && host) {
    return <ProfileView host={host} onEdit={() => setEditing(true)} />;
  }

  return (
    <form
      action={handleSubmit}
      className="max-w-xl space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {host && <StatusBadge status={host.verification_status} />}

      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Contact details
        </p>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Full name</label>
          <input
            name="full_name"
            type="text"
            required
            defaultValue={host?.full_name ?? ""}
            className={inputClasses}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <PhoneInput name="phone" defaultValue={host?.phone} />
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Country</label>
            <select
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClasses}
            >
              <option value="">Select a country</option>
              {countryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">City</label>
            <input
              name="city"
              type="text"
              list="city-suggestions"
              placeholder="Start typing..."
              defaultValue={host?.city ?? ""}
              className={inputClasses}
            />
            <datalist id="city-suggestions">
              {citySuggestions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Airbnb hosting
        </p>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Airbnb profile URL</label>
          <input
            name="airbnb_profile_url"
            type="url"
            placeholder="https://www.airbnb.com/users/show/..."
            defaultValue={host?.airbnb_profile_url ?? ""}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="flex gap-3">
        {host?.full_name && (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="flex-1 rounded-md border border-slate-300 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-md bg-brand-navy py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-navy-light disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save profile"}
        </button>
      </div>
    </form>
  );
}
