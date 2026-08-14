"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAdminAction } from "@/lib/audit";
import { sendHostVerifiedEmail } from "@/lib/email";

export async function setHostVerificationStatus(
  hostId: string,
  status: "verified" | "rejected"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: host } = await supabase
    .from("hosts")
    .update({
      verification_status: status,
      verified_at: new Date().toISOString(),
      verified_by: user?.id ?? null,
    })
    .eq("id", hostId)
    .select("email, full_name")
    .single();

  await logAdminAction(supabase, {
    adminId: user?.id ?? null,
    adminEmail: user?.email ?? null,
    action: status === "verified" ? "host.verify" : "host.reject",
    targetTable: "hosts",
    targetId: hostId,
  });

  if (status === "verified" && host) {
    await sendHostVerifiedEmail(host);
  }

  revalidatePath("/admin/hosts");
  revalidatePath("/admin");
}
