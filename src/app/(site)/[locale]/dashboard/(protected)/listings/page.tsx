import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { formatBackupPriceRange } from "@/lib/currencies";
import AddListingForm from "./add-listing-form";
import DeleteListingButton from "./delete-listing-button";
import SyncButton from "./sync-button";

const syncStatusStyles: Record<string, string> = {
  not_connected: "bg-slate-100 text-slate-500",
  ok: "bg-emerald-100 text-emerald-800",
  error: "bg-red-100 text-red-800",
};

export default async function DashboardListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: host } = await supabase
    .from("hosts")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  const { data: listings } = host
    ? await supabase
        .from("listings")
        .select(
          "id, title, city, country, neighborhood, description, photo_url, latitude, longitude, bedrooms, max_guests, airbnb_listing_url, ical_url, ical_sync_status, ical_last_synced_at, backup_price_min, backup_price_max, backup_price_note, backup_currency, created_at"
        )
        .eq("host_id", host.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const t = await getTranslations("Listings");
  const locale = await getLocale();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">{t("title")}</h1>
      <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="space-y-3 md:col-span-2">
          {listings?.length ? (
            listings.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex gap-4">
                  {listing.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={listing.photo_url}
                      alt={listing.title}
                      className="h-20 w-28 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400">
                      {t("noPhoto")}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-900">{listing.title}</p>
                    <p className="text-xs text-slate-500">
                      {[listing.neighborhood, listing.city, listing.country].filter(Boolean).join(", ") ||
                        t("noLocationSet")}
                      {listing.bedrooms ? ` · ${t("bedroomsAbbrev", { count: listing.bedrooms })}` : ""}
                      {listing.max_guests ? ` · ${t("upToGuests", { count: listing.max_guests })}` : ""}
                    </p>
                    {listing.description && (
                      <p className="mt-1 max-w-sm text-xs text-slate-500">{listing.description}</p>
                    )}
                    {(listing.backup_price_min != null || listing.backup_price_max != null) && (
                      <p className="mt-1 text-xs font-medium text-brand-teal-dark">
                        {t("backupRate", {
                          price: formatBackupPriceRange(
                            listing.backup_price_min,
                            listing.backup_price_max,
                            listing.backup_currency
                          )!,
                        })}
                        {listing.backup_price_note ? ` — ${listing.backup_price_note}` : ""}
                      </p>
                    )}
                    {listing.airbnb_listing_url && (
                      <a
                        href={listing.airbnb_listing_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {t("viewOnAirbnb")}
                      </a>
                    )}
                    {listing.latitude != null && listing.longitude != null && (
                      <a
                        href={`https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-2 text-xs text-blue-600 hover:underline"
                      >
                        {t("viewOnMap")}
                      </a>
                    )}
                    {listing.ical_url && (
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${syncStatusStyles[listing.ical_sync_status]}`}
                        >
                          {t("calendarPrefix")} {t(`syncStatus.${listing.ical_sync_status}`)}
                        </span>
                        {listing.ical_last_synced_at && (
                          <span className="text-[10px] text-slate-400">
                            {t("synced", {
                              date: new Date(listing.ical_last_synced_at).toLocaleString(locale),
                            })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {listing.ical_url && <SyncButton listingId={listing.id} />}
                  <DeleteListingButton listingId={listing.id} />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
              {t("noListingsYet")}
            </div>
          )}
        </div>

        <AddListingForm />
      </div>
    </div>
  );
}
