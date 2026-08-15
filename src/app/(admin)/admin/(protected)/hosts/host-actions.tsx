"use client";

import { useState, useTransition } from "react";
import { setHostVerificationStatus, deleteHost } from "./actions";

export default function HostActions({ hostId, hostName }: { hostId: string; hostName: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    const confirmed = window.confirm(
      `Permanently delete ${hostName}? This removes their profile, listings, requests, blog posts, and login access. This cannot be undone.`
    );
    if (!confirmed) return;

    setError(null);
    startTransition(async () => {
      try {
        await deleteHost(hostId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to delete host");
      }
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
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
        <button
          disabled={isPending}
          onClick={handleDelete}
          className="rounded-md border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
