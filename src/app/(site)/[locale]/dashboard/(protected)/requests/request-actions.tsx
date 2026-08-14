"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateRequestStatus } from "./actions";

export default function RequestActions({
  requestId,
  direction,
}: {
  requestId: string;
  direction: "incoming" | "outgoing";
}) {
  const t = useTranslations("Requests");
  const [isPending, startTransition] = useTransition();

  if (direction === "incoming") {
    return (
      <div className="flex gap-2">
        <button
          disabled={isPending}
          onClick={() => startTransition(() => updateRequestStatus(requestId, "accepted"))}
          className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {t("accept")}
        </button>
        <button
          disabled={isPending}
          onClick={() => startTransition(() => updateRequestStatus(requestId, "declined"))}
          className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
        >
          {t("decline")}
        </button>
      </div>
    );
  }

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => updateRequestStatus(requestId, "cancelled"))}
      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
    >
      {t("cancel")}
    </button>
  );
}
