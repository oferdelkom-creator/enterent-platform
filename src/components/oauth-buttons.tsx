"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { routing } from "@/i18n/routing";

const providers = ["google", "facebook"] as const;

export default function OAuthButtons({
  redirectPath,
  disabled,
  onDisabledClick,
}: {
  redirectPath: string;
  disabled?: boolean;
  onDisabledClick?: () => void;
}) {
  const t = useTranslations("OAuthButtons");
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  async function handleOAuth(provider: (typeof providers)[number]) {
    if (disabled) {
      onDisabledClick?.();
      return;
    }

    setError(null);
    setLoadingProvider(provider);

    try {
      const supabase = createClient();
      const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`;

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${localePrefix}${redirectPath}`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setLoadingProvider(null);
      }
      // On success the browser navigates away to the provider, so no further
      // state update is needed (or possible) here.
    } catch (e) {
      setError(e instanceof Error ? `${t("unexpectedErrorPrefix")} ${e.message}` : t("unexpectedError"));
      setLoadingProvider(null);
    }
  }

  return (
    <div className="space-y-2">
      {providers.map((p) => (
        <button
          key={p}
          type="button"
          disabled={loadingProvider !== null}
          onClick={() => handleOAuth(p)}
          className="w-full rounded-md border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingProvider === p ? t("redirecting") : t(`continueWith.${p}`)}
        </button>
      ))}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
