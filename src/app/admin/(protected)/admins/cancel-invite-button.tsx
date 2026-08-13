"use client";

import { useTransition } from "react";
import { cancelInvite } from "./actions";

export default function CancelInviteButton({ inviteId }: { inviteId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => cancelInvite(inviteId))}
      className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
    >
      Cancel
    </button>
  );
}
