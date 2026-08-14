"use client";

import { useEffect, useState } from "react";
import { useTransition } from "react";
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

export default function ProfileForm({ host }: { host: Host | null }) {
  const [isPending, startTransition] = useTransition();
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
    startTransition(() => updateHostProfile(formData));
  }

  return (
    <form
      action={handleSubmit}
      className="max-w-xl space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {host && (
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Verification status
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[host.verification_status]}`}
          >
            {host.verification_status}
          </span>
        </div>
      )}

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

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-brand-navy py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-navy-light disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
