import { createClient } from "@/lib/supabase/server";

export default async function AdminAuditPage() {
  const supabase = await createClient();
  const { data: logs } = await supabase
    .from("admin_audit_log")
    .select("id, admin_email, action, target_table, target_id, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Audit log</h1>
      <p className="mt-1 text-sm text-slate-500">Recent actions taken by admins.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs?.length ? (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate-900">{log.admin_email ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{log.action}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {log.target_table ? `${log.target_table}:${log.target_id?.slice(0, 8)}` : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">
                  No activity yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
