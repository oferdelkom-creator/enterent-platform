"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { addListing } from "./actions";
import { COUNTRIES } from "@/lib/countries";
import { CITIES_BY_COUNTRY } from "@/lib/cities-by-country";

const inputClasses = "w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm";

export default function AddListingForm() {
  const [isPending, startTransition] = useTransition();
  const [country, setCountry] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addListing(formData);
      formRef.current?.reset();
      setCountry("");
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    });
  }

  const citySuggestions = CITIES_BY_COUNTRY[country] ?? [];

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-slate-900">Add a listing</h2>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Title</label>
        <input name="title" required className={inputClasses} />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Photo</label>
        {photoPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoPreview}
            alt="Listing preview"
            className="mb-1 h-32 w-full rounded-md object-cover"
          />
        )}
        <input
          name="photo"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full text-xs text-slate-500 file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Country</label>
          <select
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={inputClasses}
          >
            <option value="">Select a country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">City</label>
          <input name="city" list="listing-city-suggestions" placeholder="Start typing..." className={inputClasses} />
          <datalist id="listing-city-suggestions">
            {citySuggestions.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Neighborhood / area</label>
        <input name="neighborhood" placeholder="e.g. Florentin, Downtown" className={inputClasses} />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Bedrooms</label>
          <input name="bedrooms" type="number" min={0} className={inputClasses} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Max guests</label>
          <input name="max_guests" type="number" min={0} className={inputClasses} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Description</label>
        <textarea
          name="description"
          rows={3}
          placeholder="A short description other hosts will see..."
          className={inputClasses}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Airbnb listing URL</label>
        <input
          name="airbnb_listing_url"
          type="url"
          placeholder="https://www.airbnb.com/rooms/..."
          className={inputClasses}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">iCal URL</label>
        <input
          name="ical_url"
          type="url"
          placeholder="https://www.airbnb.com/calendar/ical/....ics"
          className={inputClasses}
        />
        <p className="text-[11px] text-slate-400">
          Find this under your Airbnb listing → Availability → Sync calendars → Export calendar.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-brand-navy py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-navy-light disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add listing"}
      </button>
    </form>
  );
}
