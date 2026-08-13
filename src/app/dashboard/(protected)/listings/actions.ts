"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function getOwnHostId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: host } = await supabase
    .from("hosts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!host) throw new Error("Complete your profile first");

  return host.id as string;
}

export async function addListing(formData: FormData) {
  const supabase = await createClient();
  const hostId = await getOwnHostId(supabase);

  const title = String(formData.get("title") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "").trim() || null;
  const airbnbListingUrl = String(formData.get("airbnb_listing_url") ?? "").trim() || null;
  const icalUrl = String(formData.get("ical_url") ?? "").trim() || null;
  const maxGuests = formData.get("max_guests") ? Number(formData.get("max_guests")) : null;
  const bedrooms = formData.get("bedrooms") ? Number(formData.get("bedrooms")) : null;

  if (!title) throw new Error("Title is required");

  await supabase.from("listings").insert({
    host_id: hostId,
    title,
    city,
    country,
    airbnb_listing_url: airbnbListingUrl,
    ical_url: icalUrl,
    max_guests: maxGuests,
    bedrooms,
  });

  revalidatePath("/dashboard/listings");
}

export async function deleteListing(listingId: string) {
  const supabase = await createClient();
  await getOwnHostId(supabase);

  await supabase.from("listings").delete().eq("id", listingId);

  revalidatePath("/dashboard/listings");
}
