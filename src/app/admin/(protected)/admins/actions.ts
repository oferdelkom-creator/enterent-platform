"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAdminAction } from "@/lib/audit";

async function requireCanManageAdmins() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id, can_manage_admins")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin?.can_manage_admins) throw new Error("Not authorized to manage admins");

  return { supabase, user };
}

export async function inviteAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "assistant") as "owner" | "assistant";
  const canManageHosts = formData.get("can_manage_hosts") === "on";
  const canManageRequests = formData.get("can_manage_requests") === "on";
  const canManageAdmins = formData.get("can_manage_admins") === "on";

  if (!email) throw new Error("Email is required");

  const { supabase, user } = await requireCanManageAdmins();

  const { data: invite, error } = await supabase
    .from("admin_invites")
    .insert({
      email,
      role,
      can_manage_hosts: canManageHosts,
      can_manage_requests: canManageRequests,
      can_manage_admins: canManageAdmins,
      invited_by: user.id,
    })
    .select("id, token")
    .single();

  if (error) throw error;

  await logAdminAction(supabase, {
    adminId: user.id,
    adminEmail: user.email ?? null,
    action: "admin.invite",
    targetTable: "admin_invites",
    targetId: invite.id,
    details: { email, role },
  });

  revalidatePath("/admin/admins");

  return { token: invite.token as string };
}

export async function revokeAdmin(adminUserId: string) {
  const { supabase, user } = await requireCanManageAdmins();

  if (adminUserId === user.id) throw new Error("Cannot remove yourself");

  await supabase.from("admins").delete().eq("user_id", adminUserId);

  await logAdminAction(supabase, {
    adminId: user.id,
    adminEmail: user.email ?? null,
    action: "admin.revoke",
    targetTable: "admins",
    targetId: adminUserId,
  });

  revalidatePath("/admin/admins");
}
