import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { formatBackupPriceRange } from "@/lib/currencies";
import RequestPanel from "./request-panel";

export default async function FindHostsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; country?: string }>;
}) {
  const { city, country } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: host } = await supabase
    .from("hosts")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  const { data: ownListings } = host
    ? await supabase.from("listings").select("id, title").eq("host_id", host.id)
    : { data: [] };

  let query = supabase.from("discoverable_listings").select("*").order("created_at", { ascending: false });

  if (city) query = query.ilike("city", `%${city}%`);
  if (country) query = query.ilike("country", `%${country}%`);

  const { data: listings } = await query;

  const otherListings = (listings ?? []).filter((l) => l.host_id !== host?.id);

  const t = await getTranslations("Find");

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">{t("title")}</h1>
      <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>

      <form className="mt-4 flex gap-2">
        <input
          name="city"
          defaultValue={city}
          placeholder={t("city")}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        <input
          name="country"
          defaultValue={country}
          placeholder={t("country")}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        <button type="submit" className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white">
          {t("filter")}
        </button>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {otherListings.length ? (
          otherListings.map((listing) => (
            <div
              key={listing.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              {listing.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={listing.photo_url} alt={listing.title} className="h-40 w-full object-cover" />
              ) : (
                <div className="flex h-40 w-full items-center justify-center bg-slate-100 text-xs text-slate-400">
                  {t("noPhotoYet")}
                </div>
              )}
              <div className="space-y-2 p-4">
                <div>
                  <p className="font-medium text-slate-900">{listing.title}</p>
                  <p className="text-xs text-slate-500">
                    {[listing.neighborhood, listing.city, listing.country].filter(Boolean).join(", ") ||
                      t("noLocationSet")}
                    {listing.bedrooms ? ` · ${t("bedroomsAbbrev", { count: listing.bedrooms })}` : ""}
                    {listing.max_guests ? ` · ${t("upToGuests", { count: listing.max_guests })}` : ""}
                  </p>
                  {listing.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">{listing.description}</p>
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
                  <p className="mt-1 text-xs text-slate-400">{t("hostedBy", { name: listing.host_name })}</p>
                  <div className="mt-1 flex gap-3">
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
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {t("viewOnMap")}
                      </a>
                    )}
                  </div>
                </div>
                {host && (
                  <RequestPanel
                    targetHostId={listing.host_id}
                    targetListingId={listing.id}
                    ownListings={ownListings ?? []}
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 sm:col-span-2">
            {t("noHostsYet")}
          </div>
        )}
      </div>
    </div>
  );
}
