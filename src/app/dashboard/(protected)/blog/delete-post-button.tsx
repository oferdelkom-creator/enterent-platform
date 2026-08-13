"use client";

import { useTransition } from "react";
import { deleteBlogPost } from "./actions";

export default function DeletePostButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => deleteBlogPost(postId))}
      className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
    >
      Delete
    </button>
  );
}
