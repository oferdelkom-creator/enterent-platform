import { createClient } from "@/lib/supabase/server";
import AddListingForm from "./add-listing-form";
import DeleteListingButton from "./delete-listing-button";

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
        .select("id, title, city, country, bedrooms, max_guests, airbnb_listing_url, ical_sync_status, created_at")
        .eq("host_id", host.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Your listings</h1>
      <p className="mt-1 text-sm text-slate-500">
        Add as many properties as you manage — there&apos;s no limit.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="space-y-3 md:col-span-2">
          {listings?.length ? (
            listings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">{listing.title}</p>
                  <p className="text-xs text-slate-500">
                    {[listing.city, listing.country].filter(Boolean).join(", ") || "No location set"}
                    {listing.bedrooms ? ` · ${listing.bedrooms} bd` : ""}
                    {listing.max_guests ? ` · up to ${listing.max_guests} guests` : ""}
                  </p>
                  {listing.airbnb_listing_url && (
                    <a
                      href={listing.airbnb_listing_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View on Airbnb
                    </a>
                  )}
                </div>
                <DeleteListingButton listingId={listing.id} />
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
              No listings yet — add your first one.
            </div>
          )}
        </div>

        <AddListingForm />
      </div>
    </div>
  );
}
