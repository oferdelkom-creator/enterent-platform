"use client";

import { useRef, useTransition } from "react";
import { addListing } from "./actions";

export default function AddListingForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addListing(formData);
      formRef.current?.reset();
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-slate-900">Add a listing</h2>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Title</label>
        <input name="title" required className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">City</label>
          <input name="city" className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Country</label>
          <input name="country" className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Bedrooms</label>
          <input name="bedrooms" type="number" min={0} className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Max guests</label>
          <input name="max_guests" type="number" min={0} className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Airbnb listing URL</label>
        <input
          name="airbnb_listing_url"
          type="url"
          placeholder="https://www.airbnb.com/rooms/..."
          className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">iCal URL</label>
        <input
          name="ical_url"
          type="url"
          placeholder="https://www.airbnb.com/calendar/ical/....ics"
          className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        <p className="text-[11px] text-slate-400">
          Find this under your Airbnb listing → Availability → Sync calendars → Export calendar.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-slate-900 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add listing"}
      </button>
    </form>
  );
}
