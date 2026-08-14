"use client";

import { useState } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  async function handleOAuth(provider: "google" | "facebook") {
    if (disabled) {
      onDisabledClick?.();
      return;
    }

    setError(null);
    setLoadingProvider(provider);

    try {
      const supabase = createClient();

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${redirectPath}`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setLoadingProvider(null);
      }
      // On success the browser navigates away to the provider, so no further
      // state update is needed (or possible) here.
    } catch (e) {
      setError(
        e instanceof Error
          ? `Unexpected error: ${e.message}`
          : "Unexpected error contacting the server. Please try again."
      );
      setLoadingProvider(null);
    }
  }

  return (
    <div className="space-y-2">
      {providers.map((p) => (
        <button
          key={p.id}
          type="button"
          disabled={loadingProvider !== null}
          onClick={() => handleOAuth(p.id)}
          className="w-full rounded-md border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingProvider === p.id ? "Redirecting..." : p.label}
        </button>
      ))}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
