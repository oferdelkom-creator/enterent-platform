import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("id, title, content, created_at, hosts(full_name, city, country)")
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();

  const host = post.hosts as unknown as {
    full_name: string;
    city: string | null;
    country: string | null;
  } | null;

  const t = await getTranslations("PublicBlog");
  const locale = await getLocale();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/blog" className="text-xs text-slate-500 hover:underline">
        {t("backToBlog")}
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-slate-900">{post.title}</h1>
      <p className="mt-1 text-xs text-slate-400">
        {host?.full_name ?? t("aHost")}
        {host?.city ? ` · ${[host.city, host.country].filter(Boolean).join(", ")}` : ""}
        {" · "}
        {new Date(post.created_at).toLocaleDateString(locale)}
      </p>

      <div className="mt-6 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {post.content}
      </div>
    </main>
  );
}
