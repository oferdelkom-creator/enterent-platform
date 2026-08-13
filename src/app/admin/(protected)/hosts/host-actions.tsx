"use client";

import { useTransition } from "react";
import { setHostVerificationStatus } from "./actions";

export default function HostActions({ hostId }: { hostId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        disabled={isPending}
        onClick={() => startTransition(() => setHostVerificationStatus(hostId, "verified"))}
        className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
      >
        Verify
      </button>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => setHostVerificationStatus(hostId, "rejected"))}
        className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
