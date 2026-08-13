"use client";

import { createClient } from "@/lib/supabase/client";

const providers = [
  { id: "google" as const, label: "Continue with Google" },
  { id: "facebook" as const, label: "Continue with Facebook" },
];

export default function OAuthButtons({
  redirectPath,
  disabled,
  onDisabledClick,
}: {
  redirectPath: string;
  disabled?: boolean;
  onDisabledClick?: () => void;
}) {
  async function handleOAuth(provider: "google" | "facebook") {
    if (disabled) {
      onDisabledClick?.();
      return;
    }

    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectPath}`,
      },
    });
  }

  return (
    <div className="space-y-2">
      {providers.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => handleOAuth(p.id)}
          className="w-full rounded-md border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
