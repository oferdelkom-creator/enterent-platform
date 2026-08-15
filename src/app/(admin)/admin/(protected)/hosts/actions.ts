"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAdminAction } from "@/lib/audit";
import { sendHostVerifiedEmail } from "@/lib/email";

async function assertCanManageHosts(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: admin } = await supabase
    .from("admins")
    .select("can_manage_hosts")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin?.can_manage_hosts) throw new Error("Not authorized to manage hosts");

  return user;
}

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
    try {
      await sendHostVerifiedEmail(host);
    } catch (e) {
      console.error("Failed to send host verified email:", e);
    }
  }

  revalidatePath("/admin/hosts");
  revalidatePath("/admin");
}

export async function deleteHost(hostId: string) {
  const supabase = await createClient();
  const user = await assertCanManageHosts(supabase);

  const { data: host } = await supabase
    .from("hosts")
    .select("user_id, email, full_name")
    .eq("id", hostId)
    .maybeSingle();

  if (!host) throw new Error("Host not found");

  const admin = createAdminClient();

  const { data: listings } = await admin.from("listings").select("id").eq("host_id", hostId);
  const listingIds = (listings ?? []).map((l) => l.id as string);

  if (listingIds.length) {
    await admin.from("listing_bookings").delete().in("listing_id", listingIds);
    await admin.from("listings").delete().eq("host_id", hostId);
  }

  await admin.from("requests").delete().or(`requester_host_id.eq.${hostId},target_host_id.eq.${hostId}`);
  await admin.from("blog_posts").delete().eq("host_id", hostId);
  await admin.from("hosts").delete().eq("id", hostId);

  if (host.user_id) {
    await admin.auth.admin.deleteUser(host.user_id);
  }

  await logAdminAction(supabase, {
    adminId: user.id,
    adminEmail: user.email ?? null,
    action: "host.delete",
    targetTable: "hosts",
    targetId: hostId,
    details: { email: host.email, full_name: host.full_name },
  });

  revalidatePath("/admin/hosts");
  revalidatePath("/admin");
}
