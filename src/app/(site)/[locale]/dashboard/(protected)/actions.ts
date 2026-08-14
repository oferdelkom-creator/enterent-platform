"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateHostProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "").trim() || null;
  const airbnbProfileUrl = String(formData.get("airbnb_profile_url") ?? "").trim() || null;

  const { data: existing } = await supabase
    .from("hosts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("hosts")
      .update({
        full_name: fullName,
        phone,
        city,
        country,
        airbnb_profile_url: airbnbProfileUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
  } else {
    await supabase.from("hosts").insert({
      user_id: user.id,
      full_name: fullName,
      email: user.email ?? "",
      phone,
      city,
      country,
      airbnb_profile_url: airbnbProfileUrl,
    });
  }

  revalidatePath("/dashboard");
}
