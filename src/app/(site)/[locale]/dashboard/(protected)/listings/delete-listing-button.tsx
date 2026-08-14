"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { deleteListing } from "./actions";

export default function DeleteListingButton({ listingId }: { listingId: string }) {
  const t = useTranslations("AddListing");
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => deleteListing(listingId))}
      className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
    >
      {t("remove")}
    </button>
  );
}
