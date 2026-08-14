import { createClient } from "@/lib/supabase/server";

async function getStats() {
  const supabase = await createClient();

  const [hosts, pendingHosts, listings, pendingRequests] = await Promise.all([
    supabase.from("hosts").select("*", { count: "exact", head: true }),
    supabase
      .from("hosts")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "pending"),
    supabase.from("listings").select("*", { count: "exact", head: true }),
    supabase
      .from("requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  return {
    totalHosts: hosts.count ?? 0,
    pendingHosts: pendingHosts.count ?? 0,
    totalListings: listings.count ?? 0,
    pendingRequests: pendingRequests.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total hosts", value: stats.totalHosts },
    { label: "Pending verification", value: stats.pendingHosts },
    { label: "Listings", value: stats.totalListings },
    { label: "Pending requests", value: stats.pendingRequests },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Overview of the EnterRent platform.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
