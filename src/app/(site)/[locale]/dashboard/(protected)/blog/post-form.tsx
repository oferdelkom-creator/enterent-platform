"use client";

import { useRef, useTransition } from "react";
import { useTranslations } from "next-intl";
import { createBlogPost } from "./actions";

export default function PostForm() {
  const t = useTranslations("DashboardBlog");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createBlogPost(formData);
      formRef.current?.reset();
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-slate-900">{t("writePost")}</h2>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">{t("postTitle")}</label>
        <input name="title" required className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm" />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">{t("story")}</label>
        <textarea
          name="content"
          required
          rows={8}
          placeholder={t("storyPlaceholder")}
          className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-navy px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-navy-light disabled:opacity-50"
      >
        {isPending ? t("publishing") : t("publish")}
      </button>
    </form>
  );
}
