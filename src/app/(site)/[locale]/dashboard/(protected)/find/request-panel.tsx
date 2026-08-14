"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { createRequest } from "./actions";

type OwnListing = { id: string; title: string };

export default function RequestPanel({
  targetHostId,
  targetListingId,
  ownListings,
}: {
  targetHostId: string;
  targetListingId: string;
  ownListings: OwnListing[];
}) {
  const t = useTranslations("Find");
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"swap" | "backup">("swap");
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createRequest(formData);
      setSent(true);
    });
  }

  if (sent) {
    return <p className="text-xs font-medium text-emerald-700">{t("requestSent")}</p>;
  }

  if (!open) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => {
            setType("swap");
            setOpen(true);
          }}
          className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-800"
        >
          {t("requestSwap")}
        </button>
        <button
          onClick={() => {
            setType("backup");
            setOpen(true);
          }}
          className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          {t("requestBackup")}
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="target_host_id" value={targetHostId} />
      <input type="hidden" name="target_listing_id" value={targetListingId} />

      <p className="text-xs font-medium text-slate-700">
        {type === "swap" ? t("proposeSwap") : t("askForBackup")}
      </p>

      {type === "swap" && ownListings.length > 0 && (
        <select
          name="requester_listing_id"
          required
          className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
        >
          <option value="">{t("offerWhichListing")}</option>
          {ownListings.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
        </select>
      )}

      <div className="grid grid-cols-2 gap-2">
        <input name="start_date" type="date" className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs" />
        <input name="end_date" type="date" className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs" />
      </div>

      <textarea
        name="message"
        placeholder={t("shortMessage")}
        rows={2}
        className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {isPending ? t("sending") : t("sendRequest")}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
