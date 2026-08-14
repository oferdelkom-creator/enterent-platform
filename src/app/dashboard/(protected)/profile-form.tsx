"use client";

import { useTransition } from "react";
import { updateHostProfile } from "./actions";
import PhoneInput from "@/components/phone-input";

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

export default function ProfileForm({ host }: { host: Host | null }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(() => updateHostProfile(formData));
  }

  return (
    <form action={handleSubmit} className="max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {host && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Verification status
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[host.verification_status]}`}>
            {host.verification_status}
          </span>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Full name</label>
        <input
          name="full_name"
          type="text"
          required
          defaultValue={host?.full_name ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Phone</label>
        <PhoneInput name="phone" defaultValue={host?.phone} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">City</label>
          <input
            name="city"
            type="text"
            defaultValue={host?.city ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Country</label>
          <input
            name="country"
            type="text"
            defaultValue={host?.country ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Airbnb profile URL</label>
        <input
          name="airbnb_profile_url"
          type="url"
          placeholder="https://www.airbnb.com/users/show/..."
          defaultValue={host?.airbnb_profile_url ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
