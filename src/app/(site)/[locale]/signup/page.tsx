"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { withTimeout } from "@/lib/with-timeout";
import { Logo } from "@/components/logo";
import OAuthButtons from "@/components/oauth-buttons";

export default function SignupPage() {
  const t = useTranslations("Signup");
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!agreedToTerms) {
      setError(t("mustAgree"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        }),
        15000,
        "sign up"
      );

      if (signUpError || !data.user) {
        setError(signUpError?.message ?? t("failedToCreate"));
        return;
      }

      const { error: profileError } = await withTimeout(
        supabase.rpc("create_host_profile", {
          p_user_id: data.user.id,
          p_full_name: fullName,
        }),
        15000,
        "profile creation"
      );

      if (profileError) {
        setError(profileError.message);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setCheckEmail(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t("unexpectedError"));
    } finally {
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-sm rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">{t("checkEmailTitle")}</h1>
          <p className="mt-2 text-sm text-slate-500">{t("checkEmailBody", { email })}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm space-y-5 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <Logo />
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{t("heading")}</h1>
          <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
        </div>

        <OAuthButtons
          redirectPath="/dashboard"
          disabled={!agreedToTerms}
          onDisabledClick={() => setError(t("mustAgree"))}
        />

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          {t("or")}
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">{t("fullName")}</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">{t("email")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">{t("password")}</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>

          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              {t("agreePrefix")}{" "}
              <Link href="/terms" target="_blank" className="font-medium text-slate-900 hover:underline">
                {t("termsOfService")}
              </Link>{" "}
              {t("and")}{" "}
              <Link href="/privacy" target="_blank" className="font-medium text-slate-900 hover:underline">
                {t("privacyPolicy")}
              </Link>
              .
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? t("creatingAccount") : t("submit")}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          {t("haveAccount")}{" "}
          <Link href="/login" className="font-medium text-slate-900 hover:underline">
            {t("logIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
