"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateRequestStatus(
  requestId: string,
  status: "accepted" | "declined" | "cancelled"
) {
  const supabase = await createClient();
  await supabase
    .from("requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", requestId);

  revalidatePath("/dashboard/requests");
}
