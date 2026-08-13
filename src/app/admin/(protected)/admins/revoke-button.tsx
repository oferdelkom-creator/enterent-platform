"use client";

import { useTransition } from "react";
import { revokeAdmin } from "./actions";

export default function RevokeButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => revokeAdmin(userId))}
      className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
    >
      Remove
    </button>
  );
}
