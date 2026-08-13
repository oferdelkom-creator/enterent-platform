import { createClient } from "@/lib/supabase/server";
import InviteForm from "./invite-form";
import RevokeButton from "./revoke-button";

export default async function AdminAdminsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: me } = await supabase
    .from("admins")
    .select("can_manage_admins")
    .eq("user_id", user!.id)
    .maybeSingle();

  const { data: admins } = await supabase
    .from("admins")
    .select("user_id, email, role, can_manage_hosts, can_manage_requests, can_manage_admins, created_at")
    .order("created_at", { ascending: true });

  const { data: pendingInvites } = me?.can_manage_admins
    ? await supabase
        .from("admin_invites")
        .select("id, email, role, created_at, expires_at")
        .is("accepted_at", null)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Admins</h1>
      <p className="mt-1 text-sm text-slate-500">
        Team members with access to this dashboard and their permissions.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Permissions</th>
                  {me?.can_manage_admins && <th className="px-4 py-3">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins?.map((admin) => (
                  <tr key={admin.user_id}>
                    <td className="px-4 py-3 text-slate-900">{admin.email}</td>
                    <td className="px-4 py-3 text-slate-600 capitalize">{admin.role}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {[
                        admin.can_manage_hosts && "hosts",
                        admin.can_manage_requests && "requests",
                        admin.can_manage_admins && "admins",
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </td>
                    {me?.can_manage_admins && (
                      <td className="px-4 py-3">
                        {admin.user_id !== user!.id && <RevokeButton userId={admin.user_id} />}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {me?.can_manage_admins && !!pendingInvites?.length && (
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Pending invites
              </div>
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-slate-100">
                  {pendingInvites.map((inv) => (
                    <tr key={inv.id}>
                      <td className="px-4 py-3 text-slate-900">{inv.email}</td>
                      <td className="px-4 py-3 text-slate-600 capitalize">{inv.role}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        expires {new Date(inv.expires_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {me?.can_manage_admins && <InviteForm />}
      </div>
    </div>
  );
}
