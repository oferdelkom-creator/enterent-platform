import { createClient } from "@/lib/supabase/server";
import HostActions from "./host-actions";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  verified: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

export default async function AdminHostsPage() {
  const supabase = await createClient();
  const { data: hosts } = await supabase
    .from("hosts")
    .select("id, full_name, email, city, country, airbnb_profile_url, verification_status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Hosts</h1>
      <p className="mt-1 text-sm text-slate-500">Review and verify registered Airbnb hosts.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Airbnb</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {hosts?.length ? (
              hosts.map((host) => (
                <tr key={host.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{host.full_name}</p>
                    <p className="text-xs text-slate-500">{host.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {[host.city, host.country].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {host.airbnb_profile_url ? (
                      <a
                        href={host.airbnb_profile_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View listing
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusStyles[host.verification_status] ?? ""
                      }`}
                    >
                      {host.verification_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <HostActions hostId={host.id} hostName={host.full_name} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                  No hosts registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
