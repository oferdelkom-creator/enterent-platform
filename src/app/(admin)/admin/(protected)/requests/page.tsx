import { createClient } from "@/lib/supabase/server";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-emerald-100 text-emerald-800",
  declined: "bg-red-100 text-red-800",
  cancelled: "bg-slate-100 text-slate-600",
  completed: "bg-blue-100 text-blue-800",
};

const typeLabels: Record<string, string> = {
  swap: "Swap",
  backup: "Emergency backup",
};

export default async function AdminRequestsPage() {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("requests")
    .select(
      `id, type, status, start_date, end_date, created_at,
       requester:requester_host_id ( full_name ),
       target:target_host_id ( full_name )`
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Requests</h1>
      <p className="mt-1 text-sm text-slate-500">
        Swap and emergency backup requests between hosts.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Requester</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests?.length ? (
              requests.map((req) => (
                <tr key={req.id}>
                  <td className="px-4 py-3 text-slate-700">{typeLabels[req.type] ?? req.type}</td>
                  <td className="px-4 py-3 text-slate-900">
                    {(req.requester as unknown as { full_name: string } | null)?.full_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-900">
                    {(req.target as unknown as { full_name: string } | null)?.full_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {req.start_date && req.end_date
                      ? `${req.start_date} → ${req.end_date}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusStyles[req.status] ?? ""
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                  No requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
