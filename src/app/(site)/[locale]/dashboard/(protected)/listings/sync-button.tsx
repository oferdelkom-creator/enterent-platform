"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { syncListingCalendar } from "./actions";

export default function SyncButton({ listingId }: { listingId: string }) {
  const t = useTranslations("AddListing");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSync() {
    setError(null);
    startTransition(async () => {
      try {
        await syncListingCalendar(listingId);
      } catch (e) {
        setError(e instanceof Error ? e.message : t("syncFailed"));
      }
    });
  }

  return (
    <div>
      <button
        disabled={isPending}
        onClick={handleSync}
        className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        {isPending ? t("syncing") : t("syncCalendar")}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
