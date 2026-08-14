"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fetchIcalBookings } from "@/lib/ical";

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

async function uploadListingPhoto(
  supabase: Awaited<ReturnType<typeof createClient>>,
  hostId: string,
  photo: File
): Promise<string | null> {
  if (!photo || photo.size === 0) return null;

  const ext = photo.name.includes(".") ? photo.name.split(".").pop() : "jpg";
  const path = `${hostId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("listing-photos")
    .upload(path, photo, { contentType: photo.type || undefined });

  if (uploadError) {
    console.error("Failed to upload listing photo:", uploadError.message);
    return null;
  }

  const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);
  return data.publicUrl;
}

export async function addListing(formData: FormData) {
  const supabase = await createClient();
  const hostId = await getOwnHostId(supabase);

  const title = String(formData.get("title") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "").trim() || null;
  const neighborhood = String(formData.get("neighborhood") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const airbnbListingUrl = String(formData.get("airbnb_listing_url") ?? "").trim() || null;
  const icalUrl = String(formData.get("ical_url") ?? "").trim() || null;
  const maxGuests = formData.get("max_guests") ? Number(formData.get("max_guests")) : null;
  const bedrooms = formData.get("bedrooms") ? Number(formData.get("bedrooms")) : null;
  const photo = formData.get("photo") as File | null;
  const latitude = formData.get("latitude") ? Number(formData.get("latitude")) : null;
  const longitude = formData.get("longitude") ? Number(formData.get("longitude")) : null;

  if (!title) throw new Error("Title is required");

  const photoUrl = photo ? await uploadListingPhoto(supabase, hostId, photo) : null;

  await supabase.from("listings").insert({
    host_id: hostId,
    title,
    city,
    country,
    neighborhood,
    description,
    photo_url: photoUrl,
    airbnb_listing_url: airbnbListingUrl,
    ical_url: icalUrl,
    max_guests: maxGuests,
    bedrooms,
    latitude,
    longitude,
  });

  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard/find");
}

export async function deleteListing(listingId: string) {
  const supabase = await createClient();
  await getOwnHostId(supabase);

  await supabase.from("listings").delete().eq("id", listingId);

  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard/find");
}

export async function syncListingCalendar(listingId: string) {
  const supabase = await createClient();
  const hostId = await getOwnHostId(supabase);

  const { data: listing } = await supabase
    .from("listings")
    .select("id, ical_url")
    .eq("id", listingId)
    .eq("host_id", hostId)
    .maybeSingle();

  if (!listing) throw new Error("Listing not found");
  if (!listing.ical_url) throw new Error("No iCal URL set for this listing");

  try {
    const bookings = await fetchIcalBookings(listing.ical_url);

    await supabase.from("listing_bookings").delete().eq("listing_id", listingId);

    if (bookings.length) {
      await supabase.from("listing_bookings").insert(
        bookings.map((b) => ({
          listing_id: listingId,
          start_date: b.start,
          end_date: b.end,
          source: "ical",
        }))
      );
    }

    await supabase
      .from("listings")
      .update({ ical_last_synced_at: new Date().toISOString(), ical_sync_status: "ok" })
      .eq("id", listingId);
  } catch {
    await supabase
      .from("listings")
      .update({ ical_last_synced_at: new Date().toISOString(), ical_sync_status: "error" })
      .eq("id", listingId);
    throw new Error("Failed to sync calendar — check the iCal URL");
  }

  revalidatePath("/dashboard/listings");
}
