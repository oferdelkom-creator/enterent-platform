"use client";

import { useState, useTransition } from "react";
import { inviteAdmin } from "./actions";

export default function InviteForm() {
  const [isPending, startTransition] = useTransition();
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    setInviteLink(null);
    startTransition(async () => {
      try {
        const { token } = await inviteAdmin(formData);
        const origin = window.location.origin;
        setInviteLink(`${origin}/invite/${token}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to create invite");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Invite an assistant</h2>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Role</label>
        <select name="role" defaultValue="assistant" className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm">
          <option value="assistant">Assistant</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-700">Permissions</p>
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input type="checkbox" name="can_manage_hosts" defaultChecked /> Manage hosts
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input type="checkbox" name="can_manage_requests" defaultChecked /> Manage requests
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input type="checkbox" name="can_manage_admins" /> Manage admins
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-slate-900 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {isPending ? "Creating invite..." : "Create invite"}
      </button>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {inviteLink && (
        <div className="rounded-md bg-slate-50 p-3 text-xs text-slate-600">
          <p className="mb-1 font-medium text-slate-900">Invite link created — send it to the invitee:</p>
          <p className="break-all font-mono">{inviteLink}</p>
        </div>
      )}
    </form>
  );
}
