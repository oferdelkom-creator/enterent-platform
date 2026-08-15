import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./profile-form";

export default async function DashboardProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: host } = await supabase
    .from("hosts")
    .select("id, full_name, phone, city, country, airbnb_profile_url, verification_status")
    .eq("user_id", user!.id)
    .maybeSingle();

  const [{ count: listingsCount }, { count: pendingRequestsCount }] = host
    ? await Promise.all([
        supabase.from("listings").select("id", { count: "exact", head: true }).eq("host_id", host.id),
        supabase
          .from("requests")
          .select("id", { count: "exact", head: true })
          .eq("target_host_id", host.id)
          .eq("status", "pending"),
      ])
    : [{ count: 0 }, { count: 0 }];

  const t = await getTranslations("Profile");
  const tNav = await getTranslations("DashboardNav");

  const quickLinks = [
    { href: "/dashboard/listings", label: tNav("myListings") },
    { href: "/dashboard/find", label: tNav("findHosts") },
    { href: "/dashboard/requests", label: tNav("requests") },
    { href: "/dashboard/blog", label: tNav("blog") },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">{t("title")}</h1>
      <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>

      <div className="mt-6 grid max-w-xl grid-cols-2 gap-4">
        <Link
          href="/dashboard/listings"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-brand-teal"
        >
          <p className="text-sm font-medium text-slate-500">{t("statListings")}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{listingsCount ?? 0}</p>
        </Link>
        <Link
          href="/dashboard/requests"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-brand-teal"
        >
          <p className="text-sm font-medium text-slate-500">{t("statPendingRequests")}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{pendingRequestsCount ?? 0}</p>
        </Link>
      </div>

      <div className="mt-6">
        <ProfileForm host={host} />
      </div>

      <div className="mt-6 max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {quickLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center justify-between px-5 py-4 text-sm text-slate-700 hover:bg-slate-50 ${
              i > 0 ? "border-t border-slate-100" : ""
            }`}
          >
            {link.label}
            <span aria-hidden className="text-slate-300">
              ›
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
