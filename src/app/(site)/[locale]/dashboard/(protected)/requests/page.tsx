import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import RequestActions from "./request-actions";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-emerald-100 text-emerald-800",
  declined: "bg-red-100 text-red-800",
  cancelled: "bg-slate-100 text-slate-600",
  completed: "bg-blue-100 text-blue-800",
};

export default async function DashboardRequestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const t = await getTranslations("Requests");

  const { data: host } = await supabase
    .from("hosts")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!host) {
    return <p className="text-sm text-slate-500">{t("completeProfileFirst")}</p>;
  }

  const { data: requests } = await supabase
    .from("requests")
    .select("*")
    .or(`requester_host_id.eq.${host.id},target_host_id.eq.${host.id}`)
    .order("created_at", { ascending: false });

  const hostIds = Array.from(
    new Set((requests ?? []).flatMap((r) => [r.requester_host_id, r.target_host_id]))
  );

  const { data: hostsData } = hostIds.length
    ? await supabase.from("hosts").select("id, full_name").in("id", hostIds)
    : { data: [] };

  const hostNameById = new Map((hostsData ?? []).map((h) => [h.id, h.full_name]));

  const incoming = (requests ?? []).filter((r) => r.target_host_id === host.id);
  const outgoing = (requests ?? []).filter((r) => r.requester_host_id === host.id);

  function RequestRow({ request, direction }: { request: (typeof incoming)[number]; direction: "incoming" | "outgoing" }) {
    const otherHostId = direction === "incoming" ? request.requester_host_id : request.target_host_id;
    return (
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-900">
            {request.type === "swap" ? t("staySwap") : t("emergencyBackup")} —{" "}
            {hostNameById.get(otherHostId) ?? t("unknownHost")}
          </p>
          <p className="text-xs text-slate-500">
            {request.start_date && request.end_date
              ? `${request.start_date} → ${request.end_date}`
              : t("noDatesSpecified")}
          </p>
          {request.message && <p className="mt-1 text-xs text-slate-600">&quot;{request.message}&quot;</p>}
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[request.status]}`}>
            {t(`status.${request.status}`)}
          </span>
          {request.status === "pending" && <RequestActions requestId={request.id} direction={direction} />}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">{t("incoming")}</h2>
        <div className="space-y-3">
          {incoming.length ? (
            incoming.map((r) => <RequestRow key={r.id} request={r} direction="incoming" />)
          ) : (
            <p className="text-sm text-slate-400">{t("noIncoming")}</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">{t("outgoing")}</h2>
        <div className="space-y-3">
          {outgoing.length ? (
            outgoing.map((r) => <RequestRow key={r.id} request={r} direction="outgoing" />)
          ) : (
            <p className="text-sm text-slate-400">{t("noOutgoing")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
