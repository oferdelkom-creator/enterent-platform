"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type InviteInfo = {
  email: string;
  role: string;
  expires_at: string;
  accepted_at: string | null;
};

export default function AcceptInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .rpc("get_invite_by_token", { p_token: token })
      .then(({ data, error }) => {
        if (error || !data?.length) {
          setError("Invite not found.");
        } else {
          setInvite(data[0]);
        }
        setLoading(false);
      });
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!invite) return;
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: invite.email,
      password,
    });

    if (signUpError || !signUpData.user) {
      setError(signUpError?.message ?? "Failed to create account");
      setSubmitting(false);
      return;
    }

    const { error: acceptError } = await supabase.rpc("accept_admin_invite", {
      p_token: token,
      p_user_id: signUpData.user.id,
      p_email: invite.email,
    });

    if (acceptError) {
      setError(acceptError.message);
      setSubmitting(false);
      return;
    }

    if (signUpData.session) {
      router.push("/admin");
    } else {
      router.push("/admin/login?confirmEmail=1");
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading...</div>;
  }

  if (!invite || invite.accepted_at || new Date(invite.expires_at) < new Date()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-sm rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">Invite unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">
            This invite link is invalid, already used, or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Join EnterRent Admin</h1>
          <p className="mt-1 text-sm text-slate-500">
            Set a password for <span className="font-medium">{invite.email}</span> ({invite.role}).
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Accept invite"}
        </button>
      </form>
    </div>
  );
}
