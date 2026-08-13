import type { SupabaseClient } from "@supabase/supabase-js";

export async function logAdminAction(
  supabase: SupabaseClient,
  params: {
    adminId: string | null;
    adminEmail: string | null;
    action: string;
    targetTable?: string;
    targetId?: string;
    details?: Record<string, unknown>;
  }
) {
  await supabase.from("admin_audit_log").insert({
    admin_id: params.adminId,
    admin_email: params.adminEmail,
    action: params.action,
    target_table: params.targetTable ?? null,
    target_id: params.targetId ?? null,
    details: params.details ?? null,
  });
}
