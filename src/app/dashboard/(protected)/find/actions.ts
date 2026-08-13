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

export async function createRequest(formData: FormData) {
  const supabase = await createClient();
  const requesterHostId = await getOwnHostId(supabase);

  const type = String(formData.get("type") ?? "swap") as "swap" | "backup";
  const targetHostId = String(formData.get("target_host_id") ?? "");
  const targetListingId = String(formData.get("target_listing_id") ?? "") || null;
  const requesterListingId = String(formData.get("requester_listing_id") ?? "") || null;
  const startDate = String(formData.get("start_date") ?? "") || null;
  const endDate = String(formData.get("end_date") ?? "") || null;
  const message = String(formData.get("message") ?? "").trim() || null;

  if (!targetHostId) throw new Error("Missing target host");
  if (requesterHostId === targetHostId) throw new Error("Cannot request yourself");

  await supabase.from("requests").insert({
    type,
    requester_host_id: requesterHostId,
    requester_listing_id: requesterListingId,
    target_host_id: targetHostId,
    target_listing_id: targetListingId,
    start_date: startDate,
    end_date: endDate,
    message,
  });

  revalidatePath("/dashboard/find");
  revalidatePath("/dashboard/requests");
}
