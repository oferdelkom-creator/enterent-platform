"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAdminAction } from "@/lib/audit";

export async function setHostVerificationStatus(
  hostId: string,
  status: "verified" | "rejected"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase
    .from("hosts")
    .update({
      verification_status: status,
      verified_at: new Date().toISOString(),
      verified_by: user?.id ?? null,
    })
    .eq("id", hostId);

  await logAdminAction(supabase, {
    adminId: user?.id ?? null,
    adminEmail: user?.email ?? null,
    action: status === "verified" ? "host.verify" : "host.reject",
    targetTable: "hosts",
    targetId: hostId,
  });

  revalidatePath("/admin/hosts");
  revalidatePath("/admin");
}
